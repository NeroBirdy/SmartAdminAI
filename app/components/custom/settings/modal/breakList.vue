<template>
  <div class="breaks">
    <p class="breaks-title main-text-sm">Перерывы</p>
    <TransitionGroup name="break-item" tag="div" class="list">
      <CustomSettingsModalBreak
        v-for="(item, index) in breaks"
        :key="item.id"
        v-model="breaks![index]"
        @remove="removeBreak(index)"
      />
    </TransitionGroup>
    <ui-button class="add-btn" :class="disabledStyle"
      ><p class="header-sm" @click="addNewBreak()">добавить</p></ui-button
    >
  </div>
</template>
<script lang="ts" setup>
type Break = { id: number; startTime: Date | null; endTime: Date | null };

const breaks = defineModel<Break[]>({ required: true });

const { dayId } = defineProps<{ dayId: number }>();

const { markForRemoval } =
  inject<ReturnType<typeof useSettings>>("scheduleSettings")!;

const disabledStyle = computed(() => ({ disabled: breaks.value.length == 6 }));

const removeBreak = (index: number) => {
  if (breaks.value && breaks.value.length > 1) {
    const itemToRemove = breaks.value[index];

    markForRemoval(dayId, itemToRemove!.id);

    breaks.value.splice(index, 1);
  } else if (breaks.value && breaks.value.length == 1) {
    if (breaks.value[index]!.startTime || breaks.value[index]!.endTime) {
      markForRemoval(dayId, breaks.value[index]!.id);
      breaks.value.splice(index, 1);
      addNewBreak();
    }
  }
};

function addNewBreak() {
  if (breaks.value?.length == 6) return;
  const last = breaks.value?.at(-1);

  if (last && (last.startTime === null || last.endTime === null)) return;

  breaks.value?.push({
    id: -1,
    startTime: null,
    endTime: null,
  });
}

watch(
  breaks,
  (val) => {
    if (val && val.length === 0) {
      addNewBreak();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.breaks {
  display: flex;
  flex-direction: column;
}

.list {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-flow: row;
  gap: 10px;
}

.add-btn {
  margin-top: 25px;
  background-color: #6a758b !important;
  border-radius: 10px;
  min-height: 30px;
  min-width: 100%;
  align-self: center;
  transition: background-color 0.1s ease;
}

.add-btn:hover {
  background-color: #596274 !important;
}

.add-btn.disabled {
  background-color: #6a758b75 !important;
  pointer-events: none;
}

.header-sm {
  margin: 0;
}

.main-text-sm {
  color: #6a758b;
  padding-left: 19px;
  padding-bottom: 12px;
  margin: 0;
}

.break-item-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.break-item-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.break-item-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.break-item-leave-active {
  position: absolute;
  width: calc(50% - 5px);

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.break-item-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.break-item-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.break-item-move {
  transition: transform 0.3s ease;
  transition-delay: 0.1s;
}
</style>
