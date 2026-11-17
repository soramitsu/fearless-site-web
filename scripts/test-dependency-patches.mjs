import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { createHash, generateKeyPairSync } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { auditDependencies, isBackportedAdvisory, isVendoredAdvisory, verifyVendoredGuards } from './audit-dependencies.mjs'

const require = createRequire(import.meta.url)
const manifest = JSON.parse(readFileSync(new URL('./dependency-patches.json', import.meta.url)))
const root = fileURLToPath(new URL('../', import.meta.url))
const vendored = JSON.parse(readFileSync(new URL('./vendored-dependencies.json', import.meta.url)))

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

// picomatch resolves to vendor/picomatch-2 and vendor/picomatch-4: upstream 2.3.2 and 4.0.7 with a guard for
// GHSA-fc5q-39xc-vjpf, which no upstream release fixes: a `+(...)` or `*(...)` extglob whose body is not a plain
// sequence of literal characters and single-character classes is emitted as a literal string.
const sha256 = value => createHash('sha256').update(value).digest('hex')
const withoutGuard = source => source.replace(/[ \t]*\/\/ fearless-guard:start[\s\S]*?\/\/ fearless-guard:end\n\n/g, '')
const listed = (directory, base = directory) => readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
  entry.isDirectory() ? listed(join(directory, entry.name), base) : [relative(base, join(directory, entry.name))])
for (const [directory, { version, upstreamSha256, guardedFiles }] of Object.entries(vendored.picomatch.copies)) {
  test(`picomatch ${version} in ${directory} is upstream outside the marked guard`, () => {
    const copy = join(root, directory)
    assert.deepEqual(listed(copy).sort(), [...Object.keys(upstreamSha256), 'README.md', 'package.json'].sort())
    for (const [file, digest] of Object.entries(upstreamSha256)) {
      const source = readFileSync(join(copy, file), 'utf8')
      assert.equal(sha256(file === 'lib/parse.js' ? withoutGuard(source) : source), digest, file)
      assert.equal(source.includes('fearless-guard'), file === 'lib/parse.js', file)
    }
    assert.deepEqual(Object.keys(guardedFiles), ['lib/parse.js'])
    assert.equal(sha256(readFileSync(join(copy, 'lib/parse.js'))), guardedFiles['lib/parse.js'])
    const packageJson = JSON.parse(readFileSync(join(copy, 'package.json'), 'utf8'))
    assert.deepEqual([packageJson.name, packageJson.version, packageJson.license, packageJson.private], ['picomatch', version, 'MIT', true])
  })
}

// Every installed picomatch package, hoisted or nested, must be a vendored copy: a range that no resolution covers
// would otherwise bring the unguarded registry package back. Copies bundled inside another package's files (rollup,
// rollup-plugin-visualizer, tsx) are not packages and cannot be resolved; docs/dependency-security.md lists them.
test('every installed picomatch package is a guarded vendored copy', () => {
  const copies = Object.entries(vendored.picomatch.copies)
  const installed = installedPackages('picomatch')
  assert.ok(installed.length > 0)
  const versions = new Set()
  for (const location of installed) {
    const { version } = JSON.parse(readFileSync(join(location, 'package.json'), 'utf8'))
    const match = copies.find(([, copy]) => copy.version === version)
    assert.ok(match, `${relative(root, location)} is picomatch ${version}`)
    for (const file of [...Object.keys(match[1].upstreamSha256), 'package.json']) {
      assert.deepEqual(readFileSync(join(location, file)), readFileSync(join(root, match[0], file)), `${relative(root, location)}/${file}`)
    }
    versions.add(version)
  }
  assert.deepEqual([...versions].sort(), copies.map(([, copy]) => copy.version).sort())
})

