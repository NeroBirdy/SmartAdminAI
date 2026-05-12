<template>
  <div class="filter">
    <p class="filter-title header-sm">Фильтр по категориям</p>
    <div class="categories">
      <template v-for="(category, type) in categories" :key="type">
        <custom-logs-modal-title-category :type="type" :category="category!" />
      </template>
    </div>
    <div class="separator-button">
      <div class="separator"></div>
      <div class="delete-filters-btn" @click="deleteFilters">
        <p class="btn-title header-sm">Сбросить все</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

type CategoryConfig = {
  color: string;
  title: string;
};

const categories: Partial<Record<ChangeType, CategoryConfig>> = {
  ASSIGNED_TO_GROUP: { color: "#6366f1", title: "Распределение в группу" },
  DATE_CHANGE: { color: "#f59e0b", title: "Перенос даты" },
  INSTRUCTOR_CHANGE: { color: "#8b5cf6", title: "Замена инструктора" },
  LESSON_CANCELLATION: { color: "#ef4444", title: "Отмена занятия" },
  LESSON_CREATE: { color: "#10b981", title: "Создание занятия" },
  VENUE_CHANGE: { color: "#f97316", title: "Смена площадки" },
};

const { choosenCategories } = useLogsFilters();

function deleteFilters() {
  choosenCategories.value = [];
}
</script>

<style scoped>
.filter {
  position: absolute;
  top: 80px;
  display: flex;
  flex-direction: column;
  z-index: 1;
  width: 250px;
  border-radius: 16px;
  background-color: white;
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
}

.categories {
  display: flex;
  flex-direction: column;
  padding-left: 20px;
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

.delete-filters-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 0;
  border-radius: 6px;
  cursor: pointer;
  height: 30px;
}

.filter-title {
  padding-left: 20px;
  padding-top: 10px;
  font-size: 15px;
}

.btn-title {
  font-size: 13px;
  color: #4983e7;
}

.delete-filters-btn:hover .btn-title {
  color: #2067df;
}

.delete-filters-btn:active {
  transform: scale(0.97);
  transition: transform 0.1s ease;
}

p {
  margin: 0;
}
</style>
