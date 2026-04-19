import { ref } from "vue";

type Day = {
  isWorkingDay: boolean;
  startWork: Date | null;
  endWork: Date | null;
  breaks: { startTime: Date | null; endTime: Date | null }[];
};

export function useSettings() {
  const openIndex = ref<number | null>(null);
  const removeIds = ref<[number, number][]>([]);

  function toggleIndex(index: number) {
    if (openIndex.value == index) {
      openIndex.value = null;
    } else {
      openIndex.value = index;
    }
  }

  function markForRemoval(workScheduleId: number, breakId: number) {
    if (workScheduleId > 0 && breakId > 0) {
      removeIds.value.push([workScheduleId, breakId]);
    }
  }

  function clearRemovals() {
    removeIds.value = [];
  }

  function isOpen(index: number) {
    return openIndex.value === index;
  }

  function validateData(data: any[]) {
    if (!data) return;

    for (const day of data) {
      if (day.isWorkingDay && day.startWork && day.endWork) {
        const start = new Date(day.startWork).getTime();
        const end = new Date(day.endWork).getTime();

        if (start >= end) return false;
      }

      for (const b of day.breaks ?? []) {
        if (b.startTime && b.endTime) {
          const start = new Date(b.startTime).getTime();
          const end = new Date(b.endTime).getTime();

          if (start >= end) return false;
        }
      }
    }

    return true;
  }

  const isScheduleDefault = (data: any[]) => {
    return !data.some(
      (day) => day.isWorkingDay && day.startWork && day.endWork,
    );
  };

  return {
    openIndex,
    toggleIndex,
    removeIds,
    isOpen,
    validateData,
    isScheduleDefault,
    markForRemoval,
    clearRemovals,
  };
}
