<template>
  <div class="frame second-frame-setting">
    <div class="second-frame-title">
      <div class="title-texts">
        <div class="header-icon">
          <h1 class="header-sm">Координация персонала</h1>
        </div>
        <p class="description main-text-sm">
          Список сотрудников и их статус в чат-боте
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
        <template v-for="instructor in list">
          <div class="row" v-if="instructor">
            <p class="second-text">
              {{ instructor.firstName }} {{ instructor.lastName }}
            </p>
            <component
              v-if="instructor.loginned"
              :is="checkIcon"
              class="grey"
            />
            <component v-else :is="alertIcon" />
          </div>
          <div class="empty" v-else></div>
        </template>
      </div>
      <ui-help
        class="help"
        title="Как это работает?"
        text="Сотрудники с красным маркером не авторизованы в ВК-боте, направьте им ссылку ниже и попросите получить доступ по ключу из личного кабинета."
        link="https://vk.com/club237041357\z"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import arrow from "~/assets/icons/chevron_down.svg";
import alertIcon from "~/assets/icons/circle-alert.svg";
import checkIcon from "~/assets/icons/circle_check.svg";
import { getInstructorList } from "~/api/staff/getInstructorList";

type InstructorList = {
  loginned: boolean;
  firstName: string;
  lastName: string;
};

const arrowStyle = computed(() => ({
  open: openList.value,
}));

const contentStyle = computed(() => ({
  hidden: !openList.value,
}));

const openList = ref(false);

const list = ref<InstructorList[]>([]);

onMounted(async () => {
  const result = await getInstructorList();
  list.value = result.list;
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

.grey :deep(path) {
  stroke: #9da4b1;
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
</style>
