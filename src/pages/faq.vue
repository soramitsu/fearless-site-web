<script setup lang="ts">
const items = [
  {
    title: 'Who is developing the Fearless Wallet?',
    content: [
      'Fearless Wallet is developed by ',
      {
        title: 'Soramitsu',
        href: 'https://soramitsu.co.jp/',
      },
      " and has been supported by the Kusama Treasury and the SORA community. SORAMITSU is a Japanese technology company delivering blockchain-based solutions for enterprises, universities, and governments. From the creation of domestic and cross-border payment systems, to the development of a completely decentralized autonomous economy, SORAMITSU's projects and use case studies represent the next-generation of fintech."
    ]
  }, {
    title: 'Where is the source code for the Fearless Wallet?',
    content: [
      'Fearless iOS repos: ',
      {
        title: '.../fearless-iOS',
        href: 'https://github.com/soramitsu/fearless-iOS'
      },
      ', ',
      {
        title: '.../fearless-utils-iOS',
        href: 'https://github.com/soramitsu/fearless-utils-iOS'
      },
      '. Fearless Android repos: ',
      {
        title: '.../fearless-Android',
        href: 'https://github.com/soramitsu/fearless-Android'
      },
      ', ',
      {
        title: '.../fearless-utils-Android',
        href: 'https://github.com/soramitsu/fearless-utils-Android'
      },
      '.'
    ]
  }, {
    title: 'How do I contact the Soramitsu team?',
    content: [
      'You can email us at ',
      {
        title: 'fearless@soramitsu.co.jp',
        href: 'mailto:fearless@soramitsu.co.jp'
      },
      ' or join the Fearless Wallet Telegram group to ask any questions and stay updated with the latest news: ',
      {
        title: 't.me/fearlesswallet',
        href: 'https://t.me/fearlesswallet'
      },
      '.'
    ]
  }, {
    title: 'What features of Fearless Wallet are currently available?',
    content: [
      'The latest version including Staking, Analytics, Crowdloans, Account Management, Wallet, App Settings, Extrinsic Support, Multi-network and Multi-asset support is available now. Polkaswap and governance will come in 2023.'
    ]
  }, {
    title: 'What is the minimum amount I can contribute to a Crowdloan?',
    content: [
      'The minimum amounts are set at 5 DOT for the Polkadot crowdloans and 0.1 KSM for Kusama crowdloans. Some teams may also choose to set their own minimum contribution required for receiving rewards. Setting a maximum contribution amount allows teams to place a cap on the rewards that they are willing to offer crowdloan contributors, and may differ from the hard cap set by either Polkadot or Kusama on the blockchain.'
    ]
  }, {
    title: 'When will I get the contributed $DOT/$KSM back from the Crowdloan?',
    content: [
      'If the project you contributed to wins, your DOT/KSM will be locked for up to 24 months/48 weeks respectively (please confirm the slot duration with the project specifically, as they will be the ones to define the duration). If the contributed project loses, your DOT / KSM will be returned at the end of the next era after the auction batch has ended.'
    ]
  }, {
    title: 'What is staking?',
    content: [
      'Staking is locking your tokens in the network in order to generate new blocks. Using Fearless Wallet makes the process much simpler, with all the required information presented in a clear and intuitive manner for you to begin staking fearlessly.'
    ]
  }, {
    title: 'How do I import/export a wallet?',
    content: [
      'Read the article: ',
      {
        title: 'Exporting and Importing a Wallet Using a Passphrase',
        href: 'https://wiki.fearlesswallet.io/accounts/walkthrough/exporting-and-importing-a-wallet-using-a-passphrase'
      },
    ]
  }
]
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    Frequently Asked <span class="color-accent">Questions</span>
  </h1>
  <Accordion :items="items" class="w-narrow px-3xs my-xxl" />
</template>