import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const backports = JSON.parse(readFileSync(new URL('./dependency-patches.json', import.meta.url)))
const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value)
const nonemptyString = value => typeof value === 'string' && value.length > 0
const isVersion = value => typeof value === 'string'
  && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(value)

// Only findings proven to refer to reviewed patches may be exempted.
export function isBackportedAdvisory(entry) {
  if (entry.source !== 'patched-version' || !Object.hasOwn(backports, entry.value)) return false
  const expected = backports[entry.value]
  return entry.children?.URL === expected.advisory
    && Array.isArray(entry.children['Tree Versions'])
    && entry.children['Tree Versions'].length === 1
    && entry.children['Tree Versions'][0] === expected.version
}

function runYarn(args) {
  if (!process.env.npm_execpath) throw new Error('Run this audit through Yarn.')
  return spawnSync(process.env.npm_execpath, args, { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 })
}

function commandLines(result, label) {
  if (result.error) throw result.error
  if (result.stderr) process.stderr.write(result.stderr)
  if (typeof result.stdout !== 'string') throw new Error(`Unexpected ${label} output.`)
  return result.stdout.trim().split('\n').filter(Boolean).map(line => JSON.parse(line))
}

function patchedVersions(result) {
  const rows = commandLines(result, 'Yarn info')
  if (result.status !== 0 || rows.length === 0) throw new Error('Could not enumerate installed patch locators.')
  const versions = new Map()
  const reviewedLocators = new Set()
  for (const row of rows) {
    if (!isRecord(row) || !nonemptyString(row.value) || !isRecord(row.children)
      || !(row.children.Version === null || typeof row.children.Version === 'string')) {
      throw new Error('Unexpected Yarn info response.')
    }
    const locator = row.value.match(/^((?:@[^/]+\/)?[^@]+)@(.+)$/)
    if (!locator) throw new Error('Unexpected Yarn package locator.')
    let reference = locator[2]
    if (reference.startsWith('virtual:')) {
      const separator = reference.indexOf('#')
      if (separator === -1) throw new Error('Unexpected virtual package locator.')
      reference = reference.slice(separator + 1)
    }
    if (!reference.startsWith('patch:')) continue
    const separator = reference.indexOf('#')
    if (separator === -1) throw new Error('Unexpected patch locator.')
    const source = decodeURIComponent(reference.slice('patch:'.length, separator))
    const original = source.match(/^((?:@[^/]+\/)?[^@]+)@npm:([^:]+)(?:::.*)?$/)
    if (!original || original[1] !== locator[1] || !isVersion(row.children.Version)
      || original[2] !== row.children.Version) {
      throw new Error(`Patch has no matching registry version: ${row.value}`)
    }
    const name = original[1]
    const version = row.children.Version
    if (Object.hasOwn(backports, name) && version === backports[name].version) {
      // Every locator eligible for an exception must use the file whose hash
      // and installed source are checked by test:dependency-patches.
      const patchPath = reference.slice(separator + 1).split('::', 1)[0]
      if (patchPath !== `~/${backports[name].patch}`) {
        throw new Error(`Unreviewed patch for an exempted package: ${row.value}`)
      }
      reviewedLocators.add(row.value)
    }
    if (!versions.has(name)) versions.set(name, new Set())
    versions.get(name).add(version)
  }
  for (const [name, patch] of Object.entries(backports)) {
    if (!versions.get(name)?.has(patch.version)) throw new Error(`Missing reviewed patch locator: ${name}@${patch.version}`)
  }
  // Yarn 4.17 can report the base version of a patched dependency. Prove that
  // every dependency edge uses the reviewed patch before classifying such a
  // finding. Merely having a patch locator alongside an unpatched one is not
  // enough; base locators retained only as patch inputs have no incoming edge.
  const edges = new Map()
  for (const row of rows) {
    if (row.children.Dependencies === undefined) continue
    if (!Array.isArray(row.children.Dependencies)) throw new Error('Unexpected Yarn dependencies.')
    for (const dependency of row.children.Dependencies) {
      if (!isRecord(dependency) || !nonemptyString(dependency.locator)) throw new Error('Unexpected Yarn dependency locator.')
      const name = dependency.locator.match(/^((?:@[^/]+\/)?[^@]+)@/)?.[1]
      if (!name) throw new Error('Unexpected Yarn dependency locator.')
      if (!edges.has(name)) edges.set(name, [])
      edges.get(name).push({ parent: row.value, locator: dependency.locator })
    }
  }
  return {
    requested: Object.fromEntries([...versions].map(([name, entries]) => [name, [...entries].sort()])),
    isReviewedFinding(entry) {
      const references = edges.get(entry.value) ?? []
      const dependents = entry.children.Dependents
      return references.length > 0 && references.every(edge => reviewedLocators.has(edge.locator))
        && Array.isArray(dependents) && dependents.length > 0
        && dependents.every(parent => references.some(edge => edge.parent === parent))
    },
  }
}

