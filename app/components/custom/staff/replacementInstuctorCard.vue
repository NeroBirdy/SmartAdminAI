<template>
  <div class="frame second-frame-skills">
    <div class="second-frame-title">
      <div class="sparkle-wrapper">
        <component class="sparkle" :is="sparklesImg" />
      </div>
      <div class="right">
        <div class="title-texts">
          <h1 class="header-sm">Подбор замены инструктора</h1>
          <p class="description main-text-sm">
            Подобрать и заменить инструктора при необходимоти
          </p>
          <custom-staff-warning />
        </div>
        <component
          v-if="isWarning"
          class="card-arrow"
          :class="mirroredClass"
          :is="cardArrowImg"
          @click.stop="openCard = !openCard"
        />
      </div>
    </div>
    <div class="second-frame-content" v-if="isWarning" :class="hiddenClass">
      <custom-schedule-setting-card queryKey="staff_extra_setting" />
      <ui-help
        title="Как это работает?"
        text="Инструктор может отправить запрос на его замену другим сотрудником, а ИИ-агент подберет подходящие варианты и отправит все необходимые подтверждения."
      />
    </div>
  </div>
</template>

<script setup>
import { getInstructorList } from "~/api/staff/getInstructorList";
import cardArrowImg from "~/assets/icons/chevron_down.svg";
import sparklesImg from "~/assets/icons/sparkles.svg";

const openCard = ref(false);
const isWarning = ref(false);
const instrucorList = ref([]);

const mirroredClass = computed(() => ({
  mirrored: openCard.value,
}));

const hiddenClass = computed(() => ({
  hidden: !openCard.value,
}));

onMounted(async () => {
  const response = await getInstructorList();

  if (!response.allLoginned) {
    isWarning.value = true;
    instrucorList.value = response.list;
  }
});
</script>

<style scoped>
.frame {
  margin-top: 10px;
}

.inside-frame {
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  padding-left: 30px;
  margin-bottom: 10px;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
}

.main-text-sm {
  color: #6a758b;
}

.right {
  display: flex;
  justify-content: space-between;
  width: 97%;
}

.frame-header {
  margin: 0;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 24px;
}

.second-frame-skills {
  margin-top: 0 !important;
  min-height: 78px;
  margin-right: 30px;
}

.second-frame-title {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sparkle-wrapper {
  display: flex;
  align-self: flex-start;
  height: 69px;
}

.sparkle {
  overflow: visible;
  align-self: center;
  padding: 0 16px;
}

.title-texts {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.title-texts p {
  margin-top: 0;
}

.title-texts h1 {
  margin-bottom: 0;
}

.second-text {
  color: #8590a5;
}

.setting-card {
  margin-left: 30px;
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

.card-arrow {
  align-self: center;
  padding: 0 24px;
  transition: transform 0.3s ease;
  cursor: pointer;
}

.card-arrow.mirrored {
  transform: rotate(180deg);
}

.second-frame-content {
  transition:
    max-height 0.6s ease,
    opacity 0.6s ease;
  overflow: visible;
  max-height: 500px;
  opacity: 1;
}

.second-frame-content.hidden {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
</style>
