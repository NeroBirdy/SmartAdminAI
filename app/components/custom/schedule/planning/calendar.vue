<template>
  <div class="calendar">
    <CustomSchedulePlanningDaysOfWeek />
    <div class="inside-calendar">
      <template v-for="(week, wIndex) in weeks" :key="wIndex">
        <template v-if="props.type == 'week'">
          <CustomSchedulePlanningWeekDay
            v-for="(cell, cIndex) in week"
            :key="cIndex"
            :date="cell.date"
            :isCurrentMonth="cell.isCurrentMonth"
            :isToday="cell.isToday"
            :lessons="getLessonsForCell(cell.date)"
          />
        </template>
        <template v-else>
          <CustomSchedulePlanningMonthDay
            v-for="(cell, cIndex) in week"
            :key="cIndex"
            :date="cell.date"
            :isCurrentMonth="cell.isCurrentMonth"
            :isToday="cell.isToday"
            :lessons="getLessonsForCell(cell.date)"
          />
        </template>
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

type calendarCell = {
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
};

const props = defineProps<{ type: string }>();

const { currentDate, schedule } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const weeks = ref<calendarCell[][]>([]);

const getLessonsForCell = (date: Date) => {
  if (!schedule.value) return [];
  const dateKey = format(date, "yyyy-MM-dd");

  return schedule.value[dateKey] || [];
};

const buildCalendarGrid = () => {
  const current = currentDate.value;
  const weekStartsOn = 1;

  const start = props.type === "week"
    ? startOfWeek(current, { weekStartsOn })
    : startOfWeek(new Date(current.getFullYear(), current.getMonth(), 1), { weekStartsOn });

  const days = props.type === "week"
    ? eachDayOfInterval({ start, end: endOfWeek(current, { weekStartsOn }) })
    : Array.from({ length: 42 }, (_, i) => addDays(start, i));

  const cells = days.map((date) => ({
    date,
    isCurrentMonth: isSameMonth(date, current),
    isToday: isToday(date),
  }));

  weeks.value = props.type === "week"
    ? [cells]
    : Array.from({ length: 6 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
};

buildCalendarGrid();

watch([currentDate, () => props.type], buildCalendarGrid);
</script>

<style scoped>
.inside-calendar {
  display: grid;
  position: relative;
  grid-template-columns: repeat(7, 1fr);
}
</style>
