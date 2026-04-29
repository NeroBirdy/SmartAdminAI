<template>
  <div class="warning">
    <div class="content">
      <div class="icon-wrapper">
        <component class="icon" :is="warningIcon" />
      </div>
      <div class="text">
        <p class="main-text-sm text-title">
          Не все сотрудники подключились в ВК-бот
        </p>
        <p class="main-text-sm text-description">
          Для работы функции необходимо, чтобы все сотрудники подключили
          уведомления Вконтакте
        </p>
      </div>
    </div>
    <ui-button class="btn"><p class="header-sm">В настройки</p></ui-button>
  </div>
</template>

<script lang="ts" setup>
import warningIcon from "~/assets/icons/warning_toast.svg";
</script>

<style scoped>
.warning {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #dddfe5;
  border-radius: 16px;
  height: 78px;
  margin-right: 32px;
  margin-bottom: 16px;
}

.text {
  display: flex;
  flex-direction: column;
}

.main-text-sm {
  margin: 0;
  color: #2b3850;
}

.text-title {
  font-weight: 700;
  margin-bottom: 2px;
}

.text-desription {
  font-weight: 500;
}

.header-sm {
  margin: 0;
}

.icon-wrapper {
  display: flex;
  align-items: center;
}

.icon {
  margin: auto;
  margin-left: 20px;
  margin-right: 16px;
}

.btn {
  margin-right: 20px;
}
</style>
