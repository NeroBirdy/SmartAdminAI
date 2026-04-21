<template>
  <div class="frame second-frame-setting">
    <div class="second-frame-title">
      <div class="title-texts">
        <div class="header-icon">
          <h1 class="header-sm">График занятости площадок</h1>
        </div>
        <p class="description main-text-sm">
          Позволит учесть доступность площадок для управления расписанием
        </p>
      </div>
      <component
        :is="arrow"
        class="arrow"
        :class="arrowStyle"
        @click="openList = !openList"
      />
    </div>
    <div class="content" :class="contentStyle">
      <div class="list">
        <template v-for="venue in venuesList">
          <div class="row" v-if="venue">
            <p class="second-text">
              {{ venue.name }}
            </p>
            <CustomSettingsIcon
              :scheduleExist="venue.scheduleExist"
              @click="modalHandler(venue)"
            />
          </div>
          <div class="empty" v-else></div>
        </template>
      </div>
      <ui-help
        class="help"
        title="Как это работает?"
        text="Вы можете задать индивидуальные графики для сотрудников, которы будут учитываться при создание расписания. "
      />
    </div>
    <CustomSettingsModalWithOverlay
      :isModalOpen="isModalOpen"
      type="venue"
      :openId="openId"
      :venue="venue"
      @close="
        (id: number, type: 'save' | 'delete' | 'null', success: boolean) =>
          closeHandler(id, type, success)
      "
    />
  </div>
</template>

<script lang="ts" setup>
import arrow from "~/assets/icons/chevron_down.svg";

import { getVenues } from "~/api/settings/getVenues";

type Venue = {
  id: number;
  name: string;
  scheduleExist: boolean;
};

const modalHandler = (ven: Venue) => {
  openId.value = ven.id;
  isModalOpen.value = true;
  venue.value = ven;
};

const arrowStyle = computed(() => ({
  open: openList.value,
}));

const contentStyle = computed(() => ({
  hidden: !openList.value,
}));

const isModalOpen = ref(false);
const openList = ref(false);
const openId = ref(-1);
const venue = ref();

const closeHandler = (
  id: number,
  type: "save" | "delete" | "null",
  success: boolean,
) => {
  if (success) {
    if (type === "save") {
      const venue = venues.value.find((v: Venue) => v.id === id);
      if (venue) venue.scheduleExist = true;
    }
    if (type === "delete") {
      const venue = venues.value.find((v: Venue) => v.id === id);
      if (venue) venue.scheduleExist = false;
    }
  }
  isModalOpen.value = false;
};

const venues = ref<Venue[]>(await getVenues(1));

const venuesList = computed(() => {
  const list: (Venue | null)[] = [...venues.value];
  const remainder = list.length % 4;
  if (remainder !== 0) {
    const needed = 4 - remainder;
    for (let i = 0; i < needed; i++) {
      list.push(null);
    }
  }
  return list;
});
</script>

<style scoped>
.frame {
  margin-top: 20px;
}

.second-frame-setting {
  margin-top: 12px !important;
  min-height: 78px;
  margin-right: 30px;
}

.second-frame-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-right: 24px;
  margin-left: 32px;
}

.header-icon {
  display: flex;
  flex-direction: row;
}

.list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, auto);
  margin: auto;
}

@media (max-width: 1440px) {
  .list {
    grid-template-columns: repeat(3, auto);
  }
}

.row {
  margin-left: 50px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 210px;
}

.second-text {
  color: #8590a5;
  margin: 0;
}

.title-texts {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}

.title-texts p {
  margin: 0;
}

.title-texts h1 {
  margin: 0;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
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

.arrow {
  transition: transform 0.3s ease;
  cursor: pointer;
}
.arrow.open {
  transform: rotate(180deg);
}

.content {
  display: flex;
  flex-direction: column;
  transition:
    max-height 0.6s ease,
    opacity 0.6s ease;
  overflow: hidden;
  max-height: 500px;
  opacity: 1;
}

.help {
  height: 78px;
  margin-top: 0;
  margin-left: 32px;
  margin-right: 24px;
}

.empty {
  width: 210px;
  margin-left: 50px;
  margin-bottom: 24px;
}

.content.hidden {
  max-height: 0;
  opacity: 0;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
