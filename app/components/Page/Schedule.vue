<template>
  <div class="frame">
    <h1 class="frame-header header-md">Результаты</h1>
    <div class="inside-frame row">
      <ui-result-card title="Создано занятий" type="LESSON_CREATE" />
      <ui-result-card title="Перенесено занятий" type="DATE_CHANGE" />
      <ui-result-card title="Отменено занятий" type="LESSON_CANCELLATION" />
      <ui-result-card title="Смена помещений" type="VENUE_CHANGE" />
    </div>
  </div>
  <div class="frame">
    <h1 class="frame-header header-md">Выполняемые задачи (Skills)</h1>
    <div class="inside-frame">
      <custom-schedule-generate-schedule-card />
      <custom-schedule-chat-settings-schedule-card />
    </div>
  </div>
</template>
<style scoped>
.frame {
  margin-top: 10px;
}

.row {
  flex-direction: row !important;
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

.frame-header {
  margin: 0;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 24px;
}
</style>
