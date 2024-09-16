import { serverQueryContent } from '#content/server'

export default defineEventHandler(async (event) => {
  const blogArticles = await serverQueryContent(event, '/blog').find()

  return [...blogArticles.map((el) => el._path), '/release-notes/ios', '/release-notes/android']
})
