<template>
  <Transition name="modal">
    <custom-settings-modal-shedule
      v-if="isModalOpen"
      :type="type"
      :id="openId"
      :employee="props.employee"
      :venue="props.venue"
      @close="(id, type, success) => emit('close', id, type, success)"
    />
  </Transition>
  <Transition name="fade">
    <div class="overlay" v-if="isModalOpen" @click.stop="isModalOpen = false" />
  </Transition>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (
    e: "close",
    id: number,
    type: "save" | "delete" | "null",
    success: boolean,
  ): void;
}>();

const props = defineProps<{
  isModalOpen: boolean;
  openId: number;
  type: "organisation" | "employee" | "venue";
  employee?: { id: number; firstName: string; lastName: string };
  venue?: { id: number; name: string };
}>();
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
