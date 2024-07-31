<script setup lang="ts">
const title = 'Fearless Wallet FAQ | Your Questions Answered About Our Digital Wallet',
  description =
    'Discover answers to all your questions about the Fearless Wallet in our comprehensive FAQ section. Learn about features, security, supported cryptocurrencies, and troubleshooting tips to enhance your experience with our user-friendly digital wallet.',
  keywords =
    'Fearless Wallet, FAQ, digital wallet questions, cryptocurrency wallet, wallet features, security measures, supported cryptocurrencies'

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description,
  keywords
})

useSchemaOrg([
  defineWebPage({
    inLanguage: "en-US",
    "@type": "FAQPage",
    "name": "Fearless Wallet Frequently Asked Questions",
    "description": "Answers to common questions about the safety, functionality, and features of Fearless Wallet.",
    "url": "https://www.fearlesswallet.io/faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How safe is Fearless Wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fearless Wallet is open-sourced, non-custodial, and decentralized mobile wallet designed with security in mind. No other application on your mobile device can access Fearless Wallet during account creation. Your mnemonic phrase is protected by a PIN, ensuring its safety even if your device is compromised."
        }
      },
      {
        "@type": "Question",
        "name": "Is Fearless Wallet non-custodial?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Fearless Wallet is a non-custodial wallet, meaning you have complete control over your accounts and funds. All your data is securely stored within a private app space on your device. To ensure the safety of your funds, it's essential to securely store your seed phrase or JSON file along with its password."
        }
      },
      {
        "@type": "Question",
        "name": "How to buy crypto with Fearless Wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Fearless Wallet has integrated MoonPay and RAMP, allowing you to purchase DOT and KSM directly within the app. Go to the 'Wallet' tab, select the token and network, click 'Buy,' choose MoonPay or RAMP, and follow the steps to complete your purchase."
        }
      },
      {
        "@type": "Question",
        "name": "How do you stake on the Fearless Wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Staking on the Fearless Wallet is straightforward. Open your Fearless Wallet app, tap on the Staking section to set up your staking. The Staking section will provide information about your validators and notifications."
        }
      },
      {
        "@type": "Question",
        "name": "How do I unstake on the Fearless Wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To unstake, go to the Staking tab, click on the 'three dots' in 'Your Pool Staking' menu, select 'Unstake,' enter the value you'd like to unstake, and confirm the transaction."
        }
      },
      {
        "@type": "Question",
        "name": "When will I get the contributed $DOT/$KSM back from the Crowdloan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If the project you support wins, your DOT or KSM tokens will be locked for up to 24 months or 48 weeks. If the project does not win, your tokens will be returned at the end of the next era after the auction batch."
        }
      },
      {
        "@type": "Question",
        "name": "How do I import my Fearless Wallet?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To import your wallet, open the Import Menu, choose the import method (Mnemonic Phrase, Raw Seed, or JSON File), and follow the prompts to enter your information."
        }
      },
      {
        "@type": "Question",
        "name": "How do I fix connection issues?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you encounter network issues while using Fearless Wallet, it may be due to network instability. A simple solution is usually available; please check our troubleshooting guide for more details."
        }
      }
    ]
  })
])

const activeItem = ref<number>()

const toggleAccordion = (id: number) => {
  if (activeItem.value === id) {
    activeItem.value = undefined
  } else {
    activeItem.value = id
  }
}
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    Fearless Wallet <span class="color-accent">FAQ</span>
  </h1>
  <AccordionContainer class="w-narrow px-3xs my-xxl">
    <ContentList v-slot="{ list }" path="/faq">
      <AccordionItem v-for="(item, i) in list" :title="item.question" :key="i" :id="i" @toggle="toggleAccordion"
        :open="i === activeItem">
        <ContentRenderer :value="item" />
      </AccordionItem>
    </ContentList>
  </AccordionContainer>
</template>