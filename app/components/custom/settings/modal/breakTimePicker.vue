<template>
  <TimeFieldRoot
    v-model="timeValue"
    v-slot="{ segments }"
    :hour-cycle="24"
    granularity="minute"
    class="time-field"
    :class="errorStyle"
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

const props = defineProps<{ error: boolean }>();

const errorStyle = computed(() => ({
  error: props.error,
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
    console.log(val);
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
  background-color: #dddfe5;
  border-radius: 6px;
  cursor: default;
  height: 20px;
  padding: 1px 1px 1px 3px;
  transition:
    border-color 0.3s ease,
    background-color 0.3s ease;
}

.time-field.error {
  background-color: #f8baaf;
}

.time-segment {
  color: #2d3142;
  -webkit-text-fill-color: #2d3142;
  background: transparent;
  border: none;
  outline: none;
  padding: 1px 3px;
  border-radius: 3px;
  width: 18px;
  text-align: center;
  caret-color: transparent;
  cursor: pointer;
}

.time-segment.hour {
  padding-left: 3px;
}

.time-segment:focus {
  background: #606369;
  -webkit-text-fill-color: #dddfe5;
}

.time-literal {
  color: #6a758b;
  user-select: none;
  padding: 0 1px;
}

.cal-md {
  font-size: 12px;
}
</style>
