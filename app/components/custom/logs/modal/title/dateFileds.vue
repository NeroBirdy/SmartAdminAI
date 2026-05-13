<template>
  <div class="date-fields">
    <div class="fields-wrapper">
      <div class="DateFieldWrapper left">
        <DateFieldRoot
          v-model="startValue"
          v-slot="{ segments }"
          :placeholder="todayCalendar"
          locale="ru-RU"
          class="DateField"
        >
          <template v-for="item in segments" :key="item.part">
            <DateFieldInput
              v-if="item.part === 'literal'"
              :part="item.part"
              class="DateFieldLiteral"
              >{{ item.value }}</DateFieldInput
            >
            <DateFieldInput
              v-else
              :part="item.part"
              class="DateFieldSegment main-text-sm"
              >{{ item.value }}</DateFieldInput
            >
          </template>
        </DateFieldRoot>
      </div>
      <div class="DateFieldWrapper">
        <DateFieldRoot
          v-model="endValue"
          v-slot="{ segments }"
          :placeholder="todayCalendar"
          locale="ru-RU"
          class="DateField"
          :class="errorStyle"
        >
          <template v-for="item in segments" :key="item.part">
            <DateFieldInput
              v-if="item.part === 'literal'"
              :part="item.part"
              class="DateFieldLiteral"
              >{{ item.value }}</DateFieldInput
            >
            <DateFieldInput
              v-else
              :part="item.part"
              class="DateFieldSegment main-text-sm"
              >{{ item.value }}</DateFieldInput
            >
          </template>
        </DateFieldRoot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateFieldInput, DateFieldRoot, type DateValue } from "reka-ui";
import { CalendarDate, today, getLocalTimeZone } from "@internationalized/date";

const { selectedStart, selectedEnd, startDate, endDate, hasError } =
  useLogsFilters();

const todayCalendar = today(getLocalTimeZone());

const errorStyle = computed(() => ({
  hasError: hasError.value,
}));

const startBuffer = ref<CalendarDate | null>(null);
const endBuffer = ref<CalendarDate | null>(null);

const startValue = computed<DateValue | undefined>({
  get: () => {
    const d = selectedStart.value;
    if (!d) return (startBuffer.value as DateValue) ?? undefined;
    return new CalendarDate(
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
    ) as DateValue;
  },
  set: (val) => {
    if (!val) {
      selectedStart.value = null;
      startBuffer.value = null;
      return;
    }

    const calendarDate = val as CalendarDate;
    startBuffer.value = calendarDate;

    if (calendarDate.year < 1000) {
      selectedStart.value = null;
      return;
    }
    selectedStart.value = new Date(
      calendarDate.year,
      calendarDate.month - 1,
      calendarDate.day,
    );
  },
});

const endValue = computed<DateValue | undefined>({
  get: () => {
    const d = selectedEnd.value;
    if (!d) return (endBuffer.value as DateValue) ?? undefined;
    return new CalendarDate(
      d.getFullYear(),
      d.getMonth() + 1,
      d.getDate(),
    ) as DateValue;
  },
  set: (val) => {
    if (!val) {
      selectedEnd.value = null;
      endBuffer.value = null;
      return;
    }

    const calendarDate = val as CalendarDate;
    endBuffer.value = calendarDate;

    if (calendarDate.year < 1000) {
      selectedEnd.value = null;
      return;
    }
    selectedEnd.value = new Date(
      calendarDate.year,
      calendarDate.month - 1,
      calendarDate.day,
    );
  },
});

onMounted(() => {
  selectedStart.value = startDate.value;
  selectedEnd.value = endDate.value;
});

watch([selectedStart, selectedEnd], () => {
  if (selectedStart.value && selectedEnd.value) {
    hasError.value = selectedEnd.value < selectedStart.value;
  } else {
    hasError.value = false;
  }
});
</script>

<style scoped>
.date-fields {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  margin-bottom: 5px;
  margin-left: 10px;
}

.fields-wrapper {
  display: flex;
  flex-direction: row;
  gap: 12px;
  padding: 0 7px;
}

.DateFieldWrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.DateField {
  display: flex;
  align-items: center;
  background-color: #f3f4f6;
  border-radius: 10px;
  padding: 8px 8px;
  user-select: none;
  width: 80px;
  border: 1px solid #d4d7ddb6;
}

.DateField.hasError {
  border: 1px solid rgba(252, 101, 101, 0.521);
}

.DateFieldLiteral {
  padding: 0;
  color: #1f2937;
}

.DateFieldSegment {
  padding: 0 1px;
  color: #1f2937;
  border-radius: 3px;
  outline: none;
}

.DateFieldSegment[data-placeholder] {
  color: #9ca3af;
}

.DateFieldSegment:focus {
  background-color: #9da4b1;
  color: #ffffff;
}

.left {
  padding-right: 15px;
}

p {
  margin: 0;
}
</style>
