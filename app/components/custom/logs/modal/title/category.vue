<template>
  <div class="category">
    <div
      class="custom-check"
      :class="{ active: isChecked }"
      @click="toggleCategory"
    >
      <component :is="CheckIcon" v-if="isChecked" class="check-icon" />
    </div>
    <div class="ellips-wrapper">
      <div class="ellips" :style="ellipsStyle"></div>
    </div>
    <p class="category-title main-text-sm">{{ category.title }}</p>
  </div>
</template>

<script lang="ts" setup>
import CheckIcon from "~/assets/icons/check.svg";
import type { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

type CategoryConfig = {
  color: string;
  title: string;
};

const props = defineProps<{ category: CategoryConfig; type: ChangeType }>();

const ellipsStyle = computed(() => ({
  backgroundColor: props.category.color,
}));

const { choosenCategories } = useLogsFilters();

const isChecked = computed(() => choosenCategories.value.includes(props.type));

function toggleCategory() {
  if (isChecked.value) {
    choosenCategories.value = choosenCategories.value.filter(
      (c) => c !== props.type,
    );
  } else {
    choosenCategories.value = [...choosenCategories.value, props.type];
  }
}
</script>

<style scoped>
.category {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 10px;
}

.custom-check {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1.5px solid #cfd3da;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 11px;
  color: transparent;
  transition: all 0.15s ease;
  cursor: pointer;
}

.custom-check.active {
  background-color: #2067df;
  border-color: #2067df;
  color: white;
}

.check-icon {
  scale: 0.6;
}

.check-icon :deep(path) {
  stroke: white;
}

.ellips-wrapper {
  padding-left: 10px;
  padding-right: 5px;
}

.ellips {
  height: 7px;
  width: 7px;
  border-radius: 50%;
}

.category-title {
    font-size: 14px;
}

p {
  margin: 0;
}
</style>