// [pattern, input, expected, options]: what upstream 2.3.2 and 4.0.7 both answer, unchanged by the guard.
const ordinaryMatches = [
  ['*.js','a.js',true],
  ['*.js','a.ts',false],
  ['*.js','.a.js',false],
  ['*.js','dir/a.js',false],
  ['**/*.vue','App.vue',true],
  ['**/*.vue','src/screens/wallet&asset/TransferForm.vue',true],
  ['**/*.vue','src/a.ts',false],
  ['**/*.vue','src/.hidden/a.vue',false],
  ['src/**/*.{ts,tsx,vue}','src/main.ts',true],
  ['src/**/*.{ts,tsx,vue}','src/a/b/c.vue',true],
  ['src/**/*.{ts,tsx,vue}','src/a.js',false],
  ['src/**/*.{ts,tsx,vue}','tests/a.ts',false],
  ['**/node_modules/**','node_modules/a/index.js',true],
  ['**/node_modules/**','src/node_modules/b.js',true],
  ['**/node_modules/**','src/a.js',false],
  ['!**/node_modules/**','node_modules/a/index.js',false],
  ['!**/node_modules/**','src/a.js',true],
  ['**/*.d.ts','src/a.d.ts',true],
  ['**/*.d.ts','src/a.ts',false],
  ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}','tests/unit/a.spec.ts',true],
  ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}','tests/unit/a.ts',false],
  ['tests/**/*.{test,spec}.{js,ts,jsx,tsx}','tests/a.test.jsx',true],
  ['src/**/*.{js,jsx,vue,ts,tsx}','src/a.vue',true],
  ['src/**/*.{js,jsx,vue,ts,tsx}','src/a.d.ts',true],
  ['src/**/*.{js,jsx,vue,ts,tsx}','src/a.css',false],
  ['a/b/*','a/b/c',true],
  ['a/b/*','a/b/c/d',false],
  ['a/b/*','a/b',false],
  ['?.js','a.js',true],
  ['?.js','ab.js',false],
  ['[abc].js','a.js',true],
  ['[abc].js','d.js',false],
  ['[!a].js','a.js',true],
  ['[!a].js','b.js',false],
  ['{a,b}/*.ts','a/x.ts',true],
  ['{a,b}/*.ts','c/x.ts',false],
  ['file-[0-9].txt','file-1.txt',true],
  ['file-[0-9].txt','file-a.txt',false],
  ['**','a',true],
  ['**','a/b/c',true],
  ['**','.a',false],
  ['*','a',true],
  ['*','a/b',false],
  ['*','.a',false],
  ['@(a|b).js','a.js',true],
  ['@(a|b).js','b.js',true],
  ['@(a|b).js','c.js',false],
  ['@(a|b).js','ab.js',false],
  ['?(a).js','.js',true],
  ['?(a).js','a.js',true],
  ['?(a).js','aa.js',false],
  ['!(*.d).ts','a.ts',true],
  ['!(*.d).ts','a.d.ts',false],
  ['!(a|b)','a',false],
  ['!(a|b)','b',false],
  ['!(a|b)','c',true],
  ['+(a|b)','abc',false],
  ['+(a|b)','',false],
  ['*(a|b)c','abd',false],
  ['+([0-9])','123',true],
  ['+([0-9])','12a',false],
  ['*([a-z]).txt','abc.txt',true],
  ['*([a-z]).txt','.txt',true],
  ['*([a-z]).txt','a1.txt',false],
  ['+(ab)','abab',true],
  ['+(ab)','aba',false],
  ['+(abc)','abcabc',true],
  ['+(abc)','abcab',false],
  ['@(*.js|*.ts)','a.js',true],
  ['@(*.js|*.ts)','a.ts',true],
  ['@(*.js|*.ts)','a.css',false],
  ['?(*.min).js','a.min.js',true],
  ['?(*.min).js','.js',true],
  ['?(*.min).js','a.js',false],
  ['**/!(*.spec).ts','src/a.ts',true],
  ['**/!(*.spec).ts','src/a.spec.ts',false],
  ['+(a)*','aab',true],
  ['+(a)*','b',false],
  ['*+(a)','baa',true],
  ['*+(a)','b',false],
  ['a+(b)c','abbc',true],
  ['a+(b)c','ac',false],
  ['+(a\\*)','a*a*',true],
  ['+(a\\*)','aa',false],
  ['+([*])','**',true],
  ['+([*])','a',false],
  ['+("*")','**',true],
  ['+("*")','a',false],
  ['*.+(js|ts)','a.css',false],
  ['**/*.@(png|jpe?g|svg)','img/a.png',true],
  ['**/*.@(png|jpe?g|svg)','img/a.jpeg',false],
  ['**/*.@(png|jpe?g|svg)','img/a.jpg',false],
  ['**/*.@(png|jpe?g|svg)','img/a.gif',false],
  ['[[:alpha:]]*.md','README.md',true],
  ['[[:alpha:]]*.md','1.md',false],
  ['\\*.js','*.js',true],
  ['\\*.js','a.js',false],
  ['(a|b).js','a.js',true],
  ['(a|b).js','c.js',false],
  ['*.js','.a.js',true,{'dot':true}],
  ['*.js','a.js',true,{'dot':true}],
  ['*.JS','a.js',true,{'nocase':true}],
  ['+(a|b)','a',false,{'noextglob':true}],
  ['+(a|b)','abba',false,{'noextglob':true}],
  ['**/*.ts','src/a.ts',true,{'ignore':['**/node_modules/**']}],
  ['**/*.ts','node_modules/a.ts',false,{'ignore':['**/node_modules/**']}],
  ['a.js','x/y/a.js',true,{'basename':true}],
  ['a.js','x/y/b.js',false,{'basename':true}],
  ['+([ab])','abba',true],
  ['+([ab])','abc',false],
  ['*(a.b)','a.ba.b',true],
  ['*(a.b)','a.bab',false],
  ['+(a,b)','a,ba,b',true],
  ['+([!a])','!a!',true],
  ['+(\\d)','123',true],
  ['+(\\d)','12a',false],
]
// Repeated extglobs with an alternation: upstream matched them as extglobs; guarded, they match only their own text.
const literalOnlyMatches = [
  ['+(a|b)','a',false],
  ['+(a|b)','abba',false],
  ['+(a|b)','+(a|b)',true],
  ['*(a|b)c','c',false],
  ['*(a|b)c','abc',false],
  ['*(a|b)c','*(a|b)c',true],
  ['*.+(js|ts)','a.js',false],
  ['*.+(js|ts)','a.jsts',false],
  ['*.+(js|ts)','a.+(js|ts)',true],
]
for (const [directory, { version }] of Object.entries(vendored.picomatch.copies)) {
  const picomatch = require(join(root, directory))
  test(`picomatch ${version} ordinary matching is unchanged (${ordinaryMatches.length} cases)`, () => {
    for (const [pattern, input, expected, options] of ordinaryMatches) {
      assert.equal(picomatch.isMatch(input, pattern, options), expected, `${pattern} against ${input}`)
    }
  })
  test(`picomatch ${version} matches repeated extglobs with an alternation only as literal text`, () => {
    for (const [pattern, input, expected] of literalOnlyMatches) {
      assert.equal(picomatch.isMatch(input, pattern), expected, `${pattern} against ${input}`)
    }
  })
  test(`picomatch ${version} keeps upstream's opt-out and its flat rewrite of nested star extglobs`, () => {
    assert.equal(picomatch.makeRe('+(*a)', { maxExtglobRecursion: false }).source, '^(?:(?=.)(?:[^/]*?a)+)$')
    assert.equal(picomatch.makeRe('+(*(a))').source, '^(?:(?=.)a*)$')
    assert.equal(picomatch.isMatch('aaa', '+(*(a))'), true)
  })
}
// The sweep compiles every repeated extglob built from one or two of 28 atoms against both copies, checks each
// named ReDoS shape is literal, and holds every match against crafted strings to a CPU budget. It runs in a child
// stopped after five minutes because an unguarded copy never finishes.
test('repeated extglobs cannot backtrack (scripts/picomatch-extglob-sweep.cjs)', () => {
  const copies = Object.keys(vendored.picomatch.copies).map(directory => join(root, directory))
  const child = spawnSync(process.execPath, [join(root, 'scripts/picomatch-extglob-sweep.cjs'), ...copies], {
    encoding: 'utf8', timeout: 300_000,
  })
  assert.equal(child.error, undefined, `sweep stopped: ${child.error?.message}`)
  const report = JSON.parse(child.stdout)
  assert.deepEqual(report.failures, [])
  assert.equal(child.status, 0, child.stderr)
  for (const copy of report.copies) {
    assert.equal(copy.shapes, 35)
    assert.ok(copy.patterns > 4000 && copy.literal > 1000, JSON.stringify(copy))
  }
})
test('micromatch, anymatch and tinyglobby match through the guarded copies', () => {
  assert.deepEqual(require('micromatch')(['a.vue', 'b.ts', 'c.css'], ['*.{vue,ts}', '!b.*']), ['a.vue'])
  assert.equal(require('anymatch')(['**/*.vue', '!**/node_modules/**'], 'src/App.vue'), true)
  assert.deepEqual(
    require('tinyglobby').globSync(['vendor/picomatch-4/{index,posix}.js', 'vendor/picomatch-4/lib/!(parse|scan).js'], { cwd: root }).sort(),
    ['vendor/picomatch-4/index.js', 'vendor/picomatch-4/lib/constants.js', 'vendor/picomatch-4/lib/picomatch.js',
      'vendor/picomatch-4/lib/utils.js', 'vendor/picomatch-4/posix.js'],
  )
})

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

