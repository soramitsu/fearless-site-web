// Structured data (schema.org JSON-LD) for every page.
//
// The site used nuxt-schema-org 5, whose Unhead 2 plugin does not run under
// Nuxt 4.6's Unhead 3: every page shipped an empty JSON-LD script. This
// writes the graph itself: the organization and the website on every page,
// plus whatever nodes the page passes in.

import { siteIdentity, siteUrl } from '~/lib/siteIdentity'

type SchemaNode = Record<string, unknown>

const organizationId = `${siteUrl}/#organization`
const websiteId = `${siteUrl}/#website`

const organization: SchemaNode = {
  '@type': 'Organization',
  '@id': organizationId,
  name: siteIdentity.name,
  url: siteUrl,
  logo: {
    '@type': 'ImageObject',
    url: `${siteUrl}/icon-512.png`,
    width: 512,
    height: 512,
  },
  email: siteIdentity.email,
  sameAs: siteIdentity.sameAs,
}

const website: SchemaNode = {
  '@type': 'WebSite',
  '@id': websiteId,
  name: siteIdentity.name,
  url: siteUrl,
  inLanguage: 'en-US',
  publisher: { '@id': organizationId },
}

const pageTypes = new Set(['WebPage', 'FAQPage', 'CollectionPage', 'AboutPage', 'ContactPage'])

function pageUrl(path: string) {
  const clean = path.split(/[?#]/)[0] || '/'
  return clean === '/' ? `${siteUrl}/` : `${siteUrl}${clean}`
}

// The page's own node gets its address and links back to the site; an
// article gets its page and publisher. Values the page sets win.
function complete(node: SchemaNode, url: string): SchemaNode {
  const type = node['@type']
  if (typeof type === 'string' && pageTypes.has(type)) {
    return { '@id': `${url}#webpage`, url, isPartOf: { '@id': websiteId }, ...node }
  }
  if (type === 'Article') {
    return {
      '@id': `${url}#article`,
      mainEntityOfPage: url,
      publisher: { '@id': organizationId },
      ...node,
    }
  }
  return node
}

export function schemaOrgGraph(nodes: SchemaNode[], path: string) {
  const url = pageUrl(path)
  return {
    '@context': 'https://schema.org',
    '@graph': [organization, website, ...nodes.map((node) => complete(node, url))],
  }
}

// `<` is escaped so text in the graph can never close the script element.
export function serializeSchemaOrg(graph: unknown) {
  return JSON.stringify(graph).replace(/</g, '\\u003c')
}

export function useSchemaOrg(nodes: SchemaNode[] = []) {
  const route = useRoute()
  useHead({
    script: [
      {
        key: 'schema-org-graph',
        type: 'application/ld+json',
        innerHTML: serializeSchemaOrg(schemaOrgGraph(nodes, route.path)),
      },
    ],
  })
}
