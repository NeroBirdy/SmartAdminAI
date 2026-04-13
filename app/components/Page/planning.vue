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
          <component class="arrow-left" :is="arrow" @click="previousPeriod" />
          <h1 class="header-sm">{{ monthYear }}</h1>
          <component class="arrow-right" :is="arrow" @click="nextPeriod" />
        </div>
        <div class="mode-buttons">
          <ui-button
            class="btn header-sm"
            :class="{ active: type == 'month' }"
            @click.stop="toggleType('month')"
            >Месяц</ui-button
          >
          <ui-button
            class="btn header-sm"
            :class="{ active: type == 'week' }"
            @click.stop="toggleType('week')"
            >Неделя</ui-button
          >
        </div>
      </div>
      <custom-schedule-planning-calendar :type="type" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import arrow from "~/assets/icons/arrow_left.svg";

const today = new Date();

const { expandedDate, currentDate } = inject<ReturnType<typeof useSchedule>>("schedule")!;

const type = ref("month");

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
    const date = new Date(currentDate.value);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    return !(today >= monday && today <= sunday);
  }

  return !(
    currentDate.value.getFullYear() === today.getFullYear() &&
    currentDate.value.getMonth() === today.getMonth()
  );
};

const monthYear = computed(() => {
  if (type.value === "week") {
    const date = new Date(currentDate.value);
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const fmt = (d: Date) =>
      d.toLocaleString("ru-RU", { day: "numeric", month: "long" });
    return `${fmt(monday)} – ${fmt(sunday)}`;
  }

  const str = currentDate.value.toLocaleString("ru-RU", {
    month: "long",
    year: "numeric",
  });
  return str.charAt(0).toUpperCase() + str.slice(1);
});

const nextPeriod = () => {
  const date = new Date(currentDate.value);

  if (type.value === "week") {
    date.setDate(date.getDate() + 7);
    currentDate.value = date;
    return;
  }

  const month = date.getMonth();
  if (month === 11) {
    currentDate.value = new Date(date.getFullYear() + 1, 0, 1);
  } else {
    currentDate.value = new Date(date.getFullYear(), month + 1, 1);
  }
};

const previousPeriod = () => {
  const date = new Date(currentDate.value);

  if (type.value === "week") {
    date.setDate(date.getDate() - 7);
    currentDate.value = date;
    return;
  }

  const month = date.getMonth();
  if (month === 0) {
    currentDate.value = new Date(date.getFullYear() - 1, 11, 1);
  } else {
    currentDate.value = new Date(date.getFullYear(), month - 1, 1);
  }
};
</script>
<style scoped>
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
