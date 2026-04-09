<template>
  <div class="frame">
    <div class="inside-frame">
      <div class="navigation">
        <ui-button
          class="btn header-sm btn-today"
          :class="{ active: currentDateCheck() }"
          @click="currentDateButtonHandler"
          >Сегодня</ui-button
        >
        <div class="nav-header">
          <component class="arrow-left" :is="arrow" @click="previousMonth" />
          <h1 class="header-sm">{{ monthYear }}</h1>
          <component class="arrow-right" :is="arrow" @click="nextMonth" />
        </div>
        <div class="mode-buttons">
          <ui-button class="btn header-sm">Месяц</ui-button>
          <ui-button class="btn header-sm">Неделя</ui-button>
        </div>
      </div>

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
    </div>
  </div>
</template>
<script lang="ts" setup>
import { isToday } from "date-fns";
import arrow from "../../assets/icons/arrow_left.svg";

type calendarCell = {
  isCurrentMonth: boolean;
  isToday: boolean;
  date: Date;
};

const today = new Date();

const { currentDate, getEvents, getEventsForDay, getGroupColor } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const weeks = ref<calendarCell[][]>([]);

const currentDateButtonHandler = () => {
  if (currentDate.value != today) {
    currentDate.value = today;
  }
};

const currentDateCheck = () => {
  return !(
    currentDate.value.getFullYear() === today.getFullYear() &&
    currentDate.value.getMonth() === today.getMonth()
  );
};

const monthYear = computed(() => {
  const str = currentDate.value.toLocaleString("ru-RU", {
    month: "long",
    year: "numeric",
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
});

const nextMonth = () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  if (month === 11) {
    currentDate.value = new Date(year + 1, 0, 1);
  } else {
    currentDate.value = new Date(year, month + 1, 1);
  }
};

const previousMonth = () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  if (month === 0) {
    currentDate.value = new Date(year - 1, 11, 1);
  } else {
    currentDate.value = new Date(year, month - 1, 1);
  }
};

const buildCalendarGrid = () => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Смещение: ПН = 0, ..., ВС = 6
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const cells: calendarCell[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
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
.inside-frame {
  padding: 18px 20px;
}

.navigation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 22px;
}

.nav-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 230px;
  padding-left: 105px;
}

.arrow-left {
  padding-left: 6px;
}

.arrow-right {
  padding-right: 6px;
  transform: rotate(180deg);
}

.mode-buttons {
  width: 210px;
  border-radius: 16px;
  padding: 4px;
  background-color: #f8f8f8;
}

.btn {
  min-width: 105px;
  min-height: 44px;
  background-color: #f8f8f8;
  color: #6a758b !important;
  overflow: visible;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.btn-today.active {
  background-color: #768298;
  color: white !important;
}

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
