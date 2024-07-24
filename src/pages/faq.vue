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
    name: 'Fearless Wallet FAQ',
    description: 'The FAQ section of Fearless Wallet provides essential information about features, security, supported cryptocurrencies, and troubleshooting tips to enhance user experience.'
  })
])

const items = [
  {
    title: 'How safe is a Fearless Wallet?',
    content: [
      [
        "Fearless Wallet is open-sourced, non-custodial, and decentralized."
      ], [
        "No other application on your mobile has access to Fearless Wallet during the creation of an account. If your device was compromised, your mnemonic will not be liable to be lost."
      ], [
        "If your device were to be lost, misplaced, or stolen, the pin acts as a safety net for you to immediately recover your account and open it on a different device to change your credentials and avoid a possible compromise. As your funds are stored on the blockchain, you don’t need to worry about their integrity if your mobile phone is compromised."
      ], [
        "You can read more about security ",
        { href: 'https://fearlesswallet.medium.com/security-in-fearless-wallet-773151bf64cb', title: 'here' },
        "."
      ]
    ]
  }, {
    title: 'Is Fearless wallet non-custodial?',
    content: [[
      "Yes, Fearless Wallet is a non-custodial wallet, meaning you have complete control over your accounts and funds. All your data is securely stored within a private app space on your device, eliminating the need to trust a third party. To ensure the safety of your funds, it's essential to securely store your seed phrase or JSON file along with its password. If you lose access to your wallet, these are the only ways to recover your funds."
    ]]
  }, {
    title: 'How to Buy Crypto with Fearless Wallet?',
    content: [
      [
        "How to buy $DOT and $KSM with fiat?"
      ], [
        "Follow these simple steps:"
      ], [
        '1. Go to the "Wallet" tab in the app.'
      ], [
        "2. Select the crypto you wish to buy."
      ], [
        '3. Click "Buy" and pick Ramp or MoonPay.'
      ], [
        '4. Follow the steps to finish your purchase.'
      ], [
        'Note: MoonPay only supports $DOT purchases.'
      ], [
        'Here you are! Your new crypto is now available in your account!'
      ]
    ]
  }, {
    title: 'How do you stake on the Fearless Wallet?',
    content: [
      [
        "Staking on the Fearless Wallet is a straightforward process that allows you to earn passive income from the blocks generated across various networks. To get started, simply open your Fearless Wallet mobile app and tap on the Staking section. Once you've set up your staking, the Staking section will serve as your information hub for all your validators. You can easily access and review notifications from them in the Alerts view, along with graphical summaries of your staked assets. It's that simple to stake fearlessly!"
      ], [
        "For more detailed instructions, please refer to our ",
        { title: "comprehensive guide.", href: 'https://wiki.fearlesswallet.io/getting-started/how-do-i-stake-my-crypto' },
        "."
      ]
    ]
  }, {
    title: 'How do I unstake on the Fearless Wallet?',
    content: [
      ['1. Go to the Staking tab'],
      ['2. Click on the "three dots" (top right corner of "Your Pool Staking" menu)'],
      ['3. Click Unstake'],
      ["4. Enter the value you'd like to unstake (either the whole amount or part of it)"],
      ['5. Make sure everything is correct and Confirm the transaction'],
    ]
  }, {
    title: 'What is the minimum amount I can contribute to a Crowdloan?',
    content: [
      [
        "The minimum amounts are set at 5 DOT for the Polkadot crowdloans and 0.1 KSM for Kusama crowdloans. Some teams may also choose to set their own minimum contribution required for receiving rewards. Setting a maximum contribution amount allows teams to place a cap on the rewards that they are willing to offer crowdloan contributors, and may differ from the hard cap set by either Polkadot or Kusama on the blockchain."
      ]
    ]
  }, {
    title: 'When will I get the contributed $DOT/$KSM back from the Crowdloan?',
    content: [
      [
        "If the project you support wins, your DOT (Polkadot) or KSM (Kusama) tokens will be locked for a duration of up to 24 months or 48 weeks, respectively. It's essential to confirm the specific lock duration with the project team, as they will determine the exact timeframe."
      ], [
        "In the event that the contributed project does not win, rest assured that your DOT/KSM tokens will be returned to you at the end of the next era, following the conclusion of the auction batch."
      ]
    ]
  }, {
    title: 'How do I import my Fearless Wallet?',
    content: [
      [
        "Read the article: ",
        {
          title: "Exporting and Importing a Wallet Using a Passphrase",
          href: 'https://wiki.fearlesswallet.io/accounts/walkthrough/exporting-and-importing-a-wallet-using-a-passphrase'
        }
      ]
    ]
  }, {
    title: 'How do I fix connection issues?',
    content: [
      [
        "Sometimes you may encounter network issues when using Fearless Wallet. This is a common situation that happens when a network is experiencing instability. But don't worry, there's a simple solution!"
      ], [
        "To fix this, you'll need to switch network nodes. Here's a step-by-step guide on how to do it: ",
        {
          title: "How do I switch network nodes?",
          href: "https://wiki.fearlesswallet.io/accounts/walkthrough/switching-network-nodes"
        }
      ], [
        "This guide will provide you with a comprehensive explanation of how to switch nodes and fix connection issues. Usually, simply switching to a different node can resolve the issue and get you back up and running!"
      ]
    ]
  }, {
    title: 'Where can I go if I have more questions?',
    content: [
      [
        "If you have more questions, feel free to reach out to our support team. You can join our ",
        {
          title: "support chat",
          href: "https://t.me/fearlesshappiness"
        },
        ", and we’ll be happy to assist you!"
      ]
    ]
  }
]
</script>

<template>
  <h1 class="w-narrow px-l pt-3xl text-center">
    Fearless Wallet <span class="color-accent">FAQ</span>
  </h1>
  <Accordion :items="items" class="w-narrow px-3xs my-xxl" />
</template>