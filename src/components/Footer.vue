<script setup lang="ts">
const community = [{
  title: 'Telegram',
  link: 'https://t.me/fearlesswallet',
  icon: 'telegram'
}, {
  title: 'Announcements',
  link: 'https://t.me/fearless_announcements',
  icon: 'telegram'
}, {
  title: 'X',
  link: 'https://twitter.com/fearlesswallet',
  icon: 'x'
}, {
  title: 'GitHub',
  link: 'https://github.com/soramitsu',
  icon: 'github'
}, {
  title: 'YouTube',
  link: 'https://www.youtube.com/fearlesswallet',
  icon: 'youtube'
}, {
  title: 'Medium',
  link: 'https://medium.com/fearlesswallet',
  icon: 'medium'
}]

const downloadLinks = [{
  title: 'Chrome extension',
  href: 'https://chrome.google.com/webstore/detail/fearless-wallet/nhlnehondigmgckngjomcpcefcdplmgc',
  icon: 'chrome'
}, {
  title: 'iOS (App Store)',
  href: 'https://apps.apple.com/us/app/fearless-wallet/id1537251089',
  icon: 'appstore'
}, {
  title: 'Android (Play Market)',
  href: 'https://play.google.com/store/apps/details?id=jp.co.soramitsu.fearless',
  icon: 'playmarket'
}, {
  title: 'Android (APK)',
  href: 'https://github.com/soramitsu/fearless-Android/releases',
  icon: 'github'
}]

const aboutLinks = [{
  title: 'Fearless Wallet',
  href: '/'
}, {
  title: 'Roadmap',
  href: '/roadmap'
}, {
  title: 'FAQ',
  href: '/faq'
}, {
  title: 'Blog',
  href: '/blog',
  external: true
}]

const resourcesLinks = [{
  title: "Wiki",
  href: 'https://wiki.fearlesswallet.io/',
  external: true
},
{
  title: "GitHub iOS",
  href: 'https://github.com/soramitsu/fearless-iOS',
  external: true
},
{
  title: "GitHub iOS Utils",
  href: 'https://github.com/soramitsu/fearless-utils-iOS',
  external: true
},
{
  title: "Github Android",
  href: 'https://github.com/soramitsu/fearless-Android',
  external: true
},
{
  title: "Github Android Utils",
  href: 'https://github.com/soramitsu/fearless-utils-Android',
  external: true
},
{
  title: "Brand Assets",
  href: 'https://github.com/sora-xor/sora-branding/tree/master/Fearless-Wallet-brand',
  external: true
},]
</script>

