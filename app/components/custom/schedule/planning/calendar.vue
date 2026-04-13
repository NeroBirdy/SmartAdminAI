<template>
  <div class="calendar">
    <div class="days-of-week">
      <div
        class="day-of-week cal-md"
        v-for="value in daysOfWeek"
        :key="value"
        :class="{ weekend: value === 'СБ' || value === 'ВС' }"
      >
        {{ value }}
      </div>
    </div>
    <div class="inside-calendar">
      <template v-for="(week, wIndex) in weeks" :key="wIndex">
        <template v-if="props.type == 'week'">
          <CustomSchedulePlanningWeekDay
            v-for="(cell, cIndex) in week"
            :key="cIndex"
            :date="cell.date"
            :isCurrentMonth="cell.isCurrentMonth"
            :isToday="cell.isToday"
          />
        </template>
        <template v-else>
          <CustomSchedulePlanningMonthDay
            v-for="(cell, cIndex) in week"
            :key="cIndex"
            :date="cell.date"
            :isCurrentMonth="cell.isCurrentMonth"
            :isToday="cell.isToday"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isToday } from "date-fns";

type calendarCell = {
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
};

const props = defineProps<{ type: string }>();

const { currentDate, getEvents } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const weeks = ref<calendarCell[][]>([]);

const buildCalendarGrid = () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  if (props.type === "week") {
    const today = new Date(currentDate.value);
    const day = today.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(today.setDate(today.getDate() + diff));

    const cells: calendarCell[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      cells.push({
        date,
        isCurrentMonth: date.getMonth() === month,
        isToday: isToday(date),
      });
    }

    weeks.value = [cells];
  }
  if (props.type === "month") {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    const cells: calendarCell[] = [];

    for (let i = startOffset; i > 0; i--) {
      const d = new Date(year, month, 0 - (i - 1));
      cells.push({ date: d, isCurrentMonth: false, isToday: false });
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      cells.push({
        date: date,
        isCurrentMonth: true,
        isToday: isToday(date),
      });
    }
    let next = 1;
    while (cells.length < 42) {
      cells.push({
        date: new Date(year, month + 1, next++),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    const result = [];
    for (let i = 0; i < cells.length; i += 7) {
      result.push(cells.slice(i, i + 7));
    }

    weeks.value = result;
  }
};

const updateCalendar = async () => {
  buildCalendarGrid();
  await getEvents(currentDate.value);
};

updateCalendar();

watch([currentDate, () => props.type], updateCalendar);
</script>

<style scoped>
.inside-calendar {
  display: grid;
  position: relative;
  grid-template-columns: repeat(7, 1fr);
}

.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding-bottom: 5px;
}

.day-of-week {
  text-align: center;
  color: #9da4b1;
}

.day-of-week.weekend {
  color: #eb754c;
}
</style>
