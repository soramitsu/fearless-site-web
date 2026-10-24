<script setup lang="ts">
import { chromeExtensionUrl, minimumExtensionVersion } from '~/lib/appLinks'

const steps = ref<HTMLDetailsElement>()

// Lets support link straight to the steps: https://fearlesswallet.io/#update-extension
onMounted(() => {
  if (location.hash === '#update-extension' && steps.value) steps.value.open = true
})
</script>

<template>
  <aside id="update-extension" class="update-banner" aria-labelledby="update-extension-title">
    <div class="w px-xs py-xs">
      <p class="text-s">
        <strong id="update-extension-title">
          We recommend updating your Fearless Wallet Chrome extension to {{ minimumExtensionVersion }} or later
          immediately.
        </strong>
        Don't uninstall it: that deletes your wallets.
      </p>
      <details ref="steps" class="text-xs">
        <summary class="bold">How to update safely</summary>
        <ol>
          <li>
            Open <code>chrome://extensions</code>, turn on Developer mode, click Update, then check the version is
            {{ minimumExtensionVersion }} or later.
          </li>
          <li>In the extension, create a new wallet and move your funds to it, as it guides you.</li>
          <li>
            Install only from the <a :href="chromeExtensionUrl" target="_blank" rel="noopener">Chrome Web Store</a>
            and never share your recovery phrase.
          </li>
        </ol>
      </details>
    </div>
  </aside>
</template>

<style scoped>
.update-banner {
  background-color: #a8005a;
  color: #fff;
}

.update-banner a {
  color: inherit;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

summary {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  margin-top: var(--space-4xs);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}

summary::-webkit-details-marker {
  display: none;
}

summary::after {
  content: '';
  width: 0.45em;
  height: 0.45em;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-0.15em) rotate(45deg);
  transition: transform 0.2s ease;
}

details[open] summary::after {
  transform: translateY(0.1em) rotate(-135deg);
}

ol {
  max-width: 86rem;
  margin-top: var(--space-3xs);
  padding-left: 1.6em;
}

li:not(:last-child) {
  margin-bottom: var(--space-4xs);
}

code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 0.95em;
  padding: 0.05em 0.35em;
  border-radius: 0.3em;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
