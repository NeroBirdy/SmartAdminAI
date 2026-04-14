<template>
  <div
    class="calendar-month-day"
    :class="dayClasses"
  >
    <div class="inside-calendar-month-day">
      <div class="header">
        <h1 class="main-text-md">
          {{ dateText }}
        </h1>
        <p class="main-text-sm" v-if="lessons.length">
          {{ getLessonsLengthText() }}
        </p>
      </div>
      <div class="events">
        <template v-for="lesson in lessons"
          ><CustomSchedulePlanningWeekLesson :lesson="lesson"
        /></template>
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

const { date, isToday, lessons } = defineProps<{
  date: Date;
  isToday: boolean;
  lessons: Lesson[];
}>();

const dayClasses = computed(() => ({
  today: isToday,
}));

const getLessonsLengthText = () => {
  return `${lessons.length} ${plural(lessons.length, "урок", "урока", "уроков")}`;
};

const dateText = computed(() => {
  const day = date.getDate();
  const lastDay = lastDayOfMonth(date).getDate();

  if (day === 1 || day === lastDay) {
    return format(date, "d MMM", { locale: ru }).replace(".", "");;
  }

  return format(date, "d");
});

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
