<template>
  <div class="calendar">
    <CustomSchedulePlanningDaysOfWeek />
    <div class="inside-calendar">
      <template v-for="(week, wIndex) in weeks" :key="wIndex">
          <CustomTestMonthDay
            v-for="(cell, cIndex) in week"
            :key="cIndex"
            :date="cell.date"
            :isCurrentMonth="cell.isCurrentMonth"
            :isToday="cell.isToday"
          />
  
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addDays,
  format,
} from "date-fns";

type CalendarCell = {
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
};

const currentDate = ref(new Date());

const weeks = ref<CalendarCell[][]>([]);

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

buildCalendarGrid();

watch(currentDate, buildCalendarGrid);
</script>

<style scoped>
.inside-calendar {
  display: grid;
  grid-template-columns: repeat(7, 95px);
}
</style>
