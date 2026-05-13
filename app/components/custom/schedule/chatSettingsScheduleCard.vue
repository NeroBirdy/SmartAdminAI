<template>
  <div class="frame second-frame-skills">
    <div class="second-frame-title">
      <component class="sparkle" :is="sparklesImg" />
      <div class="right">
        <div class="title-texts">
          <h1 class="header-sm">Управление расписанием через чат</h1>
          <p class="description main-text-sm">
            Изменять расписание через чат агента при необходимости
          </p>
        </div>
        <component
          class="card-arrow"
          :class="mirroredClass"
          :is="cardArrowImg"
          @click.stop="openCard = !openCard"
        />
      </div>
    </div>
    <div class="second-frame-content" :class="hiddenClass">
      <custom-schedule-setting-card
        queryKey="schedule_instructor_change_date"
      />
      <custom-schedule-setting-card
        queryKey="schedule_instructor_change_venue"
      />
      <custom-schedule-setting-card
        queryKey="schedule_instructor_lesson_cancellation"
      />
      <custom-schedule-setting-card queryKey="schedule_extra_setting" />

      <ui-help
        title="Как это работает?"
        text=" Ваши сотрудники смогут через чат-бот корректировать своё расписание при необходимости.
         Здесь вы можете настроить их возможности, а так же установить дополнительные настройки."
      />
    </div>
  </div>
</template>

<script setup>
import cardArrowImg from "~/assets/icons/chevron_down.svg";
import sparklesImg from "~/assets/icons/sparkles.svg";

const openCard = ref(false);

const mirroredClass = computed(() => ({
  mirrored: openCard.value,
}));

const hiddenClass = computed(() => ({
  hidden: !openCard.value,
}));
</script>

<style scoped>
.frame {
  margin-top: 12px;
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
  min-height: 78px;
  margin-right: 30px;
}

.second-frame-title {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sparkle {
  overflow: visible;
  align-self: center;
  padding: 0 16px;
}

.title-texts {
  display: flex;
  flex-direction: column;
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
  pointer-events: none;
}
</style>
