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
    <Transition name="fade">
      <div
        class="confirm-overlay"
        v-if="confirmLogId"
        @click.stop="confirmLogId = null"
      />
    </Transition>
    <Transition name="confirm">
      <div v-if="confirmLogId" class="confirm-wrapper">
        <custom-logs-modal-confirm
          @close="confirmLogId = null"
          @revert="onRevert"
        />
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import { getLogs } from "~/api/logs/getLogs";
import { rollbackLog } from "~/api/logs/rollbackLog";
import { ChangeType, LogStatus } from "~~/prisma/generated/prisma/db1/client";

type DisplayField = { title: string; text: string };
type ChangeField = {
  title: string;
  oldValue: string | null;
  newValue: string | null;
};

type Log = {
  id: number;
  status: LogStatus;
  changeType: ChangeType;
  employee: { firstName: string; lastName: string } | null;
  display: DisplayField[];
  changes: ChangeField[];
  createdAt: string;
};

type Response = {
  success: boolean;
  message?: string | null;
};

const props = defineProps<{ type: ChangeType }>();

const emit = defineEmits<{ (e: "close"): void }>();

const confirmLogId = ref<number | null>(null);

const isLoading = ref(true);
const logs = ref<Log[]>([]);

const extendedStyle = computed(() => ({
  extended: logs.value.length > 10,
}));

const { choosenCategories } = useLogsFilters();

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
  LOG_ROLLBACK: "Откат логов",
};

function openConfirm(logId: number) {
  confirmLogId.value = logId;
}

async function onRevert() {
  if (confirmLogId.value === null) return;
  const response = (await rollbackLog(confirmLogId.value)) as Response;

  if (!response.success) {
    confirmLogId.value = null;

    showCustomToast("danger", "Произошла ошибка", "попробуйте позже");
    //Добавить вторую ошибку
    return;
  }

  const log = logs.value.find((l) => l.id === confirmLogId.value);
  if (log) log.status = "REVERTED";

  confirmLogId.value = null;
  showCustomToast("success", "Действие было успешно отмененно", "");
}

async function fetchLogs() {
  isLoading.value = true;
  const categories: ChangeType[] = !choosenCategories.value.length
    ? [
        "ASSIGNED_TO_GROUP",
        "DATE_CHANGE",
        "INSTRUCTOR_CHANGE",
        "LESSON_CANCELLATION",
        "LESSON_CREATE",
        "VENUE_CHANGE",
      ]
    : choosenCategories.value;

  logs.value = await getLogs(props.type, categories);
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
}

watch(
  choosenCategories,
  async (newVal) => {
    console.log("choosenCategories changed:", newVal);
    await fetchLogs();
  },
  { deep: true },
);

onMounted(async () => {
  await fetchLogs();
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

provide("openConfirm", openConfirm);
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
  will-change: transform;
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

.confirm-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.25);
  z-index: 2;
  border-radius: 25px;
  overflow: hidden;
}

.confirm-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  pointer-events: none;
}

.confirm-enter-active,
.confirm-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
  transform: scale(0.85);
}

.confirm-enter-to,
.confirm-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
