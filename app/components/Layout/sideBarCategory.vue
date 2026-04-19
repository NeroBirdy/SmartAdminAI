<template>
  <div
    class="category"
    :class="activeClass"
    @click="selectCategory(category)"
  >
    <ui-side-bar-toggle
      v-if="['schedule', 'clients', 'staff'].includes(category)"
      :enabled="pictures[category] === toggleRight"
      class="icon"
    />
    <component
      v-else
      :is="pictures[category]"
      class="icon"
      :class="isSelectedClass(category)"
    />
    <p class="category-text header-sm" :class="isSelectedClass(category)">
      {{ categoriesText[category] }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import riskImg from "~/assets/icons/chart.svg";
import settingImg from "~/assets/icons/bolt.svg";
import toggleLeft from "~/assets/icons/toggle_left.svg";
import toggleRight from "~/assets/icons/toggle_right.svg";

const { selectCategory, isSelected, isPressed } = useCategoryNavigation();
const { categories } = useSideBarCategories();

const props = defineProps<{
  category: string;
}>();

const isSelectedClass = (category: string) => ({
  active: isSelected(category),
});

const activeClass = computed(() => ({
  "selected-category": isSelected(props.category),
  pressed: isPressed(props.category),
}));

const categoriesText: Record<string, string> = {
  risks: "Рекомендации и риски",
  schedule: "Управление расписанием",
  clients: "Сопровождение клиентов",
  staff: "Координация персонала",
  settings: "Настройки",
};

const pictures = computed<Record<string, string>>(() => ({
  risks: riskImg,
  schedule: categories.value?.[0]?.enable ? toggleRight : toggleLeft,
  clients: categories.value?.[1]?.enable ? toggleRight : toggleLeft,
  staff: categories.value?.[2]?.enable ? toggleRight : toggleLeft,
  settings: settingImg,
}));
</script>

<style scoped>
.category {
  display: flex;
  position: relative;
  flex-direction: row;
  border-radius: 10px;
  height: 44px;
  width: 264px;
  overflow: hidden;
  transition: transform 0.15s ease;
  z-index: 1;
}

.category::before {
  content: "";
  position: absolute;
  inset: 0;
  background-color: white;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  border-radius: 10px;
  z-index: 0;
}

.pressed {
  transform: scale(0.97);
}

.selected-category {
  background-color: white;
}

.selected-category::before {
  transform: translateX(0);
}

.icon {
  position: relative;
  margin: auto;
  margin-left: 5px;
  margin-right: 10px;
  height: 24px;
  width: 24px;
  z-index: 2;
}

.icon.active :deep(path) {
  stroke: #2c71e4;
}

.category-text {
  position: relative;
  z-index: 1;
  margin: auto;
  margin-right: 0;
  margin-left: 0;
  pointer-events: none;
  color: #717e97;
}

.category-text.active {
  color: #4b5669;
}
</style>
