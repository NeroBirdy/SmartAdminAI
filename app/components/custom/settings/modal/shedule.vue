<template>
  <div class="frame setting">
    <div class="inside-frame" :class="firstLoadingStyle">
      <Transition name="fade" mode="out-in">
        <div class="loader-wrapper" v-if="isLoading" key="loader">
          <ui-loader />
        </div>
        <div class="full-content" v-else key="content">
          <div class="content">
            <CustomSettingsModalTitle
              :title="getTitle()"
              @close="emit('close', props.id, 'null', false)"
            />
            <div class="days">
              <template v-for="(day, index) in orgSchedule">
                <custom-settings-modal-schedule-week-day
                  v-model="orgSchedule![index]"
                  :index="Number(index)"
                />
              </template>
            </div>
          </div>
          <CustomSettingsModalFooterBtns
            :initDataDefault="initDataDefault"
            @delete="toggleConfirmDelete"
            @save="saveSchedule"
          />
        </div>
      </Transition>
    </div>
    <Transition name="fade">
      <div
        class="confirm-overlay"
        v-if="confirmDeleteOpen"
        @click.stop="toggleConfirmDelete"
      />
    </Transition>
    <Transition name="confirm">
      <div v-if="confirmDeleteOpen" class="confirm-wrapper">
        <CustomSettingsModalConfirmDelete
          @close="toggleConfirmDelete"
          @delete="deleteSchedule"
        />
      </div>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import { getScheduleForSettings } from "~/api/settings/getScheduleForSettings";
import { updateSchedule } from "~/api/settings/updateSchedule";
import { deleteScheduleSettings } from "~/api/settings/deleteSchedule";

type Day = {
  id: number;
  dayOfWeek: string;
  isWorkingDay: boolean;
  startWork: Date | null;
  endWork: Date | null;
  breaks: { id: number; startTime: Date; endTime: Date }[];
};

const props = defineProps<{
  id: number;
  type: "employee" | "venue" | "organisation";
  employee?: { firstName: string; lastName: string };
  venue?: { name: string };
}>();

const emit = defineEmits<{
  (
    e: "close",
    id: number,
    type: "save" | "delete" | "null",
    success: boolean,
  ): void;
}>();

const confirmDeleteOpen = ref(false);

const orgSchedule = ref();
const isFirstLoading = ref(true);
const isLoading = ref(true);
const initDataDefault = ref(true);

const firstLoadingStyle = computed(() => ({ loading: isFirstLoading.value }));

onMounted(async () => {
  try {
    const [data] = await Promise.all([
      getScheduleForSettings(props.type, props.id),
      new Promise((resolve) => setTimeout(resolve, 400)),
    ]);
    orgSchedule.value = data;
    isFirstLoading.value = false;
    isLoading.value = false;
    initDataDefault.value = settings.isScheduleDefault(orgSchedule.value);
  } catch (e) {
    emit("close", props.id, "null", false);
    console.error(e);
  }
});

const settings = useSettings();

provide("scheduleSettings", settings);

const getTitle = () => {
  if (props.type === "organisation") {
    return "График работы организации";
  } else if (props.type === "employee") {
    return `График занятости: ${props.employee?.lastName} ${props.employee?.firstName[0]}.`;
  } else {
    return `График занятости: ${props.venue?.name}.`;
  }
};

function toggleConfirmDelete() {
  confirmDeleteOpen.value = !confirmDeleteOpen.value;
}

async function closeOpenIndex() {
  if (settings.openIndex.value != null) {
    settings.openIndex.value = null;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

function validateSchedule() {
  if (settings.isScheduleDefault(orgSchedule.value)) {
    showCustomToast("warning", "Заполните хотя бы один день", "");
    return false;
  }
  if (!settings.validateData(orgSchedule.value)) {
    showCustomToast("warning", "Некорректное заполнение времени", "");
    return false;
  }
  return true;
}

async function withLoading(
  fn: () => Promise<{ success: boolean }>,
  successMsg: string,
  errorMsg: string,
  type: "save" | "delete",
) {
  isLoading.value = true;
  const [response] = await Promise.all([
    fn(),
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
  if (response.success) {
    showCustomToast("success", successMsg, "");
    emit("close", props.id, type, true);
  }
  if (!response.success) {
    isLoading.value = false;
    showCustomToast("danger", errorMsg, "попробуйте позже");
  }
}

const saveSchedule = async () => {
  if (!validateSchedule()) return;
  await closeOpenIndex();
  await withLoading(
    () =>
      updateSchedule(
        settings.removeIds.value,
        orgSchedule.value,
        props.type,
        props.id,
      ),
    "Расписание успешно сохранено",
    "Ошибка сохранения расписания",
    "save",
  );
};

const deleteSchedule = async () => {
  const idsToDelete = orgSchedule.value.map((day: Day) => day.id);

  await closeOpenIndex();
  await withLoading(
    () => deleteScheduleSettings(idsToDelete),
    "Расписание успешно удалено",
    "Ошибка удаления расписания",
    "delete",
  );
};
</script>

<style scoped>
.setting {
  position: fixed;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 475px;
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
  min-height: 670px;
  transition: min-height 0.3s ease;
}

.inside-frame.loading {
  min-height: 200px;
}

.full-content {
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
}

.main-text-sm {
  color: #6a758b;
}

.setting-description {
  display: flex;
  flex-direction: row;
  padding-left: 5px;
  align-items: center;
  margin-bottom: 10px;
}

.setting-description p {
  margin: 0;
}

.days {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
}

.confirm-wrapper {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  pointer-events: none;
  transform: translateZ(0);
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
