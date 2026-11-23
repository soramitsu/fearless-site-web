<script setup lang="ts">
// A modal dialog. It is the browser's own <dialog>, so focus moves into it
// and stays there, Escape closes it, and focus goes back to the control that
// opened it. A click outside the content closes it too.
const props = defineProps<{
  open: boolean
  // What the dialog is, for assistive technology.
  label?: string
  opacity?: number
  // Kept for callers; the dialog is in the browser's top layer.
  zIndex?: number
}>()

const emit = defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement>()

const sync = () => {
  const el = dialog.value
  if (!el) return
  if (props.open && !el.open) el.showModal()
  else if (!props.open && el.open) el.close()
}

watch(() => props.open, sync, { flush: 'post' })
onMounted(sync)
</script>

<template>
  <dialog ref="dialog" class="modal p-3xs" :aria-label="label || 'Dialog'" :style="`--opacity: ${opacity || '0.75'}`"
    @close="emit('close')" @click.self="emit('close')">
    <div class="content">
      <p class="hint text-xs color-secondary">Esc closes. From inside a player, Shift+Tab back to Close.</p>
      <button class="close press" type="button" aria-label="Close" @click="emit('close')">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </button>
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  width: 100vw;
  max-width: 100vw;
  height: 100vh;
  max-height: 100vh;
  margin: 0;
  border: 0;
  background: transparent;
  color: inherit;
  overflow-y: auto;
}

.modal[open] {
  display: grid;
  align-items: center;
  /* Dialogs arrive from 0.88 over 255 ms. */
  animation: modal-arrive var(--d-255) var(--ease-settle);
}

.modal::backdrop {
  background-color: rgba(8, 3, 26, var(--opacity, 0.75));
  -webkit-backdrop-filter: blur(0.6rem);
  backdrop-filter: blur(0.6rem);
}

/* Sized by the height too, so a 16:9 slot and the Close button above it
   always fit, on a short laptop or a phone held sideways. */
.content {
  position: relative;
  width: 100%;
  max-width: min(128rem, calc((100vh - 2 * var(--space-xl) - 2 * var(--space-3xs)) * 16 / 9));
  max-width: min(128rem, calc((100dvh - 2 * var(--space-xl) - 2 * var(--space-3xs)) * 16 / 9));
  margin: 0 auto;
}

.close {
  position: absolute;
  top: calc(-1 * var(--space-xl));
  right: 0;
  width: 4.4rem;
  height: 4.4rem;
  border-radius: 50%;
  color: var(--fw-text);
  background-color: rgba(26, 14, 62, 0.9);
  box-shadow: inset 0 0 0 1px var(--color-line), inset 0 1px 0 rgba(255, 194, 74, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close svg {
  width: 45%;
  height: 45%;
}

/* Keys pressed inside an embedded player never reach the page, so say how
   to get out. Beside the Close button, so it takes no extra height. */
.hint {
  position: absolute;
  top: calc(-1 * var(--space-xl));
  left: 0;
  right: 5.6rem;
  height: 4.4rem;
  display: flex;
  align-items: center;
}

@media (max-width: 639px) {
  .hint {
    display: none;
  }
}

@keyframes modal-arrive {
  from {
    opacity: 0;
    transform: scale(0.88);
  }
}
</style>
