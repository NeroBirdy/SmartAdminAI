<template>
  <div class="calendar">
    <div class="calendar-header">
      <p class="calendar-title header-sm">{{ dateText }}</p>
      <div class="arrows">
        <component :is="arrow" class="arrow-left" @click="previousMonth" />
        <component :is="arrow" class="arrow-right" @click="nextMonth" />
      </div>
    </div>
    <custom-logs-modal-title-days-of-week />
    <div class="inside-calendar">
      <template v-for="(week, wIndex) in weeks" :key="wIndex">
        <custom-logs-modal-title-calendar-day
          v-for="(cell, cIndex) in week"
          :key="cIndex"
          :date="cell.date"
          :isCurrentMonth="cell.isCurrentMonth"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import arrow from "~/assets/icons/arrow_left.svg";
import {
  startOfWeek,
  isSameMonth,
  isToday,
  addDays,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import { ru } from "date-fns/locale";

type CalendarCell = {
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
};

const { currentDate, selectedStart } = useLogsFilters();

const weeks = ref<CalendarCell[][]>([]);

const dateText = computed(() => {
  const str = format(currentDate.value, "LLLL yyyy", { locale: ru });
  return str.charAt(0).toUpperCase() + str.slice(1);
});

function previousMonth() {
  currentDate.value = subMonths(currentDate.value, 1);
}

function nextMonth() {
  currentDate.value = addMonths(currentDate.value, 1);
}

const getMonthDays = () => {
  const current = currentDate.value;
  const start = startOfWeek(
    new Date(current.getFullYear(), current.getMonth(), 1),
    { weekStartsOn: 1 },
  );
  return Array.from({ length: 42 }, (_, i) => addDays(start, i));
};

function buildCalendarGrid() {
  const current = currentDate.value;
  const days = getMonthDays();

  const cells = days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, current),
    isToday: isToday(date),
  }));

  weeks.value = Array.from({ length: 6 }, (_, i) =>
    cells.slice(i * 7, i * 7 + 7),
  );
}

onMounted(() => {
  currentDate.value = new Date();
});

buildCalendarGrid();

watch(currentDate, buildCalendarGrid);
watch(selectedStart, (newVal) => {
  if (!newVal) return;
  if (
    newVal.getMonth() !== currentDate.value.getMonth() ||
    newVal.getFullYear() !== currentDate.value.getFullYear()
  ) {
    currentDate.value = newVal;
  }
});
</script>

<style scoped>
.inside-calendar {
  display: grid;
  width: 250px;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-left: 7px;
  padding-right: 7px;
}

.arrow-left {
  padding-right: 30px;
  cursor: pointer;
}

.arrow-right {
  transform: rotate(180deg);
  cursor: pointer;
}

.calendar-title {
  font-size: 14px;
  padding-bottom: 3px;
}

p {
  margin: 0;
}
</style>
