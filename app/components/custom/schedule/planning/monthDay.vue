<template>
  <div class="calendar-month-day-wrapper" ref="wrapperRef">
    <div class="calendar-month-day" :class="dayClasses" @click.stop="toggle">
      <div class="inside-calendar-month-day">
        <div class="header" :class="expandedClass">
          <h1 class="main-text-md" :class="currentMonthClass">
            {{ dateText }}
          </h1>
          <p class="main-text-sm" v-if="lessons.length">
            {{ getLessonsLengthText() }}
          </p>
        </div>
        <div class="events" :class="expandedClass" ref="eventsRef">
          <template v-for="event in lessons"
            ><CustomSchedulePlanningMonthLesson
              :lesson="event"
              :isCurrentMonth="isCurrentMonth"
              :isExpanded="isExpanded"
          /></template>
        </div>
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

const { expandedDate } = inject<ReturnType<typeof useSchedule>>("schedule")!;

const { date, isToday, isCurrentMonth, lessons } = defineProps<{
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
  lessons: Lesson[];
}>();

const dayClasses = computed(() => ({
  currentMonth: !isCurrentMonth,
  expanded: isExpanded.value,
  upward: openUpward.value && isExpanded.value,
  today: isToday,
}));

const currentMonthClass = computed(() => ({
  currentMonth: !isCurrentMonth,
}));

const expandedClass = computed(() => ({
  expanded: isExpanded.value,
}));

const getLessonsLengthText = () => {
  return `${lessons.length} ${plural(lessons.length, "урок", "урока", "уроков")}`;
};

const isExpanded = computed(
  () => expandedDate.value?.getTime() === date.getTime(),
);

const dateText = computed(() => {
  const day = date.getDate();
  const lastDay = lastDayOfMonth(date).getDate();

  if (day === 1 || day === lastDay) {
    return format(date, "d MMM", { locale: ru }).replace(".", "");
  }

  return format(date, "d");
});

const toggle = () => {
  if (!isExpanded.value && wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    openUpward.value = spaceBelow < 324;
  }
  expandedDate.value = isExpanded.value ? null : date;
};

const eventsRef = useTemplateRef("eventsRef");
const wrapperRef = useTemplateRef("wrapperRef");
const openUpward = ref(false);

watch(isExpanded, (val) => {
  if (!val) {
    eventsRef.value?.scrollTo({ top: 0, behavior: "instant" });
  }
});
</script>

<style scoped>
.calendar-month-day-wrapper {
  position: relative;
  min-height: 108px;
  margin-right: 2.5px;
  margin-left: 2.5px;
  margin-bottom: 5px;
}

.calendar-month-day {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  min-height: 108px;
  height: 108px;
  background-color: #dedfe2;
  border-radius: 7px;
  transition:
    min-height 0.3s ease,
    top 0.3s ease,
    bottom 0.3s ease,
    height 0.3s ease,
    left 0.3s ease,
    z-index 0.3s ease,
    box-shadow 0.3s ease;
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
  left: -50px;
}

.calendar-month-day.expanded.upward {
  top: calc(-324px + 108px);
  /* bottom: 0; */
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
