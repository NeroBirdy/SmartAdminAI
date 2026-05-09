<template>
  <div class="frame setting">
    <CustomLogsModalTitle :title="titles[type]" @close="emit('close')" />
    <div class="inside-frame" :class="extendedStyle">
      <Transition name="fade" mode="out-in">
        <div class="loader-wrapper" v-if="isLoading" key="loader">
          <ui-loader />
        </div>
        <div class="full-content" v-else key="content">
          <div class="content">
            <template v-for="(log, index) in logs">
              <custom-logs-modal-log :log="log" />
            </template>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getLogs } from "~/api/logs/getLogs";
import { ChangeType } from "~~/prisma/generated/prisma/db1/client";

type DisplayField = { title: string; text: string };
type ChangeField = {
  title: string;
  oldValue: string | null;
  newValue: string | null;
};

type Log = {
  id: number;
  changeType: ChangeType;
  employee: { firstName: string; lastName: string } | null;
  display: DisplayField[];
  changes: ChangeField[];
  createdAt: string;
};

const props = defineProps<{ type: ChangeType }>();

const emit = defineEmits<{ (e: "close"): void }>();

const isLoading = ref(true);
const logs = ref<Log[]>([]);

const extendedStyle = computed(() => ({
  extended: logs.value.length > 10,
}));

const titles: Record<ChangeType, string> = {
  DATE_CHANGE: "Перенос даты",
  VENUE_CHANGE: "Смена площадки",
  LESSON_CANCELLATION: "Отмена занятия",
  INSTRUCTOR_CHANGE: "Замена инструктора",
  LESSON_CREATE: "Создание занятия",
  QUESTION_ANSWER: "Вопрос / Ответ",
  ASSIGNED_TO_GROUP: "Распределение в группу",
  SCHEDULED_TRIAL_LESSON: "Пробное занятие",
  SELECTION_INSTRUCTOR_CHANGE: "Подбор инструктора",
};

onMounted(async () => {
  logs.value = await getLogs(props.type);
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
</script>

<style scoped>
.setting {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  margin: 0 !important;
  z-index: 2;
}

.loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}

.inside-frame {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: 678px;
  max-height: 780px;
  transition: min-height 0.3s ease;
  overflow-y: auto;
}

.inside-frame.extended {
  min-height: 780px;
}

.inside-frame::-webkit-scrollbar {
  display: none;
}

.full-content {
  padding-top: 10px;
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
