<template>
  <div class="calendar-month-day-wrapper" ref="wrapperRef">
    <div
      class="calendar-month-day"
      :class="{
        currentMonth: !props.isCurrentMonth,
        expanded: isExpanded,
        upward: openUpward && isExpanded,
        today: props.isToday,
      }"
      @click.stop="toggle"
    >
      <div class="inside-calendar-month-day">
        <div class="header" :class="{ expanded: isExpanded }">
          <h1
            class="main-text-md"
            :class="{ currentMonth: !props.isCurrentMonth }"
          >
            {{ getDateText() }}
          </h1>
          <p class="main-text-sm" v-if="events.length">
            {{ events.length }}
            {{ plural(events.length, "урок", "урока", "уроков") }}
          </p>
        </div>
        <div class="events" :class="{ expanded: isExpanded }" ref="eventsRef">
          <template v-for="event in events"
            ><CustomSchedulePlanningMonthLesson
              :lesson="event"
              :isExpanded="isExpanded"
          /></template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import plural from "plural-ru";

const { expandedDate, getEventsForDay } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const props = defineProps<{
  date: Date;
  isToday: boolean;
  isCurrentMonth: boolean;
}>();

const isExpanded = computed(
  () => expandedDate.value?.getTime() === props.date.getTime(),
);

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

const toggle = () => {
  if (!isExpanded.value && wrapperRef.value) {
    const rect = wrapperRef.value.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    openUpward.value = spaceBelow < 324;
  }
  expandedDate.value = isExpanded.value ? null : props.date;
};

const eventsRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null);
const openUpward = ref(false);

const events = computed(() => getEventsForDay(props.date));
watch(events, (newVal) => console.log(newVal));

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
