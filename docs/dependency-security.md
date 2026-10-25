# Dependency security checks

The website runs Nuxt 4.6.2 or newer with patched Vue, MDC, image processing,
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

Two advisories have no fixed npm release as of 2026-10-23. Checked-in Yarn
patches fix the affected code without changing the upstream version number:

- `braces@3.0.3`, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): bound parser and AST traversal depth and reject cycles before recursive traversal. Backport only the security guards from [upstream PR 88](https://github.com/micromatch/braces/pull/88/commits/a795ee83ecd011131b2d618fe754ac5a8e124dae), preserving the released parser's other behavior.
- `node-forge@1.4.0`, [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv): reject extra nested DigestAlgorithm elements during RSA PKCS#1 v1.5 verification, from [upstream PR 1152](https://github.com/digitalbazaar/forge/pull/1152/commits/ceba34402e329f0365134f23fe19898756527d65).

Both audits first run regression tests against the installed packages and check
the reviewed installed-file and patch hashes in `scripts/dependency-patches.json`.
Tests cover hostile nested/cyclic brace inputs, valid ordinary glob behavior,
malformed RSA DigestInfo rejection, and valid signatures.

Yarn's registry audit can omit `patch:` locators, including its built-in
compatibility patches, or report their base versions (Yarn 4.17). The audit wrapper additionally queries npm for every
patched package's original registry version. Only the two exact advisories on
the two tested backport versions are exempted from that additional query.
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
