<template>
  <div class="calendar-month-day" :class="dayClasses">
    <div class="inside-calendar-month-day">
      <div class="header">
        <h1 class="main-text-md" :class="currentMonthClass">
          {{ dateText }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import plural from "plural-ru";
import { format, lastDayOfMonth } from "date-fns";
import { ru } from "date-fns/locale";

type Group = {
  id: number;
  name: string;
  color: string;
};

type Venue = {
  id: number;
  name: string;
};

type Lesson = {
  id: string;
  startTime: string;
  endTime: string;
  color: string;
  group: Group;
  venue: Venue;
};

const { date, isToday, isCurrentMonth } = defineProps<{
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
}>();

const dayClasses = computed(() => ({
  currentMonth: !isCurrentMonth,
  today: isToday,
}));

const currentMonthClass = computed(() => ({
  currentMonth: !isCurrentMonth,
}));

const dateText = computed(() => {
  return format(date, "d");
});

</script>

<style scoped>
.calendar-month-day {
  height: 90px;
  width: 90px;
  margin-right: 2.5px;
  margin-left: 2.5px;
  margin-bottom: 5px;
  background-color: #dedfe2;
  border-radius: 7px;
  transition:
    min-height 0.3s ease,
    height 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
  z-index: 1;
}

.calendar-month-day.today {
  background-color: #f8d8ae;
}

.calendar-month-day.today:hover {
  background-color: #f7ce99;
}

.calendar-month-day.expanded {
  height: 324px;
  min-height: 324px;
  z-index: 10;
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
  transform: translateX(-50px);
}

.calendar-month-day.expanded.upward {
  transform: translate(-50px, calc(-324px + 108px));
}

.calendar-month-day:hover {
  background-color: #cdced3;
}

.calendar-month-day.currentMonth {
  background-color: #efeff0;
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
  overflow: hidden;
  max-height: 75px;
  transition: max-height 0.3s ease;
}

.events.expanded {
  max-height: 300px;
  overflow-y: auto;
  padding-bottom: 10px;
}

.events.expanded::-webkit-scrollbar {
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

.header.expanded {
  padding-bottom: 5px;
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