<template>
  <div class="break">
    <div class="time">
      <CustomSettingsModalBreakTimePicker
        v-model="model!.startTime"
        :error="hasError"
      />
      <div class="line-wrapper">
        <div class="line"></div>
      </div>
      <CustomSettingsModalBreakTimePicker
        v-model="model!.endTime"
        :error="hasError"
      />
    </div>
    <component class="icon" :is="closeIcon" @click="$emit('remove')" />
  </div>
</template>

<script lang="ts" setup>
import closeIcon from "~/assets/icons/x.svg";
type Break = { id: number; startTime: Date | null; endTime: Date | null };

const model = defineModel<Break>();

defineEmits<{
  (e: "remove"): void;
}>();

const hasError = computed(
  () =>
    !!model.value?.startTime &&
    !!model.value?.endTime &&
    new Date(model.value.startTime) >= new Date(model.value.endTime),
);
</script>

<style scoped>
.break {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 22px;
}

.time {
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
}

.line-wrapper {
  padding: 0 8px;
}

.line {
  width: 16px;
  height: 2.5px;
  background-color:#6a758b;
  border-radius: 5px;
}

.icon {
  cursor: pointer;
  scale: 0.7;
}
.icon :deep(path) {
  stroke: #6a758b;
  stroke-width: 3px;
}
</style>
