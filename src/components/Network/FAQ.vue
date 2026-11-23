<script setup lang="ts">
const { fullName, shortName } = defineProps<{
  fullName: string
  shortName: string
}>()

// After "my" or "your" a name loses its own article: "my Open Network
// wallet", not "my The Open Network wallet".
const bareName = computed(() => fullName.replace(/^The\s+/, ''))

const data = computed(() => [
  {
    question: `How do I secure my ${bareName.value} wallet?`,
    answer: `With Fearless Wallet, securing your ${bareName.value} wallet is simple yet robust. You have full control over your private keys, and the wallet ensures your seed phrase is safely stored offline. To enhance security, we recommend enabling biometric login, setting up a strong password, and always backing up your recovery phrase. Fearless Wallet also offers regular updates to keep your assets protected from the latest threats, so you can rest easy knowing your ${bareName.value} assets are secure.`,
  },
  {
    question: "Which tokens are supported in Fearless Wallet?",
    answer: `Select ${fullName} in your wallet to see ${shortName} and the other assets available on that network.`,
  },
  {
    question: `What are the transaction fees for ${fullName} in Fearless Wallet?`,
    answer: `When you send ${shortName} on ${fullName}, the wallet shows the estimated network fee before you confirm the transfer.`,
  },
  {
    question: "What should I do if I lost access to my wallet?",
    answer: "If you lose access to your Fearless Wallet, don’t worry—your recovery phrase is your key to regaining access. Simply use the backup seed phrase you saved when setting up your wallet to restore your account. It's essential to keep this phrase secure and offline, as only you have control over it. Fearless Wallet cannot recover your wallet for you, so safeguarding your recovery phrase is critical for ensuring access to your assets.",
  },
])
</script>

<template>
  <h2 class="w-narrow px-l mt-3xl text-center text-xxl">
    FAQ
  </h2>
  <AccordionContainer class="w-narrow px-3xs mt-xl mb-3xl">
    <AccordionItem v-for="item in data" :key="item.question" :title="item.question" name="network-faq">
      {{ item.answer }}
    </AccordionItem>
  </AccordionContainer>
</template>
