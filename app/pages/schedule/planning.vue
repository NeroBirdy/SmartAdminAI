<template>
  <div class="content">
    <div class="side-bar">
      <div class="filtration">
        <custom-schedule-planning-filtration-groups />
        <custom-schedule-planning-filtration-venues />
      </div>
    </div>
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
            <component class="arrow-left" :is="arrow" @click="previousPeriod" />
            <h1 class="header-sm">{{ monthYear }}</h1>
            <component class="arrow-right" :is="arrow" @click="nextPeriod" />
          </div>
          <div class="mode-buttons">
            <ui-button
              class="btn header-sm"
              :class="activeClass('month')"
              @click.stop="toggleType('month')"
              >Месяц</ui-button
            >
            <ui-button
              class="btn header-sm"
              :class="activeClass('week')"
              @click.stop="toggleType('week')"
              >Неделя</ui-button
            >
          </div>
        </div>
        <custom-schedule-planning-calendar :type="type" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import arrow from "~/assets/icons/arrow_left.svg";
import {
  startOfWeek,
  endOfWeek,
  format,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  isWithinInterval,
  isSameMonth,
} from "date-fns";
import { ru } from "date-fns/locale";

const today = new Date();

const schedule = useSchedule();
provide("schedule", schedule);

const { expandedDate, currentDate } =
  schedule;

const type = ref("month");

const activeClass = (newType: string) => ({
  active: type.value === newType,
});

const toggleType = (changeType: string) => {
  type.value = changeType;
  currentDate.value = today;
  expandedDate.value = null;
};

const currentDateButtonHandler = () => {
  if (currentDate.value != today) {
    currentDate.value = today;
  }
};

const currentDateCheck = () => {
  if (type.value === "week") {
    const monday = startOfWeek(currentDate.value, { weekStartsOn: 1 });
    const sunday = endOfWeek(currentDate.value, { weekStartsOn: 1 });
    return !isWithinInterval(today, { start: monday, end: sunday });
  }

  return !isSameMonth(currentDate.value, today);
};

const monthYear = computed(() => {
  if (type.value === "week") {
    const monday = startOfWeek(currentDate.value, { weekStartsOn: 1 });
    const sunday = endOfWeek(currentDate.value, { weekStartsOn: 1 });

    const fmt = (d: Date) =>
      format(d, "d MMM", { locale: ru }).replace(".", "");
    return `${fmt(monday)} – ${fmt(sunday)}`;
  }

  const str = format(currentDate.value, "LLLL yyyy", { locale: ru });
  return str.charAt(0).toUpperCase() + str.slice(1);
});

const nextPeriod = () => {
  currentDate.value =
    type.value === "week"
      ? addWeeks(currentDate.value, 1)
      : addMonths(currentDate.value, 1);
};

const previousPeriod = () => {
  currentDate.value =
    type.value === "week"
      ? subWeeks(currentDate.value, 1)
      : subMonths(currentDate.value, 1);
};

definePageMeta({
  layout: "planning",
});
</script>
<style scoped>
.side-bar {
  display: flex;
  flex-direction: column;
  width: 230px;
  max-width: 230px;
  margin-right: 24px;
  margin-left: 20px;
  top: 10px;
  z-index: 1;
  position: sticky;
  height: 100%;
}

.frame {
  width: 100%;
}

.inside-frame {
  padding: 18px 20px;
}

.navigation {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 15px;
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
  padding-left: 10px;
}

.arrow-right {
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

.btn.active {
  background-color: #768298;
  color: white !important;
}
</style>
