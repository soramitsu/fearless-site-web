import { fileURLToPath } from 'node:url'
import remarkBreaks from 'remark-breaks'

const title = 'Fearless Wallet The DeFi Crypto Wallet for Multi-Chain Future',
  description =
    'Fearless Wallet is a Multi-chain Web3 Wallet. Web and mobile app versions. Securely buy, sell, trade, store, stake and send Crypto across 50+ blockchains.',
  keywords =
    'crypto wallet apps, wallet app, wallet web, krypto wallet, browser wallet, crypto wallet, blockchain wallet app',
  ogImage = `${process.env.NUXT_PUBLIC_BASE_URL || 'https://fearlesswallet.io'}/og.jpg`

const motionScript = `(function(){var d=document.documentElement;d.classList.add('js');document.addEventListener('click',function(e){if(d.classList.contains('nav-ready'))return;var b=e.target&&e.target.closest&&e.target.closest('.burger'),n=document.getElementById('site-menu');if(!b||!n)return;var o=!n.classList.contains('open');n.classList.toggle('open',o);b.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false')});document.addEventListener('keydown',function(e){if(e.key!=='Escape'||d.classList.contains('nav-ready'))return;var n=document.getElementById('site-menu'),b=document.querySelector('.burger');if(!n||!b||!n.classList.contains('open'))return;n.classList.remove('open');b.classList.remove('open');b.setAttribute('aria-expanded','false');b.focus()});try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion');var c=navigator.connection;if(location.pathname==='/'&&!sessionStorage.getItem('fw-launched')&&!(c&&c.saveData))d.classList.add('launch')}}catch(e){}})()`

export default defineNuxtConfig({
  // Content 2 snapshots its cache with an fs driver that ignores node_modules.
  // Keep the build cache outside Nuxt 4's relocated node_modules cache.
  buildDir: '.nuxt',
  srcDir: 'src/',
  serverDir: 'src/server',
  dir: { public: 'src/public' },
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxt/content', '@nuxtjs/sitemap'],

  content: {
    sources: {
      content: { driver: 'fs', base: fileURLToPath(new URL('./src/content', import.meta.url)) },
    },
    markdown: {
      remarkPlugins: {
        'remark-breaks': {}
      }
    }
  },

  site: {
    url: 'https://fearlesswallet.io',
    name: 'Fearless Wallet',
  },


  sitemap: {
    sources: ['/api/sitemap'],
    credits: false,
  },

  runtimeConfig: {
    public: {
      baseUrl: 'https://fearlesswallet.io',
    },
  },

  routeRules: {
    '/.well-known/assetlinks.json': {
      headers: {
        'cache-control': 'public, max-age=300, must-revalidate',
        'content-type': 'application/json; charset=utf-8',
        'x-content-type-options': 'nosniff',
      },
    },
    '/.well-known/apple-app-site-association': {
      headers: {
        'cache-control': 'public, max-age=300, must-revalidate',
        'content-type': 'application/json; charset=utf-8',
        'x-content-type-options': 'nosniff',
      },
    },
    '/.well-known/apple-app-site-association.json': {
      headers: {
        'cache-control': 'public, max-age=300, must-revalidate',
        'content-type': 'application/json; charset=utf-8',
        'x-content-type-options': 'nosniff',
      },
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
      script: [
        {
          // Runs before the first paint. `js` marks a page whose script runs,
          // and until the app takes over (`nav-ready`) a tap on Menu opens the
          // phone menu here, so it works even if the app's script fails;
          // `motion` lets the styles animate and is never set for visitors who
          // ask for reduced motion; `launch` opens the home page's stage with
          // the apps' launch, once a session.
          key: 'fw-motion',
          tagPosition: 'head',
          innerHTML: motionScript,
        },
      ],
      link: [
        {
          rel: 'preload',
          href: '/fonts/sora.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        {
          rel: 'preload',
          href: '/fonts/figtree-400.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: 'anonymous',
        },
        // The ?v= marks the Yatagarasu icons, so browsers and search engines
        // that cached the old bird at these URLs fetch them again.
        { rel: 'icon', href: '/favicon.ico?v=yatagarasu', sizes: '32x32' },
        { rel: 'icon', href: '/icon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png?v=yatagarasu' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      // Wallet connection links can contain session/request parameters.
      // Global analytics can disclose those payloads through page views.
      meta: [
        {
          name: 'theme-color',
          content: '#120A2E',
        },
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
          property: 'og:type',
          content: 'website',
        },
      ],
    },
  },

  compatibilityDate: '2024-07-08',
})
