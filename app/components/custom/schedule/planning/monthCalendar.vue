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
        <div
          class="calendar-cell"
          v-for="(cell, cIndex) in week"
          :key="cIndex"
          :class="{
            'other-month': !cell.isCurrentMonth,
            today: cell.isToday,
          }"
        >
          <p class="cell-date cal-event-md">{{ cell.date.getDate() }}</p>

          <div class="cell-events">
            <div
              class="cell-event"
              v-for="event in getEventsForDay(cell.date)"
              :key="event.id"
            >
              <div class="ellips-wrapper">
                <div
                  class="ellips"
                  :style="{
                    backgroundColor: getGroupColor(event.group.id),
                  }"
                ></div>
              </div>
              <p class="cal-event-md">{{ event.startTime }}</p>
              <p class="cal-event-md group-name">{{ event.group.name }}</p>
            </div>
          </div>
        </div>
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

const { currentDate, getEvents, getEventsForDay, getGroupColor } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const weeks = ref<calendarCell[][]>([]);

const buildCalendarGrid = () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Смещение: ПН = 0, ..., ВС = 6
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
};

const updateCalendar = async () => {
  buildCalendarGrid();
  await getEvents(currentDate.value);
};

updateCalendar();

watch(currentDate, updateCalendar);
</script>

<style scoped>
.inside-calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  border-left: 1px solid #e9eaec;
  border-top: 1px solid #e9eaec;
}

.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding-bottom: 10px;
}

.day-of-week {
  text-align: center;
  color: #9da4b1;
}

.day-of-week.weekend {
  color: #eb754c;
}

.calendar-cell {
  min-height: 100px;
  padding: 2px;
  border-right: 1px solid #dddfe5;
  border-bottom: 1px solid #dddfe5;
  text-align: center;
}

.other-month .cell-date {
  color: #9da4b1;
}

.cell-date {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #2b3850;
  margin: 0;
}

.today .cell-date {
  background-color: #3a8aef;
  width: 28px;
  height: 28px;
  color: white;
}

.header-sm,
.cal-md,
.cal-sm {
  user-select: none;
}

.cal-event-md {
  color: #2b3850;
}

.cell-event {
  display: flex;
  flex-direction: row;
  align-items: center;
  max-width: 150px;
  padding-bottom: 4px;
}

.group-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cell-event p {
  margin: 0;
  padding-right: 5px;
}

.ellips {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.ellips-wrapper {
  padding-left: 10px;
  padding-right: 5px;
}
</style>
