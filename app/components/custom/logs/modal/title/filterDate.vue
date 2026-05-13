<template>
  <div class="filter" ref="filterRef">
    <p class="filter-title header-sm">Фильтр по дате</p>
    <custom-logs-modal-title-date-fileds />
    <div class="separator separator-up"></div>
    <custom-logs-modal-title-calendar class="dates" />
    <div class="separator-button">
      <div class="separator"></div>
      <div class="btns">
        <div class="filters-btn" @click="deleteFilters">
          <p class="btn-title header-sm">Сбросить все</p>
        </div>
        <div
          class="filters-btn apply-btn"
          :class="canApply"
          @click="applyHandler"
        >
          <p class="btn-title header-sm">Применить</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onClickOutside } from "@vueuse/core";

const {
  selectedStart,
  selectedEnd,
  dateFilterOpen,
  startDate,
  endDate,
  hasError,
} = useLogsFilters();

const filterRef = useTemplateRef("filterRef");

const canApply = computed(() => {
  const hasStart =
    selectedStart.value !== null && !isNaN(selectedStart.value.getTime());

  const sameValue =
    startDate.value?.getTime() === selectedStart.value?.getTime() &&
    endDate.value?.getTime() === selectedEnd.value?.getTime();

  console.log(selectedStart.value);

  return { disabled: !hasStart || sameValue || hasError.value };
});

onClickOutside(
  filterRef,
  () => {
    dateFilterOpen.value = false;
  },
  {
    ignore: [
      ".filter-title",
      ".separator-button",
      ".dates",
      ".filter-title-date",
    ],
  },
);

function deleteFilters() {
  startDate.value = null;
  endDate.value = null;
  selectedStart.value = null;
  selectedEnd.value = null;
}

function applyHandler() {
  if (!canApply.value.disabled === false) return;
  startDate.value = selectedStart.value;
  endDate.value = selectedEnd.value;
}
</script>

<style scoped>
.filter {
  position: absolute;
  left: 28px;
  top: 90px;
  display: flex;
  flex-direction: column;
  z-index: 1;
  width: 280px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
}

.dates {
  display: flex;
  flex-direction: column;
  align-self: center;
}

.separator-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.separator {
  display: flex;
  width: 90%;
  height: 0.5px;
  background-color: #cfd3da;
  align-self: center;
  margin-top: 6px;
}

.btns {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.filters-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 0;
  border-radius: 6px;
  cursor: pointer;
  height: 30px;
}

.btn-title {
  font-size: 13px;
  color: #4983e7;
}

.filters-btn:hover .btn-title {
  color: #2067df;
}

.filters-btn:active {
  transform: scale(0.97);
  transition: transform 0.1s ease;
}

.apply-btn {
  padding-left: 50px;
}

.apply-btn.disabled {
  pointer-events: none;
}

.apply-btn.disabled .btn-title {
  color: #9da4b1 !important ;
}

.separator.separator-up {
  margin-bottom: 10px;
}

.filter-title {
  padding-left: 20px;
  padding-top: 10px;
  font-size: 15px;
}

.dates-icon {
  display: flex;
  flex-direction: row;
}

.icon-wrapper {
  display: flex;
  align-items: end;
  padding-bottom: 10px;
  padding-left: 15px;
}

.check-icon {
  cursor: pointer;
}

.check-icon.disabled {
  pointer-events: none;
}

.check-icon :deep(path) {
  transition: stroke 0.2s ease;
}

.check-icon.disabled :deep(path) {
  stroke: #9da4b1c5;
}

p {
  margin: 0;
}
</style>
