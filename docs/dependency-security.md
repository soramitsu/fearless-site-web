# Dependency security checks

The website runs Nuxt 4.6.4 or newer with patched Vue, MDC, image processing,
HTTP and build dependencies. Nuxt 3 no longer receives the security fixes
needed by this dependency graph; see the [Nuxt advisory](https://github.com/nuxt/nuxt/security/advisories/GHSA-xfq5-w38q-pc2x).

Nuxt Content 2 remains in use to preserve the existing content API. Its MDC
renderer is pinned to the patched 0.23.2 release. The legacy `@vueuse/head`
dependency uses a scoped Unhead 2 resolution, while Nuxt uses its own Unhead
integration. Keep the explicit public, content, server and build directories:
Content 2's filesystem cache driver ignores paths inside `node_modules`, where
Nuxt 4 otherwise relocates an existing build directory. A build that succeeds
without those settings can still serve empty content pages.

Run the complete verification matrix on the Node version in `.nvmrc`:

```sh
yarn install --immutable
yarn audit:dependencies
yarn audit:dependencies:production
yarn verify:release-content
yarn typecheck
yarn build
yarn test:production
```

The production checks start the built server on loopback and verify rendered
blog, FAQ, release notes and legal content; page metadata; static and processed
images; invalid route responses; sitemaps; and mobile app association files.
They do not deploy the website.

## Temporary dependency backports

One advisory had no fixed npm release as of 2026-10-23. A checked-in Yarn patch
fixes the affected code without changing the upstream version number:

- `braces@3.0.3`, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): bound parser and AST traversal depth and reject cycles before recursive traversal. Backport only the security guards from [upstream PR 88](https://github.com/micromatch/braces/pull/88/commits/a795ee83ecd011131b2d618fe754ac5a8e124dae), preserving the released parser's other behavior.

`node-forge` carried a second backport, for
[GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv), until
2026-11-18. Upstream fixed it in 1.4.1, and 1.4.3 also closes the 20 other
advisories that npm now reports for 1.4.0 (TLS, X.509, ASN.1, PKCS#12, PEM and
`forge.http` issues), so the site uses the unpatched 1.4.3. Only `listhen`
depends on it, to create local development certificates.

Both audits first run regression tests against the installed packages and check
the reviewed installed-file and patch hashes in `scripts/dependency-patches.json`.
Tests cover hostile nested/cyclic brace inputs, valid ordinary glob behavior,
and, against the upstream fix, malformed RSA DigestInfo rejection and valid
signatures.

Yarn's registry audit can omit `patch:` locators, including its built-in
compatibility patches, or report their base versions (Yarn 4.17). The audit wrapper additionally queries npm for every
patched package's original registry version. Only the exact advisory on the
tested backport version is exempted from that additional query.
For a Yarn-reported base version, the wrapper requires every dependency edge
and every reported dependent to resolve to the reviewed patch before applying
the same exact-advisory exception. A patch existing beside an unpatched
dependency is insufficient. Every advisory for an unpatched registry locator fails the gate,
as do new advisories, changed versions, invalid audit responses and network
errors. Both full and production audits check all patch origins, including
build tooling, so the latter deliberately retains this broader coverage.

TODO: Replace each backport with an official fixed release when available,
remove its exact exception and provenance entry, and rerun the full matrix.
Third-party licenses and copyright notices continue to apply to the patched
packages; the website's Apache 2.0 grant covers first-party source only.

## Consolidation dependency update

The 2026-10-25 consolidation imports the browser website's reviewed dependency
version pins, removes the unused direct Zod dependency, and selects
serialize-javascript 7.1.3. It retains this repository's installed-source hash
checks, cyclic AST regression coverage, and audit of every patched registry
origin. No audit exception is added by this update.

## Nuxt 4.6.4 update

Nuxt 4.6.4 (2026-11-18 update from 4.6.2) closes the ten advisories that the
audits reported for `nuxt`, `@nuxt/nitro-server`, `@nuxt/schema`,
`@nuxt/vite-builder` and `@nuxt/vite-server` 4.6.2, among them route-rule and
`server/middleware` bypasses through dot segments, a leading `//` or an encoded
slash in the request path.

It also brings Nitro 2.13.6, whose archiver 8 is an ES module with a new glob
reader (`readdir-glob` 3). That reader imports `Minimatch` by name and asks for
`minimatch` `^10.2.2`. The `readdir-glob/minimatch` resolution used to select
5.1.9, the patched release of the 5.x line that `readdir-glob` 1 asked for.
minimatch 5 is CommonJS without that named export, so `nuxt prepare` stopped
with "does not provide an export named 'Minimatch'" and every install failed in
its `postinstall` step. The resolution now selects 11.0.3:
[GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249) covers
every 10.x release, and the reader only constructs `Minimatch` and calls
`match`, which 11 keeps. minimatch 11 needs `brace-expansion` 5, so the
`brace-expansion` pin is now per range: 2.1.7 for minimatch 9 and 5.0.12 for
minimatch 11.

`yarn test:dependency-patches` loads archiver the way Nitro does and matches
files through the reader, so a resolution that breaks this chain fails the
dependency audits instead of the next install.

## Advisories closed by upstream releases (2026-11-18)

- `fast-xml-parser` 5.12.1 (was 5.10.1):
  [GHSA-474x-hrwr-fgx4](https://github.com/advisories/GHSA-474x-hrwr-fgx4)
  covers 5.11.2 and earlier. `@nuxtjs/sitemap` uses it in the built server.
- `glob` 14.0.6 (was 10.5.0) with `minimatch` 11.0.8 (was 9.0.9):
  [GHSA-3g3m-2fjr-6pw4](https://github.com/advisories/GHSA-3g3m-2fjr-6pw4)
  covers glob 9.0.0 to 14.0.1, and
  [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249)
  covers minimatch 7.0.0 to 11.0.0. The `glob` resolution already overrode
  `@vercel/nft`'s `^13` and `cacache`'s `^10.2.2`; glob 14 keeps the promise
  API both call and needs minimatch 11, so `glob/minimatch` follows and the
  `brace-expansion` 2 pin that only minimatch 9 used goes. `@vercel/nft` traces
  the built server's files with it; `cacache` is reached only through
  `node-gyp`, which this install never runs. readdir-glob's `^10.2.2` stays on
  11.0.3: the newest 10.x, 10.2.6, is also covered by GHSA-g3hv-75wg-m249.

`yarn test:dependency-patches` checks that every installed copy stays at or
above the first release outside its advisory.

## picomatch repeated-extglob guard

[GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)
(CVE-2026-112366, high), which npm began reporting on 2026-11-17, covers every
picomatch release up to the latest, 4.0.7, and has no fix. A `+(...)` or
`*(...)` extglob whose body can match the same text in more than one way, such
as `+(*a)`, `+(a+)`, `+({a,aa})` or `+(@(a|aa))`, compiles to nested
quantifiers that backtrack exponentially on a short string that does not match.

Every picomatch package now resolves to `vendor/picomatch-2` or
`vendor/picomatch-4`: upstream 2.3.2 and 4.0.7, byte-identical except for two
marked blocks in `lib/parse.js`. When a repeated extglob closes, the guard reads
the regular expression picomatch has emitted for its body and keeps it only if
it is a plain sequence of literal characters and single-character classes;
anything else (an alternation, wildcard, quantifier, brace, group or nested
extglob) is emitted as a literal string, the fallback upstream already uses for
its own risky forms. Tools that used 4.0.5 now get 4.0.7. The cost is that a
repeated extglob with an alternation or a wildcard, such as `+(a|b)` or
`*.+(js|ts)`, matches only its own text; 306 of upstream's assertions at each
tag change, all of that kind. The site's configuration uses no extglob, and
picomatch is build tooling that does not appear in the built server or the
generated pages. The README in each copy records the upstream commit, digests,
the exact change and the changed assertions.

Three packages bundle their own picomatch inside their files, where no
resolution reaches: rollup 4.62.2 (`dist/shared/*.js`,
`dist/es/shared/{node-entry,watch}.js`), rollup-plugin-visualizer 7.1.3 (the
report templates in `dist/lib/*.js`) and tsx 4.19.4 (`dist/cli.cjs`,
`dist/cli.mjs`). They run only at build or development time, on this
repository's own patterns.

These copies are `file:` packages, which Yarn's registry audit skips. The audit
wrapper therefore asks npm about their upstream versions too, as it does for
patch origins, and accepts only this advisory on exactly 2.3.2 and 4.0.7, and
only while each copy's guarded `lib/parse.js` matches the digest reviewed with
it (`scripts/vendored-dependencies.json`); a missing, moved, renumbered or
edited copy, or a picomatch that is also patched, fails closed.
`yarn test:dependency-patches` checks the copies against upstream's digests,
that every installed picomatch package is one of them, ordinary and
literal-only matches, and runs `scripts/picomatch-extglob-sweep.cjs`: 35 named
ReDoS shapes must be literal, and every repeated extglob built from one or two
of 28 atoms must compile and answer crafted strings within a CPU budget. Remove
the copies and their resolutions when upstream publishes a fixed release.
