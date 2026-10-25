# Deployment Policy

Fearless Site is a public Nuxt website. Production deployment must be sourced
only from the protected `master` branch of `soramitsu/fearless-site-web`, with
the repository root as the hosting project root. Keep the existing hosting
project and domain; the four-repository consolidation does not reconnect it to
the browser repository.

## Branch Contract

- `develop` is the integration branch for normal content, feature, fix, chore,
  and refactor work.
- `master` is the releasable production branch.
- Production hosting providers must deploy only commits on `master` or tags that
  point to commits already on `master`.
- Preview deployments may run from pull requests or `develop`, but they must not
  update the production domain.

## Current Repository State

This repository does not contain a production deploy workflow. Hosted CI is not
available for this release; local verification is the release prerequisite.
Existing GitHub Actions workflows do not replace or block the local checks below.
`vercel.json` pins the Vercel framework preset to Nuxt and uses Yarn 4.17.0 via
`@yarnpkg/cli-dist` so Vercel does not fall back to the runner's global Yarn 1
binary. Production deployment is expected to be controlled by the external
hosting provider. During release setup, verify that provider-side branch filters
deploy production from `master` only.

## Release Verification

Before promoting a release to `master`:

1. Confirm the hosting provider production branch is `master`.
2. Confirm no deploy credential or provider token is committed to this repo.
3. Run the pinned Yarn toolchain's immutable install, `yarn typecheck`,
   `yarn verify:release-content`, `yarn verify:app-associations`,
   `yarn verify:networks`, `yarn build`, and `yarn test:production` locally.
   Retain their results with the exact source commit. A successful bundle alone
   is insufficient: `test:production` checks the rendered pages and server routes.
4. Review only the intended release diff and promote the locally verified
   source. Do not wait for hosted CI or record an unrun workflow as passing.
5. After promotion, verify the production deployment reports the `master`
   commit or a tag that points to it.

## Browser extension privacy rollout

Deploy the browser extension supplement at `https://fearlesswallet.io/privacy/`
before submitting extension 4.2.0 to the Chrome Web Store. Confirm the public
page shows the supplement effective 25 October 2026, including local wallet
data, network services, website permissions and optional Google Drive backups.
The existing policy and controller details remain in place. Update the Store
privacy declarations to match the extension disclosure; publishing the website
does not change the Store's saved declarations.

## Support page rollout

Deploy `/support/` before releasing app builds that replace their email row with
Help & Support. Android, iOS, and the browser extension link to
`https://fearlesswallet.io/support/`. Verify that this URL returns the support
page in production and that its email, Telegram, FAQ, and wiki links work.
Keep the support inbox monitored and retain the required contact email in
store listings and publisher accounts. The app UI change does not update store
metadata or remove privacy/security contacts.
