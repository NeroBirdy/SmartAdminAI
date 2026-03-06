<template>
  <NuxtPage />
  <!-- <div class="main">

    <div class="content">
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
  </div> -->
</template>
