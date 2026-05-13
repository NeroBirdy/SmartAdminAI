<template>
  <div class="day">
    <div class="day-text-wrapper" :class="dayTextStyle" @click="handleClick">
      <p class="main-text-sm day-text">{{ dateText }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isWithinInterval, isSameDay } from "date-fns";

const props = defineProps<{
  date: Date;
  isCurrentMonth: boolean;
}>();

const { selectedStart, selectedEnd } = useLogsFilters();

const dateText = computed(() => props.date.getDate().toString());

const isValidRange = computed(
  () =>
    !!selectedStart.value &&
    !!selectedEnd.value &&
    selectedEnd.value.getTime() > selectedStart.value.getTime(),
);

const dayTextStyle = computed(() => ({
  "is-start": isStart.value && props.isCurrentMonth && isValidRange.value,
  "is-end": isEnd.value && props.isCurrentMonth && isValidRange.value,
  "is-start-outside":
    isStart.value && !props.isCurrentMonth && isValidRange.value,
  "is-end-outside": isEnd.value && !props.isCurrentMonth && isValidRange.value,
  "in-range": inRange.value && isValidRange.value,
  "is-single": (isStart.value || isEnd.value) && !isValidRange.value,
  "not-current": !props.isCurrentMonth,
}));

const isStart = computed(
  () => selectedStart.value && isSameDay(props.date, selectedStart.value),
);
const isEnd = computed(
  () => selectedEnd.value && isSameDay(props.date, selectedEnd.value),
);
const inRange = computed(() => {
  if (!selectedStart.value || !selectedEnd.value) return false;
  return isWithinInterval(props.date, {
    start: selectedStart.value,
    end: selectedEnd.value,
  });
});

function handleClick() {
  if (!selectedStart.value || (selectedStart.value && selectedEnd.value)) {
    selectedStart.value = props.date;
    selectedEnd.value = null;
    return;
  }

  if (props.date < selectedStart.value) {
    selectedEnd.value = selectedStart.value;
    selectedStart.value = props.date;
  } else {
    selectedEnd.value = props.date;
  }
}
</script>

<style scoped>
.day {
  display: flex;
  justify-content: center;
}

.day-text-wrapper {
  display: flex;
  text-align: center;
  justify-content: center;
  width: 20px;
  padding: 4px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.15s;
}

.day-text-wrapper:hover {
  background-color: rgb(124, 181, 252);
}

.in-range {
  background-color: #bfdbfe;
  border-radius: 0;
}

.is-single {
  background-color: rgb(124, 181, 252);
  color: white;
  border-radius: 10px;
}

.is-start,
.is-end {
  background-color: rgb(124, 181, 252);
  color: white;
}

.is-start {
  border-radius: 10px 0 0 0;
}

.is-end {
  border-radius: 0 0 10px 0;
}

.is-start-outside {
  background-color: #bfdbfe;
  border-radius: 10px 0 0 0;
}

.is-end-outside {
  background-color: #bfdbfe;
  border-radius: 0 0 10px 0;
}

.not-current {
  opacity: 0.35;
}

p {
  margin: 0;
}
</style>
