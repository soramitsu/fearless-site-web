<script setup lang="ts">
import { organizationId } from '~/lib/siteIdentity'

const route = useRoute()

const { data, error } = await useAsyncData(`/blog/${route.params.slug}`, () => queryContent(`/blog/${route.params.slug}`).findOne())

// The content service answers 404 for a post that does not exist. Any other
// failure (the service down for a moment) keeps its own status, so a working
// post is never published as missing.
if (error.value && error.value.statusCode !== 404) {
  throw createError({
    statusCode: error.value.statusCode || 500,
    statusMessage: 'Could not load this post',
    fatal: true
  })
}

if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Page Not Found',
    fatal: true
  })
}

const title = data.value.title
const ogImage = data.value.og
const description = data.value.description
const keywords = data.value.keywords
const date = data.value.date
const updated = data.value.updated
// A post's own share image is described by its front matter; without one the
// site's card and its description from nuxt.config apply.
const ogImageAlt = data.value.ogAlt || title

const { baseUrl } = useRuntimeConfig().public
// Share cards need an absolute address; a cover may already be one.
const absolute = (path: string) => (/^https?:\/\//.test(path) ? path : `${baseUrl}${path}`)
const ogImageUrl = ogImage ? absolute(ogImage) : undefined

const meta = {
  ogType: 'article' as const,
  ...(title ? {
    title: title,
    ogTitle: title,
    twitterTitle: title,
  } : {}),
  ...(ogImage ? {
    ogImage: ogImageUrl,
    ogImageSecureUrl: ogImageUrl,
    ogImageAlt,
    twitterImage: ogImageUrl,
    twitterImageAlt: ogImageAlt,
    // The site's default card is 1200×630; a post's own image may differ.
    ...(data.value.ogWidth && data.value.ogHeight ? {
      ogImageWidth: data.value.ogWidth,
      ogImageHeight: data.value.ogHeight,
    } : {}),
  } : {}),
  ...(description ? {
    description: description,
    ogDescription: description,
    twitterDescription: description
  } : {})
}

const schema = [
  defineArticle({
    inLanguage: "en-US",
    ...(title ? { headline: title } : {}),
    ...(ogImage ? {
      image: ogImageUrl,
    } : {}),
    ...(date ? { datePublished: date } : {}),
    ...(updated ? { dateModified: updated } : {}),
    ...(description ? { description: description } : {}),
    ...(keywords ? { keywords: keywords } : {}),
    // The posts are written by the team, so the author is the organization.
    author: { '@id': organizationId }
  })
]

useSeoMeta(meta)
useHead({
  meta: keywords ? [{ name: 'keywords', content: keywords }] : []
})
useSchemaOrg(schema)
</script>

<template>
  <ContentRenderer v-if="data" :value="data">
    <article class="w py-3xl mx-auto">
      <div class="px-xs">
        <h1 class="mb-m text-center">{{ data.title }}</h1>
        <p class="text-xs color-secondary text-center mb-l px-m">
          {{ formatPostDate(date) }}<template v-if="updated"> · Updated {{ formatPostDate(updated) }}</template>
        </p>
        <!-- The title above names the post; the cover is decoration. -->
        <img :src="data.cover" alt="" class="w-narrow rounded-s mb-xxl cover">
      </div>

      <ContentRendererMarkdown :value="data" class="w-narrow rich px-m" />
    </article>
    <template #empty>
      <article class="py-xxl rich mx-auto px-m">
        <h1 class="mb-xs">Content not found</h1>
      </article>
    </template>
  </ContentRenderer>
</template>

<style scoped>
.cover {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
}
</style>