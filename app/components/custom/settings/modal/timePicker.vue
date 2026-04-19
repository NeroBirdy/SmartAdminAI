<template>
  <TimeFieldRoot
    v-model="timeValue"
    v-slot="{ segments }"
    :hour-cycle="24"
    granularity="minute"
    class="time-field"
    :class="fieldStyle"
    :disabled="props.disabled"
  >
    <template v-for="item in segments" :key="item.part">
      <TimeFieldInput
        v-if="item.part === 'literal'"
        :part="item.part"
        class="time-literal cal-md"
      >
        {{ item.value }}
      </TimeFieldInput>
      <TimeFieldInput
        v-else
        :part="item.part"
        class="time-segment cal-md"
        :class="hourStyle(item.part)"
      >
        {{ item.value }}
      </TimeFieldInput>
    </template>
  </TimeFieldRoot>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { TimeFieldInput, TimeFieldRoot } from "reka-ui";
import { Time } from "@internationalized/date";

const modelValue = defineModel<Date | null>({ default: null });

const props = defineProps<{ error: boolean; disabled?: boolean }>();

const fieldStyle = computed(() => ({
  error: props.error,
  disabled: props.disabled,
}));

const hourStyle = (part: string) => ({
  hour: part == "hour",
});

const timeValue = computed({
  get: () => {
    if (!modelValue.value) return null;

    const date = new Date(modelValue.value);

    return new Time(date.getUTCHours(), date.getUTCMinutes());
  },
  set: (val: Time | null) => {
    if (!val) return;

    const baseDate = modelValue.value || new Date();

    const newDate = new Date(baseDate);
    newDate.setUTCHours(val.hour);
    newDate.setUTCMinutes(val.minute);
    newDate.setUTCSeconds(0);
    newDate.setUTCMilliseconds(0);

    modelValue.value = newDate;
  },
});
</script>
<style scoped>
.time-field {
  display: inline-flex;
  align-items: center;
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.15);
  background-color: #ffffff;
  border-radius: 6px;
  padding: 3px 5px 3px 7px;
  cursor: default;
  transition:
    background-color 0.3s ease,
    opacity 0.1s ease;
}

.time-field.error {
  background-color: #f8baaf;
}

.time-field.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.time-segment {
  color: #2d3142;
  -webkit-text-fill-color: #2d3142;
  background: transparent;
  border: none;
  outline: none;
  padding: 1px 3px;
  border-radius: 3px;
  width: 22px;
  text-align: center;
  caret-color: transparent;
  cursor: pointer;
}

.time-segment.hour {
  padding-left: 3px;
}

.time-segment:focus {
  background: #d0dafa;
  -webkit-text-fill-color: #4f6ef7;
}

.time-literal {
  color: #6a758b;
  user-select: none;
  padding: 0 1px;
}

.cal-md {
  font-size: 13px;
}
</style>
