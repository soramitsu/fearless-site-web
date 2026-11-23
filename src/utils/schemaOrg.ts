// Small builders for the nodes pages pass to useSchemaOrg.

type SchemaNode = Record<string, unknown>

export const defineWebPage = (node: SchemaNode = {}): SchemaNode => ({ '@type': 'WebPage', ...node })

export const defineArticle = (node: SchemaNode = {}): SchemaNode => ({ '@type': 'Article', ...node })
