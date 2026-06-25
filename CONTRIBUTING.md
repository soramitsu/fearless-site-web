# Contributing to Fearless Site

## Git Flow

All normal work starts from `develop` and is submitted back to `develop`.
Use short-lived branches named `feature/<ticket>-<slug>`, `fix/<ticket>-<slug>`,
`chore/<slug>`, or `refactor/<slug>`.

`master` is the releasable branch. Do not target `master` except for release
pull requests from `develop`, `release/*` stabilization branches, or urgent
`hotfix/*` branches. Every commit on `master` must be safe to deploy, and
release tags must point at commits already merged to `master`.

Feature PRs are squash-merged after review and green CI. Release PRs to
`master` use merge commits so the release boundary remains visible.

## Local Checks

Run these before submitting a PR:

```sh
yarn install --immutable
yarn build
```

Use `yarn dev` for local development.

## Pull Requests

- Target `develop` for normal work.
- Target `master` only for release or hotfix PRs.
- Include the issue or task link.
- Include screenshots for visible UI/content changes.
- Document any deployment, environment, or rollback considerations.
- Do not commit secrets, local environment files, or generated build output.