<template>
  <footer class="w px-3xs pt-xxl">
    <div class="soramitsu color-secondary text-xs p-s">
      <svg width="153" height="29" viewBox="0 0 153 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_230_26931)">
          <path
            d="M141.645 13.4687V5.54156H132.476V9.59212C132.476 10.9092 132.401 11.9032 132.277 12.5741C132.153 13.2451 131.904 13.8415 131.556 14.3633L132.674 15.3325C133.122 14.7112 133.42 14.0154 133.619 13.2699C133.793 12.5244 133.892 11.5056 133.892 10.2134V6.73436H136.377V7.40531H134.464V8.44901H136.377V9.26907H134.265V10.3376H139.856V9.26907H137.744V8.44901H139.682V7.40531H137.744V6.73436H140.229V13.5433C140.229 13.7918 140.204 13.9409 140.154 13.9906C140.105 14.0403 139.955 14.0651 139.707 14.0651C139.682 14.0651 139.657 14.0651 139.632 14.0651C139.608 14.0651 139.558 14.0651 139.533 14.0651V10.8843H134.464V14.6367H135.756V14.1148H138.44L138.489 15.1834C139.26 15.2082 139.732 15.2331 139.906 15.2331C140.328 15.2331 140.626 15.2331 140.8 15.2082C140.999 15.1834 141.173 15.084 141.297 14.9597C141.422 14.8106 141.521 14.6615 141.546 14.4379C141.645 14.2391 141.645 13.916 141.645 13.4687ZM138.266 13.1208H135.805V11.9032H138.266V13.1208ZM148.777 11.928V10.1388H151.66V8.94601H148.777V7.45501H152.008V6.26221H145.621C145.671 6.13796 145.745 5.86461 145.895 5.44216L144.503 5.16881C144.006 6.73436 143.335 8.17566 142.465 9.51757L143.683 10.2631C143.857 9.98972 144.056 9.66667 144.255 9.29392V11.928H142.416V13.1705H147.286V15.2579H148.777V13.1705H152.48V11.928H148.777ZM147.286 11.928H145.671V10.1388H147.286V11.928ZM147.286 8.94601H144.453C144.677 8.52356 144.901 8.02656 145.149 7.45501H147.286V8.94601ZM35.7344 7.52956L38.443 6.38646C39.6607 8.92117 40.8038 11.431 41.8972 13.9409L39.114 14.9846C38.1945 12.8475 37.0514 10.3625 35.7344 7.52956ZM50.0977 6.21251C50.0231 8.67267 49.7995 10.7352 49.377 12.3505C48.9546 13.9657 48.2588 15.3325 47.3393 16.4507C46.4199 17.569 45.2768 18.389 43.8852 18.9606C42.4936 19.5321 40.7292 19.9794 38.5673 20.3025L39.114 22.9614C42.4439 22.539 45.078 21.7189 47.0411 20.551C49.0043 19.383 50.4456 17.6435 51.3899 15.3822C52.3342 13.1208 52.856 10.114 52.9554 6.38646L50.0977 6.21251ZM56.6581 14.1645H70.4996C70.0771 16.2271 68.9589 17.7429 67.1448 18.7369C65.3308 19.7309 62.8458 20.3025 59.6898 20.4764L60.1123 23.0608C64.7095 22.8123 68.114 21.7935 70.3256 19.9546C72.5373 18.1405 73.6555 15.5064 73.6555 12.0771V11.5801H56.6829V14.1645H56.6581ZM72.3136 8.54841V5.96401H58.2237V8.54841H72.3136ZM92.7652 23.1602L93.0634 20.3273C87.4722 19.3582 81.9554 18.7866 76.5381 18.6127L76.389 21.4456C81.6572 21.6195 87.1242 22.1911 92.7652 23.1602ZM92.0197 10.0643L92.3428 7.28106C87.4473 6.61011 82.4773 6.16281 77.4576 5.98886L77.3333 8.77207C82.1294 8.94602 87.0248 9.39332 92.0197 10.0643ZM90.653 16.2519L91.0506 13.419C86.6024 12.6487 82.4027 12.2014 78.4764 12.0274L78.2528 14.8852C82.3034 15.084 86.4284 15.5313 90.653 16.2519ZM98.0583 14.7112L100.866 14.1148C100.171 11.3068 99.5244 8.92117 98.928 6.93316L96.1945 7.52956C96.7661 9.54242 97.3873 11.928 98.0583 14.7112ZM110.98 6.28706C110.931 8.77207 110.707 10.8346 110.309 12.4499C109.912 14.09 109.266 15.4567 108.346 16.5501C107.452 17.6435 106.284 18.4636 104.867 19.06C103.451 19.6315 101.662 20.054 99.4499 20.3273L99.9966 22.9863C103.351 22.6135 106.01 21.8432 107.973 20.6504C109.937 19.4824 111.403 17.7678 112.347 15.5064C113.291 13.2451 113.788 10.2382 113.863 6.48586L110.98 6.28706ZM103.948 14.2142L106.756 13.6178C106.085 10.8843 105.439 8.39931 104.817 6.21251L102.009 6.83376C102.68 9.19452 103.326 11.6547 103.948 14.2142ZM125.344 8.57326C124.971 10.8843 124.101 12.9469 122.784 14.8106L121.517 14.1148C122.759 12.4002 123.579 10.4619 123.977 8.29991L125.344 8.57326ZM124.076 6.28706H128.723C128.798 7.70351 129.046 9.09512 129.494 10.4619C129.941 11.8038 130.537 13.0463 131.258 14.1397L129.991 14.8355C128.574 12.7232 127.704 10.2879 127.431 7.50471H124.076V6.28706ZM23.1354 9.98972H22.1414C21.4456 9.98972 20.8989 9.41817 20.8989 8.74722H17.9914H16.9974C16.3016 8.74722 15.7549 8.17566 15.7549 7.50471C15.7549 6.80891 16.3265 6.26221 16.9974 6.26221H17.9914H26.4404C23.8312 2.485 19.4576 0 14.5124 0C7.65382 0 1.91345 4.74636 0.397602 11.1577H11.5056H12.4996C13.1954 11.1577 13.7421 11.7292 13.7421 12.4002C13.7421 13.096 13.1705 13.6427 12.4996 13.6427H11.5056H8.59812C8.59812 14.3385 8.02657 14.8852 7.35561 14.8852H6.36161H0C0.02485 15.5064 0.0745513 16.1277 0.173951 16.7241H0.198801C4.62211 17.5193 9.64182 17.9914 14.9597 17.9914C19.9297 17.9914 24.6264 17.5938 28.8261 16.898C28.9503 16.1277 29.0249 15.3076 29.0249 14.4876C29.0249 12.922 28.7764 11.4062 28.3042 9.98972H23.1354ZM10.9837 20.7498C9.51757 20.7498 4.29906 21.2965 2.31105 21.4207V22.7129H10.6855C10.8346 21.7438 10.8843 21.2468 10.9837 20.7498ZM16.3762 23.6075L16.401 23.6572L17.1962 23.2348L17.1465 23.1851C16.7489 22.6135 16.4507 21.9674 16.2271 21.2716C16.0034 20.5758 15.8543 19.8303 15.8295 19.0848V19.0103H13.2451V19.7806H15.0343C15.1834 21.1971 15.6307 22.4893 16.3762 23.6075ZM18.4387 22.6881H26.515V21.3959C24.527 21.2716 19.4079 20.7249 17.9169 20.7249C18.0163 20.9734 18.2151 22.0171 18.4387 22.6881ZM23.5578 25.8192V24.4524H5.46701V25.8192C7.95201 27.8072 11.0831 29 14.5124 29C17.9169 29 21.0728 27.8072 23.5578 25.8192ZM13.1954 20.1285C12.9966 21.2468 12.5493 22.2656 11.9032 23.1851L11.8535 23.2348L12.6487 23.6572L12.6735 23.6075C13.3693 22.6135 13.8415 21.4953 14.0403 20.2776V20.2031L13.1954 20.054V20.1285Z"
            fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_230_26931">
            <rect width="153" height="29" fill="white" />
          </clipPath>
        </defs>
      </svg>
      Made with ♥ by Soramitsu for the multi-chain future
    </div>
    <div class="community outline-block rounded-s p-s text-xs">
      Join our community
      <div class="buttons">
        <Button v-for="item in community" :key="item.title" :title="item.title" :href="item.link" :icon="item.icon"
          small />
      </div>
    </div>
    <div class="navigation px-s py-l">
      <div class="about">
        <h3 class="py-xs text-xs color-secondary">About</h3>
        <NuxtLink v-for="item in aboutLinks" :key="item.title" :href="item.href"
          :target="item.external ? '_blank' : undefined" class="link text-xs">
          {{ item.title }}
          <img v-if="item.external" :src="`/icons/arrow.svg`" :alt="`arrow icon`" class="s" />
        </NuxtLink>
      </div>

      <div class="resources">
        <h3 class="py-xs text-xs color-secondary">Resources</h3>
        <NuxtLink v-for="item in resourcesLinks" :key="item.title" :href="item.href"
          :target="item.external ? '_blank' : undefined" class="link text-xs">
          {{ item.title }}
          <img v-if="item.external" :src="`/icons/arrow.svg`" :alt="`arrow icon`" class="s" />
        </NuxtLink>
      </div>

      <div class="chainlink">
        <a href="https://chain.link/badge" target="_blank" class="badge">
          <img src="https://chain.link/badge-market-data-black" alt="market data secured with chainlink" loading="lazy"
            width="180" height="50">
        </a>
      </div>

      <div class="downloads">
        <Button title="Downloads" href="/download" icon="download" accent class="mb-s" style="display: flex;" />
        <a v-for="item in downloadLinks" :key="item.title" :href="item.href" target="_blank" class="link text-xs">
          <img :src="`/icons/${item.icon}.svg`" :alt="`${item.icon} icon`" />
          {{ item.title }}
        </a>
      </div>
    </div>
    <div class="logo py-m px-xl">
      <img src="/elements/fearless-logo.svg" alt="Fearless Wallet logo" loading="lazy" />
    </div>
    <div class="legal p-m text-xs">
      © {{ new Date().getFullYear() }} soramitsu
      <NuxtLink href="/privacy" class="link">Privacy Policy</NuxtLink>
      <NuxtLink href="/terms" class="link">Terms of Service</NuxtLink>
    </div>
  </footer>
