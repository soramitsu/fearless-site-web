import assert from 'node:assert/strict'
import { createHash, generateKeyPairSync } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { auditDependencies, isBackportedAdvisory } from './audit-dependencies.mjs'

const require = createRequire(import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('./dependency-patches.json', import.meta.url)))

for (const [name, patch] of Object.entries(manifest)) {
  test(`${name}: installed source and patch match the reviewed backport`, () => {
    const packagePath = require.resolve(`${name}/package.json`)
    assert.equal(JSON.parse(readFileSync(packagePath)).version, patch.version)
    const digest = path => createHash('sha256').update(readFileSync(path)).digest('hex')
    for (const [file, hash] of Object.entries(patch.files)) {
      assert.equal(digest(resolve(dirname(packagePath), file)), hash, `${name}/${file}`)
    }
    assert.equal(digest(new URL(`../${patch.patch}`, import.meta.url)), patch.patchSha256)
  })
}

const braces = require('braces')
for (const operation of ['compile', 'expand', 'stringify']) {
  test(`braces ${operation} rejects deep and cyclic ASTs before recursion`, () => {
    let ast = { type: 'text', value: 'x' }
    for (let i = 0; i < 12000; i++) ast = { type: 'root', nodes: [ast] }
    assert.throws(() => braces[operation](ast), { name: 'SyntaxError', message: /safe depth/ })
    const cycle = { type: 'root', nodes: [] }
    cycle.nodes.push(cycle)
    assert.throws(() => braces[operation](cycle), { name: 'SyntaxError', message: /acyclic/ })
  })
}
test('braces rejects deep patterns while preserving ordinary globs and shared nodes', () => {
  for (const [open, close] of [['{', '}'], ['(', ')']]) {
    assert.throws(() => braces.parse(open.repeat(4000) + 'x' + close.repeat(4000)), SyntaxError)
  }
  assert.deepEqual(braces.expand('a/{1..3}/{x,y}'), ['a/1/x', 'a/1/y', 'a/2/x', 'a/2/y', 'a/3/x', 'a/3/y'])
  const leaf = { type: 'text', value: 'a' }
  assert.equal(braces.stringify({ type: 'root', nodes: [leaf, leaf] }), 'aa')
  assert.doesNotThrow(() => braces.compile('{'.repeat(64) + 'x,y' + '}'.repeat(64)))
})

test('node-forge rejects extra DigestAlgorithm children and accepts valid signatures', () => {
  const forge = require('node-forge')
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 1024 })
  const key = forge.pki.privateKeyFromPem(privateKey.export({ type: 'pkcs1', format: 'pem' }).toString())
  const publicKey = forge.pki.setRsaPublicKey(key.n, key.e)
  const md = forge.md.sha256.create().update('dependency regression')
  const digest = md.digest().getBytes()
  assert.equal(publicKey.verify(digest, key.sign(md)), true)
  const { asn1 } = forge
  const sequence = children => asn1.create(asn1.Class.UNIVERSAL, asn1.Type.SEQUENCE, true, children)
  const oid = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OID, false, asn1.oidToDer(forge.pki.oids.sha256).getBytes())
  const empty = asn1.create(asn1.Class.UNIVERSAL, asn1.Type.NULL, false, '')
  const octets = value => asn1.create(asn1.Class.UNIVERSAL, asn1.Type.OCTETSTRING, false, value)
  for (const parameters of [[oid], [oid, empty]]) {
    const valid = asn1.toDer(sequence([sequence(parameters), octets(digest)])).getBytes()
    assert.equal(publicKey.verify(digest, key.sign(valid, 'NONE')), true)
    const invalid = asn1.toDer(sequence([sequence([...parameters, octets('garbage')]), octets(digest)])).getBytes()
    assert.throws(() => publicKey.verify(digest, key.sign(invalid, 'NONE')), /valid RSASSA-PKCS1-v1_5 DigestInfo/)
  }
})

