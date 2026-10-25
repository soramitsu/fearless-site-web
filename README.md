# Fearless wallet website

The canonical website source is `soramitsu/fearless-site-web`, one of the four
Fearless repositories alongside the iOS, Android, and browser applications.

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Use the Node version in `.nvmrc` and the Yarn version in `package.json`:

```bash
corepack enable
yarn install --immutable
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

Production deployment for Fearless Site must source only from the protected
`master` branch. See [docs/deployment.md](./docs/deployment.md) for the release
branch contract and provider-side checks.

## Release notes

To fetch new release notes from GitHub run the following script

```bash
yarn notes
```

and then commit the changes to the repo

```bash
git add .
git commit -m 'feat: upgrade release-notes'
```

source code of the fetching script can be found [here](./fetchReleaseNotes.js)

## Owned network data

The website builds without a shared-config checkout or network fetch. Its
reviewed network names, enabled flags, and local icon paths live in
`data/networks.json`; logos are tracked under `src/public/networks/`. Update that
data and run `yarn parseNetworks` when supported networks change. CI runs
`yarn verify:networks` to check the generated module and every icon. Featured
network descriptions remain in `src/lib/networks.ts`.

The initial snapshot comes from the browser repository's production v13 chain
configuration at `6932d6fa69c402ac729bdcf4aba5ca7b31d6842b`; only the fields used
by the website are imported. Platform RPC and wallet configuration stays in
its owning application repository.
