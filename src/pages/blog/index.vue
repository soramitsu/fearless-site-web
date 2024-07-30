<template>
  <h1 class="w px-l pt-3xl pb-xxl text-center">
    Fearless <span class="color-accent">Blog</span>
  </h1>
  <section class="grid w px-xs mb-xxl">
    <ContentList :query="{ sort: [{ 'date': -1 }] }" v-slot="{ list }" path="/blog">
      <NuxtLink v-for="article in list" :to="article._path" class="link rounded-s bg-block p-xxs">
        <NuxtImg :src="article.cover" :alt="list[0].title" class="cover rounded-xs" />
        <div class="px-s pt-s pb-xs">
          <h2 class="text-m mb-3xs">{{ article.title }}</h2>
          <p class="text-xs color-secondary">{{ (new Date(article.date)).toDateString() }}</p>
        </div>
      </NuxtLink>
    </ContentList>
  </section>
</template>

<style scoped>
.grid {
  display: grid;
  gap: var(--space-m);
}

.link {
  display: grid;
}

.cover {
  aspect-ratio: 16/9;
}

@media (min-width: 800px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
  }
}

@media (hover:hover) {
  .link {
    transition: background-color .3s ease;
  }

  .link:hover {
    background-color: rgba(255, 255, 255, .1);
  }
}
</style>