</template>

<style scoped>
.soramitsu,
.community {
  display: flex;
  justify-content: space-between;
  gap: var(--space-s);
  flex-direction: column;
  align-items: flex-start;
}

.community {
  text-wrap: nowrap;
}

.soramitsu svg {
  height: 3rem;
  width: auto;
}

.buttons {
  display: flex;
  gap: var(--space-4xs);
  flex-wrap: wrap;
}

.link {
  display: flex;
  align-items: center;
  gap: var(--space-xxs);
  transition: opacity 0.3s ease;
  height: 2.6em;
}

.link img {
  height: 1.5em;
  width: 1.5em;
}

.link img.s {
  height: 1em;
  width: 1em;
}

.navigation {
  display: grid;
  gap: var(--space-m);
  grid-template-columns: auto auto;
}

.downloads {
  display: grid;
  align-items: stretch;
}

.chainlink .badge img {
  display: flex;
  width: 18rem;
  height: 5rem;
  object-fit: contain;
  aspect-ratio: 18/5;
}

.logo {
  opacity: 0.1;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.logo>img {
  max-width: 34rem;
  width: 100%;
  aspect-ratio: 34/17;
}

.legal {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 var(--space-m);
  flex-wrap: wrap;
}

@media (hover: hover) {
  .link:hover {
    opacity: 0.7;
  }
}

@media (max-width: 799px) {
  .downloads {
    order: -1;
    grid-column-end: span 2;
  }

  .chainlink {
    grid-column-end: span 2;
    display: flex;
    justify-content: center;
  }
}

@media (min-width: 800px) {
  .navigation {
    grid-template-columns: repeat(2, minmax(15rem, auto)) 1fr 30rem;
    align-items: start;
  }

  .soramitsu {
    flex-direction: row;
    align-items: center;
  }

  .logo {
    margin-top: -16rem;
  }
}

@media (min-width: 960px) {
  .community {
    flex-direction: row;
    align-items: center;
  }
}
</style>