function bulkFindings(response, requested) {
  if (!isRecord(response)) throw new Error('Unexpected patch registry audit response.')
  const findings = []
  for (const [name, advisories] of Object.entries(response)) {
    if (!Object.hasOwn(requested, name) || !Array.isArray(advisories)) {
      throw new Error('Unexpected patch registry audit response.')
    }
    for (const advisory of advisories) {
      if (!isRecord(advisory) || !nonemptyString(advisory.url) || !nonemptyString(advisory.title)
        || !nonemptyString(advisory.vulnerable_versions)
        || !['info', 'low', 'moderate', 'high', 'critical'].includes(advisory.severity)
        || !(nonemptyString(advisory.id) || (Number.isSafeInteger(advisory.id) && advisory.id > 0))) {
        throw new Error('Unexpected patch registry advisory.')
      }
      findings.push({ value: name, source: 'patched-version', children: {
        URL: advisory.url,
        Issue: advisory.title,
        Severity: advisory.severity,
        // Conservatively retain all queried versions: an exception cannot
        // cover a second installed version that has not been reviewed.
        'Tree Versions': requested[name],
      } })
    }
  }
  return findings
}

export async function auditDependencies(production = false, dependencies = {}) {
  const execute = dependencies.runYarn ?? runYarn
  const fetchRegistry = dependencies.fetchRegistry ?? fetch
  const result = execute(['npm', 'audit',
    '--all', '--recursive', '--severity', 'low', '--no-deprecations', '--json',
    ...(production ? ['--environment', 'production'] : []),
  ])
  const findings = commandLines(result, 'Yarn audit').map(entry => {
    if (!isRecord(entry) || !nonemptyString(entry.value) || !nonemptyString(entry.children?.URL)
      || !Array.isArray(entry.children?.['Tree Versions']) || !entry.children['Tree Versions'].every(isVersion)) {
      throw new Error('Unexpected Yarn audit response.')
    }
    return { ...entry, source: 'registry-locator' }
  })
  if (result.status !== 0 && (result.status !== 1 || findings.length === 0)) {
    throw new Error(`Dependency audit failed (exit ${result.status}).`)
  }
  // Yarn omits every patch: locator, including its built-in compatibility
  // patches. Query every installed patch origin, not just our two backports.
  // This intentionally includes development patch origins in production mode.
  // The package scripts run provenance and behavior tests before this audit.
  const { requested, isReviewedFinding } = patchedVersions(execute(['info', '--all', '--recursive', '--json']))
  for (const finding of findings) {
    if (isReviewedFinding(finding)) finding.source = 'patched-version'
  }
  const response = await fetchRegistry('https://registry.npmjs.org/-/npm/v1/security/advisories/bulk', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(requested),
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok) throw new Error(`Patch registry audit failed: HTTP ${response.status}`)
  findings.push(...bulkFindings(await response.json(), requested))
  let failures = 0
  for (const finding of findings) {
    if (isBackportedAdvisory(finding)) {
      console.log(`Verified backport: ${finding.value} ${finding.children.URL}`)
    } else {
      failures++
      console.error(JSON.stringify(finding))
    }
  }
  console.log(`${production ? 'Production' : 'Full'} dependency audit: ${failures} unpatched findings; ${findings.length - failures} verified backports.`)
  return failures ? 1 : 0
}

if (process.argv[1] && import.meta.url === new URL(process.argv[1], 'file:').href) {
  process.exitCode = await auditDependencies(process.argv.includes('--production'))
}
