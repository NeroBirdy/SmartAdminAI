<template>
  <div class="frame" :class="frameStyle">
    <div class="inside-frame">
      <div class="day-title">
        <div class="left">
          <ui-schedule-toggle
            :enabled="day.isWorkingDay"
            class="toggle"
            @click.stop="toggle"
          />
          <p class="day-of-week header-sm">{{ dayOfWeek(day.dayOfWeek) }}</p>
        </div>
        <div class="right">
          <CustomSettingsModalPeriod v-model="day" />
          <component
            :is="arrow"
            class="arrow"
            :class="arrowStyle"
            @click.stop="openDesc()"
          />
        </div>
      </div>
      <Transition name="slide-down">
        <CustomSettingsModalBreakList
          v-if="isOpen(index)"
          v-model="day.breaks"
          :dayId="day.id"
        />
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import arrow from "~/assets/icons/chevron_down.svg";

type Day = {
  id: number;
  dayOfWeek: string;
  isWorkingDay: boolean;
  startWork: Date | null;
  endWork: Date | null;
  breaks: { id: number; startTime: Date; endTime: Date }[];
};

const day = defineModel<Day>({ required: true });

const { index } = defineProps<{ index: number }>();

const lastStartWork = ref<Date | null>(day.value.startWork);
const lastEndWork = ref<Date | null>(day.value.endWork);

const { toggleIndex, isOpen } =
  inject<ReturnType<typeof useSettings>>("scheduleSettings")!;

const frameStyle = computed(() => ({
  "breaks-1": isOpen(index) && day.value.breaks?.length <= 2,
  "breaks-2":
    isOpen(index) &&
    day.value.breaks?.length > 2 &&
    day.value.breaks?.length <= 4,
  "breaks-3": isOpen(index) && day.value.breaks?.length > 4,
}));

const arrowStyle = computed(() => ({
  open: isOpen(index),
  disabled: !day.value.isWorkingDay,
}));

const days = <Record<string, string>>{
  MON: "понедельник",
  TUE: "вторник",
  WED: "среда",
  THU: "четверг",
  FRI: "пятница",
  SAT: "суббота",
  SUN: "воскресенье",
};

const dayOfWeek = (day: string) => {
  return days[day];
};

function toggle() {
  if (isOpen(index)) {
    toggleIndex(index);
  }
  if (day.value.startWork && day.value.endWork) {
    day.value.startWork = null;
    day.value.endWork = null;
  } else {
    if (lastStartWork.value && lastEndWork.value) {
      day.value.startWork = lastStartWork.value;
      day.value.endWork = lastEndWork.value;
    } else {
      const start = new Date();
      start.setUTCHours(8, 0, 0, 0);

      const end = new Date();
      end.setUTCHours(20, 0, 0, 0);

      day.value.startWork = start;
      day.value.endWork = end;

      lastStartWork.value = start;
      lastEndWork.value = end;
    }
  }

  day.value.isWorkingDay = !day.value.isWorkingDay;
}

function openDesc() {
  if (!day.value.isWorkingDay) return;
  toggleIndex(index);
}

watch(
  () => [day.value.startWork, day.value.endWork],
  ([start, end]) => {
    if (start) lastStartWork.value = start as Date;
    if (end) lastEndWork.value = end as Date;
  },
);
</script>

<style scoped>
.frame {
  width: 90%;
  height: 60px;
  margin-top: 15px;
  transition: height 0.2s ease;
}

.frame.breaks-1 {
  height: 190px;
}

.frame.breaks-2 {
  height: 220px;
}

.frame.breaks-3 {
  height: 250px;
}

.inside-frame {
  padding: 16px 16px;
  padding-top: 0;
}

.day-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 60px;
}

.left {
  display: flex;
  align-items: center;
  justify-content: center;
}

.right {
  display: flex;
  align-items: center;
  text-align: center;
}

.toggle {
  padding-top: 2px;
  padding-right: 8px;
  scale: 1.3;
  overflow: visible;
}

.arrow {
  padding-right: 8px;
  padding-left: 6px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.arrow :deep(path) {
  stroke: #6a758b !important;
  transition: stroke 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.arrow.disabled {
  pointer-events: none;
}

.arrow.disabled :deep(path) {
  stroke: #9095a0 !important;
}

.day-of-week {
  color: #324260;
  margin: 0;
}

.header-sm {
  color: #324260;
  padding: 0 5px;
  margin: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 200px;
}
</style>
