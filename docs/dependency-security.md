# Dependency security contract

The website keeps Nuxt 3 and Nuxt Content 2 for the current release while using
reviewed compatible updates and scoped Yarn resolutions for patched transitive
versions. The resolutions in `package.json` are release controls: do not remove,
broaden, or downgrade them unless both dependency audits remain clean and the
typecheck plus production build pass.

Required verification:

```sh
yarn install --immutable
yarn audit:dependencies
yarn audit:dependencies:production
yarn typecheck
yarn build
```

The 2026-07-10 baseline remediates the active advisories affecting the previous
Nuxt dependency graph, including the markdown renderer, HTTP runtime, bundler,
WebSocket, archive, glob, and schema-head packages. Major-version resolutions
are limited to the legacy `@vueuse/head` dependency that Nuxt Content 2 retains;
the application uses Nuxt's current Unhead integration, and the compatibility
override is covered by type generation and a complete SSR production build.

When migrating to Nuxt Content 3, remove the legacy `@vueuse/head` override only
after the same verification matrix passes with a clean immutable lockfile.