test('audit exceptions apply only to the two patched versions and exact advisories', () => {
  for (const [value, patch] of Object.entries(manifest)) {
    const children = { URL: patch.advisory, 'Tree Versions': [patch.version] }
    assert.equal(isBackportedAdvisory({ value, source: 'patched-version', children }), true)
    assert.equal(isBackportedAdvisory({ value, source: 'registry-locator', children }), false)
    assert.equal(isBackportedAdvisory({ value, children }), false)
    assert.equal(isBackportedAdvisory({ value, source: 'patched-version', children: { ...children, URL: 'https://example.com/new-advisory' } }), false)
    assert.equal(isBackportedAdvisory({ value, source: 'patched-version', children: { ...children, 'Tree Versions': ['0.0.0'] } }), false)
    assert.equal(isBackportedAdvisory({ value, source: 'patched-version', children: { ...children, 'Tree Versions': [patch.version, '0.0.0'] } }), false)
  }
  assert.equal(isBackportedAdvisory({ value: 'unknown', children: {} }), false)
})

const reviewedLocators = Object.entries(manifest).map(([name, patch]) => ({
  value: `${name}@patch:${name}@npm%3A${patch.version}#~/${patch.patch}::version=${patch.version}&hash=fixture`,
  children: { Version: patch.version },
}))
const compatibilityLocator = (name, version, virtual = false) => ({
  value: `${name}@${virtual ? 'virtual:fixture#' : ''}patch:${encodeURIComponent(`${name}@npm:${version}`)}#optional!builtin<compat/${name}>::version=${version}`,
  children: { Version: version },
})
const patchInfo = [
  ...reviewedLocators,
  compatibilityLocator('fsevents', '2.3.3'),
  compatibilityLocator('resolve', '1.22.13'),
  compatibilityLocator('typescript', '5.9.3'),
]
const advisory = (url = 'https://github.com/advisories/GHSA-future-advisory') => ({
  id: 123456, url, title: 'Regression fixture advisory', severity: 'high', vulnerable_versions: '*',
})

function auditFixture({ info = patchInfo, yarn = [], bulk = {}, infoStatus = 0, auditStatus, httpStatus = 200 } = {}) {
  const calls = []
  const payloads = []
  return {
    calls,
    payloads,
    dependencies: {
      runYarn(args) {
        calls.push(args)
        if (args[0] === 'info') return {
          status: infoStatus, stdout: typeof info === 'string' ? info : info.map(row => JSON.stringify(row)).join('\n'),
        }
        assert.equal(args[0], 'npm')
        return { status: auditStatus ?? (yarn.length ? 1 : 0), stdout: yarn.map(row => JSON.stringify(row)).join('\n') }
      },
      async fetchRegistry(url, options) {
        assert.equal(url, 'https://registry.npmjs.org/-/npm/v1/security/advisories/bulk')
        assert.equal(options.method, 'POST')
        payloads.push(JSON.parse(options.body))
        return { ok: httpStatus === 200, status: httpStatus, json: async () => bulk }
      },
    },
  }
}