// node-forge 1.4.1 fixed GHSA-86w9-cpqp-85rv upstream; the site's 1.4.0 backport is gone, the regression test stays.
test('node-forge rejects extra DigestAlgorithm children and accepts valid signatures', () => {
  assert.equal(require('node-forge/package.json').version, '1.4.3')
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

// Nitro imports archiver 8 as an ES module while it reads the Nuxt configuration, and archiver's glob reader imports
// `Minimatch` by name. A resolution that gives the reader a CommonJS-only minimatch stops `nuxt prepare`, and with it
// every install, before any page is built.
test('archiver loads as an ES module and its glob reader matches with a patched minimatch', async () => {
  const archiverEntry = createRequire(require.resolve('nitropack/package.json')).resolve('archiver')
  assert.equal(typeof (await import(pathToFileURL(archiverEntry))).ZipArchive, 'function')
  const readerEntry = createRequire(archiverEntry).resolve('readdir-glob')
  const [major, minor, patch] = createRequire(readerEntry)('minimatch/package.json').version.split('.').map(Number)
  // GHSA-g3hv-75wg-m249 covers every minimatch from 7.0.0 up to 11.0.0.
  assert.ok(major > 11 || (major === 11 && (minor > 0 || patch >= 1)), `minimatch ${major}.${minor}.${patch}`)
  const { readdirGlob } = await import(pathToFileURL(resolve(dirname(readerEntry), 'index.mjs')))
  const matches = await new Promise((done, fail) => {
    const found = []
    readdirGlob(dirname(fileURLToPath(import.meta.url)), { pattern: '*dependenc*.{mjs,json}', ignore: ['test-*'] })
      .on('match', match => found.push(match.relative)).on('error', fail).on('end', () => done(found.sort()))
  })
  assert.deepEqual(matches, ['audit-dependencies.mjs', 'dependency-patches.json', 'vendored-dependencies.json'])
})

// Every installed copy of a package, hoisted or nested.
function installedPackages(name, directory = join(root, 'node_modules')) {
  const found = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue
    const packages = entry.name.startsWith('@')
      ? readdirSync(join(directory, entry.name)).map(scoped => join(entry.name, scoped))
      : [entry.name]
    for (const packageName of packages) {
      const location = join(directory, packageName)
      if (packageName === name) found.push(location)
      if (existsSync(join(location, 'node_modules'))) found.push(...installedPackages(name, join(location, 'node_modules')))
    }
  }
  return found
}

// Advisories closed by moving to a fixed upstream release rather than by a backport. Every installed copy must stay at
// or above the first version outside its advisory, so a resolution edit that brings an older copy back fails here.
const advisoryFloors = [
  ['fast-xml-parser', [5, 11, 3], 'GHSA-474x-hrwr-fgx4 covers 5.11.2 and earlier'],
  ['glob', [14, 0, 2], 'GHSA-3g3m-2fjr-6pw4 covers 9.0.0 to 14.0.1'],
  ['minimatch', [11, 0, 1], 'GHSA-g3hv-75wg-m249 covers 7.0.0 to 11.0.0'],
]
test('installed packages stay at or above their advisory floors', () => {
  const atLeast = (version, floor) => {
    const parts = version.split('.').map(Number)
    for (let index = 0; index < 3; index++) if (parts[index] !== floor[index]) return parts[index] > floor[index]
    return true
  }
  for (const [name, floor, advisory] of advisoryFloors) {
    const installed = installedPackages(name)
    assert.ok(installed.length > 0, name)
    for (const location of installed) {
      const { version } = JSON.parse(readFileSync(join(location, 'package.json'), 'utf8'))
      assert.ok(atLeast(version, floor), `${relative(root, location)} is ${name} ${version}; ${advisory}`)
    }
  }
})

// @vercel/nft traces Nitro's server files with glob; glob 14 keeps the promise API it calls.
test('@vercel/nft globs through glob 14', async () => {
  const { glob } = createRequire(require.resolve('@vercel/nft/package.json'))('glob')
  const matches = await glob('*dependenc*.{mjs,json}', { cwd: dirname(fileURLToPath(import.meta.url)), ignore: ['test-*'] })
  assert.deepEqual(matches.sort(), ['audit-dependencies.mjs', 'dependency-patches.json', 'vendored-dependencies.json'])
})

test('audit exceptions apply only to the patched versions and exact advisories', () => {
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

test('vendored-copy exceptions apply only to the guarded advisory on exactly the vendored versions', () => {
  const versions = Object.values(vendored.picomatch.copies).map(copy => copy.version)
  const children = { URL: vendored.picomatch.advisory, 'Tree Versions': versions }
  assert.equal(isVendoredAdvisory({ value: 'picomatch', source: 'vendored-version', children }), true)
  assert.equal(isVendoredAdvisory({ value: 'picomatch', source: 'vendored-version', children: { ...children, 'Tree Versions': [...versions].reverse() } }), true)
  assert.equal(isVendoredAdvisory({ value: 'picomatch', source: 'patched-version', children }), false)
  assert.equal(isVendoredAdvisory({ value: 'picomatch', source: 'registry-locator', children }), false)
  assert.equal(isVendoredAdvisory({ value: 'picomatch', children }), false)
  assert.equal(isVendoredAdvisory({ value: 'picomatch', source: 'vendored-version', children: { ...children, URL: 'https://example.com/new-advisory' } }), false)
  assert.equal(isVendoredAdvisory({ value: 'picomatch', source: 'vendored-version', children: { ...children, 'Tree Versions': versions.slice(1) } }), false)
  assert.equal(isVendoredAdvisory({ value: 'picomatch', source: 'vendored-version', children: { ...children, 'Tree Versions': [...versions, '4.0.5'] } }), false)
  assert.equal(isVendoredAdvisory({ value: 'braces', source: 'vendored-version', children: { URL: manifest.braces.advisory, 'Tree Versions': [manifest.braces.version] } }), false)
  assert.equal(isBackportedAdvisory({ value: 'picomatch', source: 'patched-version', children }), false)
})

test('the vendored-copy exception needs the reviewed guard in place', () => {
  const read = path => readFileSync(join(root, path))
  assert.doesNotThrow(() => verifyVendoredGuards(read))
  for (const directory of Object.keys(vendored.picomatch.copies)) {
    const edited = path => (path === `${directory}/lib/parse.js` ? Buffer.from(withoutGuard(read(path).toString())) : read(path))
    assert.throws(() => verifyVendoredGuards(edited), /Guarded file changed without review/)
    const renumbered = path => (path === `${directory}/package.json` ? Buffer.from(JSON.stringify({ name: 'picomatch', version: '9.9.9' })) : read(path))
    assert.throws(() => verifyVendoredGuards(renumbered), /is not picomatch@/)
  }
})

const reviewedLocators = Object.entries(manifest).map(([name, patch]) => ({
  value: `${name}@patch:${name}@npm%3A${patch.version}#~/${patch.patch}::version=${patch.version}&hash=fixture`,
  children: { Version: patch.version },
}))
const vendoredLocators = Object.entries(vendored).flatMap(([name, { copies }]) => Object.entries(copies).map(([directory, copy]) => ({
  value: `${name}@file:./${directory}#./${directory}::hash=fixture&locator=nuxt-app%40workspace%3A.`,
  children: { Version: copy.version },
})))
const compatibilityLocator = (name, version, virtual = false) => ({
  value: `${name}@${virtual ? 'virtual:fixture#' : ''}patch:${encodeURIComponent(`${name}@npm:${version}`)}#optional!builtin<compat/${name}>::version=${version}`,
  children: { Version: version },
})
const patchInfo = [
  ...reviewedLocators,
  ...vendoredLocators,
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
    const bulk = Object.fromEntries([
      ...Object.entries(manifest).map(([name, patch]) => [name, [advisory(patch.advisory)]]),
      ...Object.entries(vendored).map(([name, { advisory: url }]) => [name, [advisory(url)]]),
    ])
    const fixture = auditFixture({
      info: [...patchInfo, ...reviewedLocators, compatibilityLocator('@example/tool', '1.2.3', true), compatibilityLocator('@example/tool', '2.0.0')], bulk,
    })
    assert.equal(await auditDependencies(production, fixture.dependencies), 0)
    assert.deepEqual(fixture.payloads, [{
      braces: ['3.0.3'], picomatch: ['2.3.2', '4.0.7'], fsevents: ['2.3.3'], resolve: ['1.22.13'], typescript: ['5.9.3'],
      '@example/tool': ['1.2.3', '2.0.0'],
    }])
    assert.deepEqual(fixture.calls[1], ['info', '--all', '--recursive', '--json'])
    assert.equal(fixture.calls[0].includes('production'), production)
  })

  test(`${scope} audit fails on future advisories in every patched dependency`, async () => {
    for (const name of ['braces', 'picomatch', 'fsevents', 'resolve', 'typescript']) {
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

  test(`${scope} audit never exempts registry or unguarded findings for vendored packages`, async () => {
    for (const [name, { advisory: url, copies }] of Object.entries(vendored)) {
      const versions = Object.values(copies).map(copy => copy.version)
      const fixture = auditFixture({ yarn: [{
        value: name, source: 'vendored-version', children: { URL: url, 'Tree Versions': versions },
      }] })
      assert.equal(await auditDependencies(production, fixture.dependencies), 1)
    }
  })

  test(`${scope} audit fails closed when a vendored copy is missing, moved, renumbered, also patched or unguarded`, async () => {
    for (const missing of vendoredLocators) {
      const fixture = auditFixture({ info: patchInfo.filter(row => row !== missing) })
      await assert.rejects(auditDependencies(production, fixture.dependencies), /Missing reviewed vendored copy/)
      assert.deepEqual(fixture.payloads, [])
    }
    const [first] = vendoredLocators
    for (const replaced of [
      { ...first, value: first.value.replaceAll('vendor/picomatch-2', 'vendor/other') },
      { ...first, children: { Version: '2.3.1' } },
    ]) {
      const fixture = auditFixture({ info: [...patchInfo, replaced] })
      await assert.rejects(auditDependencies(production, fixture.dependencies), /Unreviewed local copy/)
    }
    const patched = auditFixture({ info: [...patchInfo, compatibilityLocator('picomatch', '4.0.7')] })
    await assert.rejects(auditDependencies(production, patched.dependencies), /also patched/)
    const unguarded = auditFixture({ bulk: { picomatch: [advisory(vendored.picomatch.advisory)] } })
    unguarded.dependencies.verifyVendoredGuards = () => { throw new Error('Guarded file changed without review: fixture') }
    await assert.rejects(auditDependencies(production, unguarded.dependencies), /Guarded file changed without review/)
    assert.deepEqual(unguarded.payloads, [])
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
