<template>
  <div class="time">
    <CustomSettingsModalTimePicker
      v-model="day.startWork"
      :error="hasError"
      :disabled="!day.isWorkingDay"
    />
    <div class="line-wrapper">
      <div class="line" :class="disabledStyle"></div>
    </div>
    <CustomSettingsModalTimePicker
      v-model="day.endWork"
      :error="hasError"
      :disabled="!day.isWorkingDay"
    />
  </div>
</template>
<script lang="ts" setup>
type Day = {
  id: number;
  dayOfWeek: string;
  isWorkingDay: boolean;
  startWork: Date | null;
  endWork: Date | null;
  breaks: { id: number; startTime: Date; endTime: Date }[];
};

const day = defineModel<Day>({ required: true });

const disabledStyle = computed(() => ({
  disabled: !day.value.isWorkingDay,
}));

const hasError = computed(
  () =>
    !!day.value?.startWork &&
    !!day.value?.endWork &&
    new Date(day.value.startWork) >= new Date(day.value.endWork),
);
</script>
<style scoped>
.time {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.line-wrapper {
  padding: 0 8px;
}

.line {
  width: 16px;
  height: 2.5px;
  background-color: #6a758b;
  border-radius: 5px;
}

.line.disabled {
  background-color: #9095a0;
}
</style>
