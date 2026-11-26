export const siteUrl = 'https://fearlesswallet.io'

export const organizationId = `${siteUrl}/#organization`
export const websiteId = `${siteUrl}/#website`

export const siteIdentity = {
  name: 'Fearless Wallet',
  email: 'fearless@soramitsu.co.jp',
  sameAs: [
    'https://x.com/FearlessWallet',
    'https://t.me/fearlesswallet',
    'https://www.youtube.com/c/FearlessWallet',
    'https://github.com/soramitsu',
  ],
}

// A page's one address, as the sitemap lists it. The router also answers
// "/Support" and "/download/", so the canonical link, og:url and the
// structured data all come from here: lowercase, without a query or hash, and
// without a trailing slash except on the home page.
export function pageUrl(path: string) {
  const clean = (path.split(/[?#]/)[0] || '/').toLowerCase().replace(/\/+$/, '')
  return clean ? `${siteUrl}${clean}` : `${siteUrl}/`
}
