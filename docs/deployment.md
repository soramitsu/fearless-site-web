# Deployment Policy

Fearless Site is a public Nuxt website. Production deployment must be sourced
only from the protected `master` branch.

## Branch Contract

- `develop` is the integration branch for normal content, feature, fix, chore,
  and refactor work.
- `master` is the releasable production branch.
- Production hosting providers must deploy only commits on `master` or tags that
  point to commits already on `master`.
- Preview deployments may run from pull requests or `develop`, but they must not
  update the production domain.

## Current Repository State

This repository does not contain a production deploy workflow. GitHub Actions
builds the site for pull requests and pushes to `develop` and `master` only.
`vercel.json` pins the Vercel framework preset to Nuxt and uses Yarn 4.9.1 via
`@yarnpkg/cli-dist` so Vercel does not fall back to the runner's global Yarn 1
binary. Production deployment is expected to be controlled by the external
hosting provider. During release setup, verify that provider-side branch filters
deploy production from `master` only.

## Release Verification

Before merging a release PR to `master`:

1. Confirm the hosting provider production branch is `master`.
2. Confirm no deploy credential or provider token is committed to this repo.
3. Confirm CI is green for the release PR.
4. After merge, verify the production deployment reports the `master` merge
   commit or a tag that points to it.