for (const production of [false, true]) {
  const scope = production ? 'production' : 'full'
  test(`${scope} audit queries all patch origins and only exempts verified backports`, async () => {
    const bulk = Object.fromEntries(Object.entries(manifest).map(([name, patch]) => [name, [advisory(patch.advisory)]]))
    const fixture = auditFixture({
      info: [...patchInfo, ...reviewedLocators, compatibilityLocator('@example/tool', '1.2.3', true), compatibilityLocator('@example/tool', '2.0.0')], bulk,
    })
    assert.equal(await auditDependencies(production, fixture.dependencies), 0)
    assert.deepEqual(fixture.payloads, [{
      braces: ['3.0.3'], 'node-forge': ['1.4.0'], fsevents: ['2.3.3'], resolve: ['1.22.13'], typescript: ['5.9.3'],
      '@example/tool': ['1.2.3', '2.0.0'],
    }])
    assert.deepEqual(fixture.calls[1], ['info', '--all', '--recursive', '--json'])
    assert.equal(fixture.calls[0].includes('production'), production)
  })

  test(`${scope} audit fails on future advisories in every patched dependency`, async () => {
    for (const name of ['braces', 'node-forge', 'fsevents', 'resolve', 'typescript']) {
      const fixture = auditFixture({ bulk: { [name]: [advisory()] } })
      assert.equal(await auditDependencies(production, fixture.dependencies), 1, name)
    }
    const fixture = auditFixture({
      info: [...patchInfo, compatibilityLocator('braces', '3.0.4')],
      bulk: { braces: [advisory(manifest.braces.advisory)] },
    })
    assert.equal(await auditDependencies(production, fixture.dependencies), 1, 'An exception cannot cover an additional version')
  })

  test(`${scope} audit never exempts unpatched registry findings`, async () => {
    for (const [name, patch] of Object.entries(manifest)) {
      const fixture = auditFixture({ yarn: [{
        value: name, source: 'patched-version', children: { URL: patch.advisory, 'Tree Versions': [patch.version] },
      }] })
      assert.equal(await auditDependencies(production, fixture.dependencies), 1)
    }
  })

  test(`${scope} audit verifies all dependency edges for Yarn-reported patch base versions`, async () => {
    for (const [name, patch] of Object.entries(manifest)) {
      const patched = reviewedLocators.find(row => row.value.startsWith(`${name}@`))
      const parent = { value: 'consumer@npm:1.0.0', children: { Version: '1.0.0', Dependencies: [{ locator: patched.value }] } }
      const finding = { value: name, children: { URL: patch.advisory, 'Tree Versions': [patch.version], Dependents: [parent.value] } }
      const info = [...patchInfo, parent, { value: `${name}@npm:${patch.version}`, children: { Version: patch.version } }]
      assert.equal(await auditDependencies(production, auditFixture({ info, yarn: [finding] }).dependencies), 0)
      const unpatched = { value: 'other@npm:1.0.0', children: { Version: '1.0.0', Dependencies: [{ locator: `${name}@npm:${patch.version}` }] } }
      assert.equal(await auditDependencies(production, auditFixture({ info: [...info, unpatched], yarn: [finding] }).dependencies), 1)
      for (const children of [
        { ...finding.children, URL: 'https://github.com/advisories/GHSA-future-advisory' },
        { ...finding.children, Dependents: ['unknown@npm:1.0.0'] },
        { ...finding.children, Dependents: [] },
        { ...finding.children, 'Tree Versions': [patch.version, '0.0.0'] },
      ]) {
        assert.equal(await auditDependencies(production, auditFixture({ info, yarn: [{ ...finding, children }] }).dependencies), 1)
      }
    }
  })

  test(`${scope} audit fails closed when a reviewed patch is missing or replaced`, async () => {
    for (const missing of reviewedLocators) {
      const fixture = auditFixture({ info: patchInfo.filter(row => row !== missing) })
      await assert.rejects(auditDependencies(production, fixture.dependencies), /Missing reviewed patch/)
      assert.deepEqual(fixture.payloads, [])
    }
    const unreviewed = { ...reviewedLocators[0], value: reviewedLocators[0].value.replace(manifest.braces.patch, '.yarn/patches/other.patch') }
    const fixture = auditFixture({ info: [...patchInfo, unreviewed] })
    await assert.rejects(auditDependencies(production, fixture.dependencies), /Unreviewed patch/)
  })
}

test('audit fails closed on malformed package enumeration and command failures', async () => {
  for (const info of [
    [], 'not json', [{}], [{ value: 'braces@patch:invalid', children: { Version: '3.0.3' } }],
    [...patchInfo, { ...reviewedLocators[0], children: { Version: '0.0.0' } }],
    [...patchInfo, { value: 'local@patch:local@file%3Alocal#patch', children: { Version: '1.0.0' } }],
  ]) {
    const fixture = auditFixture({ info })
    await assert.rejects(auditDependencies(false, fixture.dependencies))
  }
  for (const options of [{ infoStatus: 1 }, { auditStatus: 1 }, { auditStatus: 2 }, { auditStatus: null }, { httpStatus: 503 }]) {
    // A null process status is a signal/termination, not success.
    const fixture = auditFixture(options)
    if (options.auditStatus === null) fixture.dependencies.runYarn = () => ({ status: null, stdout: '' })
    await assert.rejects(auditDependencies(false, fixture.dependencies))
  }
})

test('audit fails closed on malformed registry response schemas', async () => {
  for (const bulk of [
    [], true, 1, '', null,
    { unexpected: [] }, { braces: {} }, { braces: [null] }, { braces: [[]] },
    ...['id', 'url', 'title', 'severity', 'vulnerable_versions'].map(field => {
      const value = advisory(manifest.braces.advisory)
      delete value[field]
      return { braces: [value] }
    }),
    { braces: [{ ...advisory(), severity: 'unknown' }] },
  ]) {
    for (const production of [false, true]) {
      const fixture = auditFixture({ bulk })
      await assert.rejects(auditDependencies(production, fixture.dependencies), /Unexpected patch registry/)
    }
  }
})
