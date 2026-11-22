<script setup lang="ts">
import { detectDeviceType, detectMobileAppUrl } from "../helpers/common";
import { chromeExtensionUrl, downloadPagePath } from "~/lib/appLinks";

const title = "TON Connect";
const description = "TON Connect desctiption";
const keywords = "TON Connect, TON";
let deviceType = "desktop";

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

const steps = [
  {
    number: 1,
    subtitle: "Don’t have Fearless Wallet yet?",
    icon: "/icons/animated/step-1.svg",
    textBtn: "Install Fearless Wallet",
  },
  {
    number: 2,
    title: "After installation: ",
    subtitle: "Open the app and approve the dApp connection.",
    icon: "/icons/animated/step-2.svg",
    //textBtn: "Open Fearless Wallet",
  },
  {
    number: 3,
    title: "Once connected: ",
    subtitle: "Return to the dApp to continue.",
    icon: "/icons/animated/step-3.svg",
    //textBtn: "Return to dApp",
  },
];

onMounted(() => {
  deviceType = detectDeviceType();
});

const handleCLick = (step: number) => {
  if (step === 1) {
    if (deviceType === "desktop") window.open(chromeExtensionUrl);
    else window.open(detectMobileAppUrl() ?? downloadPagePath);

    return;
  }

  if (step === 2) {
    if (deviceType === "desktop")
      window.open(
        "chrome-extension://nhlnehondigmgckngjomcpcefcdplmgc/popup.html#/welcome"
      );
    else window.open("");

    return;
  }

  if (step === 3) {
  }
};
</script>

<template>
  <h1 class="text-l px-l pt-3xl text-center">Connect Fearless Wallet</h1>

  <div class="steps-container">
    <div
      v-for="step in steps"
      :key="step.title"
      class="bg-block lit rounded-s rich step"
    >
      <div class="step-content">
        <div class="step-icon">
          <img :src="step.icon" class="img" :alt="`Step ${step.number}`" width="96" height="96" />
        </div>

        <div class="step-description py-s pr-xs">
          <div v-if="step.title" class="text-s mt-xs step-title">{{ step.title }}</div>
          <div v-if="step.subtitle" class="text-xs mb-s">{{ step.subtitle }}</div>

          <Button v-if="step.textBtn"
            xsSmall
            accent
            :title="step.textBtn"
            class="step-btn"
            @click="handleCLick(step.number)"
          />
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
  flex-direction: column;
  justify-content: space-evenly;
  min-height: 150px;
}

.step-btn {
  width: 200px;
}

.step-title {
  color: var(--fw-gold);
}
</style>
