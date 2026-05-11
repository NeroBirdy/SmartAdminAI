<template>
  <div class="log-title">
    <div class="left">
      <div class="ellips-title">
        <div class="ellips-wrapper">
          <div class="ellips" :style="ellipsStyle"></div>
        </div>
        <p class="employee header-sm">{{ getTitle() }}</p>
      </div>
      <div
        class="rollback-title-wrapper"
        v-if="log.changeType === 'LOG_ROLLBACK'"
      >
        <p class="rollback-title main-text-sm">{{ getCategory() }}</p>
      </div>
    </div>
    <div class="right">
      <p class="date main-text-sm">{{ getDate() }}</p>
      <component
        :is="arrow"
        class="arrow"
        :class="arrowStyle"
        @click.stop="emit('open')"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { format } from "date-fns";
import { ru } from "date-fns/locale";

import arrow from "~/assets/icons/chevron_down.svg";
import type { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

type Log = {
  id: number;
  changeType: ChangeType;
  originalType?: ChangeType | null;
  employee: { firstName: string; lastName: string } | null;
  createdAt: string;
};

const props = defineProps<{ log: Log; isOpen: boolean }>();

const emit = defineEmits<{ (e: "open"): void }>();

const arrowStyle = computed(() => ({
  open: props.isOpen,
}));

const ellipsStyle = computed(() => ({
  backgroundColor: getTypeColor(),
}));

const types: Record<ChangeType, Record<string, string>> = {
  ASSIGNED_TO_GROUP: { color: "#6366f1", title: "Распределение в группу" },
  DATE_CHANGE: { color: "#f59e0b", title: "Перенос даты" },
  INSTRUCTOR_CHANGE: { color: "#8b5cf6", title: "Замена инструктора" },
  LESSON_CANCELLATION: { color: "#ef4444", title: "Отмена занятия" },
  LESSON_CREATE: { color: "#10b981", title: "Создание занятия" },
  LOG_ROLLBACK: { color: "#94a3b8", title: "Откат логов" },
  QUESTION_ANSWER: { color: "#0ea5e9", title: "Вопрос / Ответ" },
  SCHEDULED_TRIAL_LESSON: { color: "#3b82f6", title: "Пробное занятие" },
  SELECTION_INSTRUCTOR_CHANGE: {
    color: "#ec4899",
    title: "Подбор инструктора",
  },
  VENUE_CHANGE: { color: "#f97316", title: "Смена площадки" },
};

function getTitle() {
  if (props.log.changeType === "LOG_ROLLBACK") {
    return "Администратор";
  }
  if (props.log.employee) {
    return props.log.employee.firstName + " " + props.log.employee.lastName;
  }
  return "ИИ Ассистент";
}

function getDate() {
  const date = format(props.log.createdAt, "dd MMM yyyy, HH:mm", {
    locale: ru,
  });
  return date;
}

function getTypeColor() {
  let type = props.log.originalType != null
    ? props.log.originalType
    : props.log.changeType;
  return type ? types[type]?.color : "#94a3b8";
}

function getCategory() {
  const type = props.log.originalType;

  return type ? types[type]?.title : "Неизвестно";
}
</script>

<style scoped>
.log-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 40px;
}

.right,
.left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ellips-wrapper {
  padding-left: 10px;
  padding-right: 15px;
}

.ellips {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #4983e7;
}

.arrow {
  transition: transform 0.3s ease;
  cursor: pointer;
  margin-right: 5px;
  margin-left: 5px;
}

.arrow.open {
  transform: rotate(180deg);
}

.arrow :deep(path) {
  stroke: #4983e7;
}

.ellips-title {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.rollback-title-wrapper {
  margin-left: 10px;
  background-color: #e4e7eb;
  border-radius: 10px;
}

.rollback-title {
  padding: 2px 7px;
  font-size: 12.5px;
}

p {
  margin: 0;
}
</style>
