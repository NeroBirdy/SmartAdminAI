<template>
  <div class="main">
    <Header />
    <div class="content">
      <div class="side-bar">
        <div class="category" :class="{ 'selected-category': selectedCategory == 'risks' }"
          @click="selectCategory('risks')">
          <img src="./assets/icons/chart.png" alt="">
          <p class="header-sm">Рекомендации и риски</p>
        </div>
        <div class="category" :class="{ 'selected-category': selectedCategory == 'shredule' }"
          @click="selectCategory('shredule')">
          <img class="toggle" :class="toggles['shredule'] ? 'on' : 'off'" :src="getIcon('shredule', 0)"
            @click.stop="toggleIcon('shredule')" alt="">
          <p class="header-sm">Управление расписанием</p>
        </div>
        <div class="category" :class="{ 'selected-category': selectedCategory == 'clients' }"
          @click="selectCategory('clients')">
          <img class="toggle" :class="toggles['clients'] ? 'on' : 'off'" :src="getIcon('clients', 0)"
            @click.stop="toggleIcon('clients')" alt="">
          <p class="header-sm">Сопровождение клиентов</p>
        </div>
        <div class="category" :class="{ 'selected-category': selectedCategory == 'staff' }"
          @click="selectCategory('staff')">
          <img class="toggle" :class="toggles['staff'] ? 'on' : 'off'" :src="getIcon('staff', 0)"
            @click.stop="toggleIcon('staff')" alt="">
          <p class="header-sm">Координация персонала</p>
        </div>
        <div class="category" :class="{ 'selected-category': selectedCategory == 'settings' }"
          @click="selectCategory('settings')">
          <img src="./assets/icons/bolt.png" alt="">
          <p class="header-sm">Настройки</p>
        </div>
      </div>
      <div class="center">
        <div class="title">
          <div class="title-left">
            <img v-if="['shredule', 'clients', 'staff'].includes(selectedCategory)" class="title-toggle"
              :class="toggles[selectedCategory] ? 'on' : 'off'" :src="getIcon(selectedCategory, 1)"
              @click.stop="toggleIcon(selectedCategory)" alt="">
            <h1 class="header-lg title-text">{{ categories[selectedCategory] }}</h1>
          </div>
          <button v-if="selectedCategory == 'settings'" class="btn-submit header-md">Сохранить</button>
        </div>
        <Risks v-if="selectedCategory == 'risks'" />
        <Shredule v-if="selectedCategory == 'shredule'" />
        <Clients v-if="selectedCategory == 'clients'" />
        <Staff v-if="selectedCategory == 'staff'" />
        <Settings v-if="selectedCategory == 'settings'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import toggleLeft from './assets/icons/toggle_left.svg'
import toggleRight from './assets/icons/toggle_right.svg'
import toggleOff from './assets/icons/toggle_off.svg'
import toggleOn from './assets/icons/toggle_on.svg'

const selectedCategory = ref("risks");
const toggles = ref({ 'shredule': 1, 'clients': 0, 'staff': 0 });

const categories = {
  'risks': 'Рекомендации и риски',
  'shredule': 'Управление расписанием',
  'clients': 'Сопровождение клиентов',
  'staff': 'Координация персонала',
  'settings': 'Настройки'
};

const selectCategory = (category) => {
  selectedCategory.value = category;
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
  }
  else {
    if (toggles.value[number]) {
      return toggleOn;
    }
    return toggleOff;
  }
};

</script>
