const title = 'Fearless Wallet The Mobile Crypto Wallet for Multi-Chain Future',
  description =
    'Fearless Wallet is a Multi-chain Web3 Wallet. Web and mobile app versions. Securely buy, sell, trade, store, stake and send Crypto across 80+ blockchains.',
  keywords =
    'crypto wallet apps, wallet app, wallet web, krypto wallet, browser wallet, crypto wallet, blockchain wallet app',
  ogImage = `${process.env.NUXT_PUBLIC_BASE_URL || ''}/og.jpg`

export default defineNuxtConfig({
  srcDir: 'src/',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxt/content', 'nuxt-schema-org', '@nuxtjs/sitemap'],

  content: {
    markdown: {
      anchorLinks: false,
    },
  },

  site: {
    url: 'https://fearlesswallet.io',
    name: 'Fearless Wallet',
  },

  schemaOrg: {
    identity: {
      type: 'Organization',
      name: 'Fearless Wallet',
      url: 'https://fearlesswallet.io',
      logo: 'https://fearlesswallet.io/logo.svg',
      sameAs: [
        'https://x.com/FearlessWallet',
        'https://t.me/fearlesswallet',
        'https://www.youtube.com/c/FearlessWallet',
      ],
      email: 'fearless@soramitsu.co.jp',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: title,
      link: [
        {
          rel: 'icon',
          href: '/favicon.ico',
          sizes: '32x32',
        },
        {
          rel: 'icon',
          href: '/icon.png',
          type: 'image/png',
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png',
        },
      ],
      script: [
        {
          key: 'gtag script',
          async: true,
          defer: true,
          src: 'https://www.googletagmanager.com/gtag/js?id=G-SBBH53BXP4',
        },
        {
          key: 'gtag config',
          innerHTML: `
          window.addEventListener("load", function () {
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag('js', new Date());
            gtag('config', 'G-SBBH53BXP4');
          });`,
        },
      ],
      meta: [
        {
          name: 'description',
          content: description,
        },
        {
          name: 'keywords',
          content: keywords,
        },
        {
          name: 'twitter:title',
          content: title,
        },
        {
          name: 'twitter:description',
          content: description,
        },
        {
          name: 'twitter:image',
          content: ogImage,
        },
        {
          name: 'twitter:image:alt',
          content: title,
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image',
        },
        {
          name: 'twitter:site',
          content: '@fearlesswallet',
        },
        {
          property: 'og:title',
          content: title,
        },
        {
          property: 'og:description',
          content: description,
        },
        {
          property: 'og:image',
          content: ogImage,
        },
        {
          property: 'og:image:secure_url',
          content: ogImage,
        },
        {
          property: 'og:image:width',
          content: '1200',
        },
        {
          property: 'og:image:height',
          content: '630',
        },
        {
          property: 'og:url',
          content: 'https://fearlesswallet.io',
        },
        {
          property: 'og:type',
          content: 'website',
        },
      ],
    },
  },

  compatibilityDate: '2024-07-08',
})
