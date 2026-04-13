<template>
  <div
    class="calendar-month-day"
    :class="{
      today: props.isToday,
    }"
  >
    <div class="inside-calendar-month-day">
      <div class="header">
        <h1 class="main-text-md">
          {{ getDateText() }}
        </h1>
        <p class="main-text-sm" v-if="events.length">
          {{ events.length }}
          {{ plural(events.length, "урок", "урока", "уроков") }}
        </p>
      </div>
      <div class="events" ref="eventsRef">
        <template v-for="event in events"
          ><CustomSchedulePlanningWeekLesson :lesson="event"
        /></template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import plural from "plural-ru";

const {getEventsForDay } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const props = defineProps<{
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
}>();

const months = [
  "янв",
  "фев",
  "мар",
  "апр",
  "мая",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

const getDateText = () => {
  const month = props.date.getMonth();
  const day = props.date.getDate();
  const lastDay = new Date(
    props.date.getFullYear(),
    props.date.getMonth() + 1,
    0,
  ).getDate();
  if (day == 1 || day == lastDay) {
    return `${day} ${months[month]}`;
  }
  return `${day}`;
};

const events = computed(() => getEventsForDay(props.date));
</script>

<style scoped>
.calendar-month-day {
  min-height: 673px;
  margin-left: 2.5px;
  margin-right: 2.5px;
  margin-bottom: 5px;
  background-color: #dedfe2;
  border-radius: 7px;
  z-index: 1;
}

.calendar-month-day.today {
  background-color: #f8d8ae;
}

.inside-calendar-month-day {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.events {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  max-height: 635px;
}

.events::-webkit-scrollbar {
  display: none;
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 5px;
  padding-top: 7px;
  transition: padding-bottom 0.3s ease;
}

.header h1,
p {
  margin: 0;
  padding: 0;
}

.header h1 {
  padding-right: 7px;
}

.main-text-md {
  color: rgb(41, 41, 41);
  font-size: 14.5px;
}

.main-text-md.currentMonth {
  color: rgb(107, 107, 107);
}

.main-text-sm {
  color: rgb(107, 107, 107);
  font-size: 12px;
}
</style>
