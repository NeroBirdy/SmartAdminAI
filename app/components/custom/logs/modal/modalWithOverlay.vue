<template>
  <Transition name="modal">
    <custom-logs-modal-logs
      v-if="isModalOpen"
      :type="type"
      @close="emit('close')"
    />
  </Transition>
  <Transition name="fade">
    <div class="overlay" v-if="isModalOpen" @click.stop="emit('close')" />
  </Transition>
</template>

<script lang="ts" setup>
import type { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

const props = defineProps<{
  isModalOpen: boolean;
  type: ChangeType;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

watch(
  () => props.isModalOpen,
  (val) => {
    document.body.style.overflow = val ? "hidden" : "";
  },
);

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.85);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(1px);
  background: rgba(0, 0, 0, 0.25);
  z-index: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
