<template>
  <div class="side-bar">
    <div
      class="category"
      :class="{ 'selected-category': selectedCategory == 'risks' }"
      @click="selectCategory('risks')"
    >
      <img src="../../assets/icons/chart.png" alt="" />
      <p class="header-sm">Рекомендации и риски</p>
    </div>
    <div
      class="category"
      :class="{ 'selected-category': selectedCategory == 'schedule' }"
      @click="selectCategory('schedule')"
    >
      <img
        class="toggle"
        :class="toggles['schedule'] ? 'on' : 'off'"
        :src="getIcon('schedule', 0)"
        @click.stop="toggleIcon('schedule')"
        alt=""
      />
      <p class="header-sm">Управление расписанием</p>
    </div>
    <div
      class="category"
      :class="{ 'selected-category': selectedCategory == 'clients' }"
      @click="selectCategory('clients')"
    >
      <img
        class="toggle"
        :class="toggles['clients'] ? 'on' : 'off'"
        :src="getIcon('clients', 0)"
        @click.stop="toggleIcon('clients')"
        alt=""
      />
      <p class="header-sm">Сопровождение клиентов</p>
    </div>
    <div
      class="category"
      :class="{ 'selected-category': selectedCategory == 'staff' }"
      @click="selectCategory('staff')"
    >
      <img
        class="toggle"
        :class="toggles['staff'] ? 'on' : 'off'"
        :src="getIcon('staff', 0)"
        @click.stop="toggleIcon('staff')"
        alt=""
      />
      <p class="header-sm">Координация персонала</p>
    </div>
    <div
      class="category"
      :class="{ 'selected-category': selectedCategory == 'settings' }"
      @click="selectCategory('settings')"
    >
      <img src="../../assets/icons/bolt.png" alt="" />
      <p class="header-sm">Настройки</p>
    </div>
  </div>
</template>

<script setup>
import toggleLeft from "../../assets/icons/toggle_left.svg";
import toggleRight from "../../assets/icons/toggle_right.svg";
import toggleOff from "../../assets/icons/toggle_off.svg";
import toggleOn from "../../assets/icons/toggle_on.svg";

const route = useRoute();

const selectedCategory = computed(() => {
  const path = route.path.split("/")[1] || "risks";
  return path;
});

const toggles = ref({ schedule: 1, clients: 0, staff: 0 });

const categories = {
  risks: "Рекомендации и риски",
  schedule: "Управление расписанием",
  clients: "Сопровождение клиентов",
  staff: "Координация персонала",
  settings: "Настройки",
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  navigateTo(`/${category}`);
};

const toggleIcon = (number) => {
  toggles.value[number] = !toggles.value[number];
};

const getIcon = (number, block) => {
  if (block == 0) {
    if (toggles.value[number]) {
      return toggleRight;
    }
    return toggleLeft;
  } else {
    if (toggles.value[number]) {
      return toggleOn;
    }
    return toggleOff;
  }
};
</script>

<style scoped>
.side-bar {
  display: flex;
  flex-direction: column;
  width: 264px;
  margin-right: 16px;
  margin-left: 5px;
  top: 10px;
  z-index: 1;
  position: sticky;
  height: 100%;
}

.category {
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  height: 44px;
  z-index: 1;
  width: 264px;
}

.selected-category {
  background-color: white;
}

.category img {
  margin: auto;
  margin-left: 5px;
  margin-right: 10px;
  height: 24px;
  width: 24px;
  z-index: 2;
}

.category p {
  margin: auto;
  margin-right: 0;
  margin-left: 0;
  pointer-events: none;
}
</style>
