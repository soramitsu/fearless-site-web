<script setup lang="ts">
import { androidAppUrl, iosAppUrl } from "~/lib/appLinks";

// TON Connect works in the iOS and Android apps. The browser extension's
// store release (4.2.10) does not have it yet, so every visitor, on a
// computer too, is sent to the phone apps rather than to the extension.
const title = "TON Connect with Fearless Wallet";
const description = "Connect Fearless Wallet on iOS or Android to TON apps with TON Connect: install the app, open the TON app, and approve the connection in Fearless Wallet.";
const keywords = "TON Connect, TON";

useSeoMeta({
  title,
  ogTitle: title,
  twitterTitle: title,
  description,
  ogDescription: description,
  twitterDescription: description
});

useHead({
  meta: [{ name: "keywords", content: keywords }]
});

useSchemaOrg([defineWebPage({ inLanguage: "en-US", name: title, description })]);

const steps = [
  {
    number: 1,
    subtitle: "Don’t have Fearless Wallet on your phone yet?",
    icon: "/icons/animated/step-1.svg",
    links: [
      { title: "Download for iOS", href: iosAppUrl },
      { title: "Download for Android", href: androidAppUrl },
    ],
  },
  {
    number: 2,
    title: "After installation: ",
    subtitle: "Open the app and approve the dApp connection.",
    icon: "/icons/animated/step-2.svg",
  },
  {
    number: 3,
    title: "Once connected: ",
    subtitle: "Return to the dApp to continue.",
    icon: "/icons/animated/step-3.svg",
  },
];
</script>

<template>
  <h1 class="text-l px-l pt-3xl text-center">Connect Fearless Wallet</h1>

  <div class="steps-container">
    <div
      v-for="step in steps"
      :key="step.number"
      class="bg-block lit rounded-s rich step"
    >
      <div class="step-content">
        <div class="step-icon">
          <img :src="step.icon" class="img" :alt="`Step ${step.number}`" width="96" height="96" />
        </div>

        <div class="step-description py-s pr-xs">
          <h2 v-if="step.title" class="text-s mt-xs step-title">{{ step.title }}</h2>
          <div v-if="step.subtitle" class="text-xs mb-s">{{ step.subtitle }}</div>

          <div v-if="step.links" class="step-links">
            <Button v-for="link in step.links"
              :key="link.href"
              xsSmall
              accent
              :title="link.title"
              :href="link.href"
              target="_blank"
              class="step-btn"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.steps-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
}

.step-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 95px;
  max-width: 95px;
  height: 150px;
}

.step {
  width: 343px;
  max-width: calc(100vw - 2 * var(--space-xs));
}

.step-content {
  display: flex;
}

.img {
  height: 72px;
  width: 72px;
}

.step-description {
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 150px;
}

.step-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
}

.step-btn {
  width: 200px;
  max-width: 100%;
}

/* A heading in the page's outline that keeps the step's plain label look. */
.step-title {
  color: var(--fw-gold);
  font-weight: 400;
  letter-spacing: 0;
}
</style>
