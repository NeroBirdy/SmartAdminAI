<template>
  <Transition name="icon-swap" mode="out-in">
    <component
      v-if="scheduleExist"
      class="icon check"
      :is="checkIcon"
      :key="'check'"
      @click.stop="emit('click')"
    />
    <component
      v-else
      class="icon"
      :is="questionIcon"
      :key="'question'"
      @click.stop="emit('click')"
    />
  </Transition>
</template>

<script lang="ts" setup>
import questionIcon from "~/assets/icons/circle_question_mark.svg";
import checkIcon from "~/assets/icons/circle_check.svg";

const emit = defineEmits<{
  (e: "click"): void;
}>();

defineProps<{ scheduleExist: boolean }>();
</script>

<style scoped>
.icon {
  padding-left: 8px;
  cursor: pointer;
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.icon-swap-enter-to,
.icon-swap-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
