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
          <ui-button
            class="btn header-sm"
            :class="{ active: mode }"
            @click.stop="mode = true"
            >Месяц</ui-button
          >
          <ui-button
            class="btn header-sm"
            :class="{ active: !mode }"
            @click.stop="mode = false"
            >Неделя</ui-button
          >
        </div>
      </div>
      <custom-schedule-planning-month-calendar v-if="mode" />
      <custom-schedule-planning-week-calendar v-else />
    </div>
  </div>
</template>
<script lang="ts" setup>
import arrow from "~/assets/icons/arrow_left.svg";

const today = new Date();

const { currentDate } = inject<ReturnType<typeof useSchedule>>("schedule")!;

const mode = ref(true);

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

.btn.active {
  background-color: #768298;
  color: white !important;
}
</style>
