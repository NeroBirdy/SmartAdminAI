<template>
  <div class="title">
    <div class="title-left">
      <ui-page-toggle
        v-if="currentCategory"
        :enabled="currentCategory?.enable"
        class="title-toggle"
        @click.stop="updateScheduleToggle"
      />
      <h1 class="header-lg title-text">Управление расписанием</h1>
    </div>
  </div>
  <PageSchedule />
</template>
<script lang="ts" setup>
import { getHorizonPlanning } from "~/api/schedule/getHorizonPlanning";

const CATEGORY_ID = 1;

const { categories, updateCategory } = useSideBarCategories();

type Category = {
  id: number;
  settingAIId: number;
  enable: boolean;
};

const availableToToggleOn = async () => {
  const response = await getHorizonPlanning();
  return response!.isHorizonPlanning;
};

const updateScheduleToggle = async () => {
  if (!currentCategory.value) return;

  if (!currentCategory.value.enable) {
    if (await availableToToggleOn()) {
      updateCategory(currentCategory.value.id, true);
    } else {
      showCustomToast("danger", "Выберите горизонт планирования", "");
    }
  } else {
    updateCategory(currentCategory.value.id, false);
  }
};

const currentCategory = computed<Category | undefined>(() =>
  categories.value?.find((c: Category) => c.settingAIId === CATEGORY_ID),
);
</script>

<style scoped></style>
