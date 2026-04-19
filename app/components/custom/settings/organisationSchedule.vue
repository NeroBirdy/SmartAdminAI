<template>
  <div class="frame second-frame-setting">
    <div class="second-frame-title">
      <div class="title-texts">
        <div class="header-icon">
          <h1 class="header-sm">График работы организации</h1>
          <component
            class="icon"
            :is="questionIcon"
            @click.stop="orgScheduleOpen = !orgScheduleOpen"
          />
          <Transition name="fade">
            <div
              class="overlay"
              v-if="orgScheduleOpen"
              @click.stop="orgScheduleOpen = false"
            />
          </Transition>
          <Transition name="modal">
            <custom-settings-modal-shedule
              v-if="orgScheduleOpen"
              type="organisation"
              :id="1"
              @close="orgScheduleOpen = false"
            />
          </Transition>
        </div>
        <p class="description main-text-sm">
          Основа для генерации вашего расписания
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import questionIcon from "~/assets/icons/circle_question_mark.svg";

const orgScheduleOpen = ref(false);
</script>

<style scoped>
.frame {
  margin-top: 20px;
}

.second-frame-setting {
  margin-top: 0 !important;
  min-height: 78px;
  margin-right: 30px;
}

.second-frame-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 32px;
}

.header-icon {
  display: flex;
  flex-direction: row;
}

.icon {
  padding-left: 8px;
  cursor: pointer;
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

.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.85);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}

.overlay {
  position: fixed;
  inset: 0;
  backdrop-filter: blur(1px);
  background: rgba(0, 0, 0, 0.25);
  z-index: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
