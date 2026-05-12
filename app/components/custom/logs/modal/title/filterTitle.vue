<template>
  <div class="filter-title-wrapper" :class="isOpen" @click="onClick()">
    <div class="filter-title">
      <component :is="getIcon()" class="filter-icon" />
      <p class="filter-title-text main-text-sm">{{ getText() }}</p>
      <component :is="arrowIcon" class="arrow" :class="isOpen" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import filterIcon from "~/assets/icons/list_filter.svg";
import calendarIcon from "~/assets/icons/calendar.svg";
import arrowIcon from "~/assets/icons/chevron_down.svg";

const props = defineProps<{ type: "date" | "category" }>();

const { categoryFilterOpen, dateFilterOpen } = useLogsFilters();

const isOpen = computed(() => ({
  open: props.type === "date" ? dateFilterOpen.value : categoryFilterOpen.value,
}));

function getIcon() {
  return props.type == "date" ? calendarIcon : filterIcon;
}

function getText() {
  return props.type == "date" ? "Дата" : "Категория";
}

function onClick() {
  if (props.type === "date") {
    dateFilterOpen.value = !dateFilterOpen.value;
    categoryFilterOpen.value = false;
  } else {
    categoryFilterOpen.value = !categoryFilterOpen.value;
    dateFilterOpen.value = false;
  }
}
</script>

<style scoped>
.filter-title-wrapper {
  background-color: #e9f3ff;
  border-radius: 10px;
  margin-right: 10px;
  cursor: pointer;
  border: 1px solid transparent;
}

.filter-title-wrapper.open {
  border: 1px solid #4f75ff;
}

.filter-title-wrapper:hover .filter-title-text {
  color: #4f75ff;
}

.filter-title-wrapper:hover .filter-icon {
  stroke: #4f75ff;
}

.filter-title-wrapper:hover .arrow :deep(path) {
  stroke: #4f75ff;
}

.filter-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 2px 5px;
  pointer-events: none;
}

.filter-title-text {
  color: #6b7280;
}

.filter-icon {
  stroke: #6b7280;
  scale: 0.8;
}

.arrow {
  scale: 0.8;
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.arrow :deep(path) {
  stroke: #6b7280;
}

p {
  margin: 0;
}
</style>
