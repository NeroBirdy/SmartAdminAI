<template>
  <div class="frame">
    <h1 class="frame-header header-md">Результаты</h1>
    <div class="inside-frame row">
      <ui-result-card title="Подборов замен" text="24" />
      <ui-result-card title="Успешных замен" text="24" />
    </div>
  </div>
  <div class="frame">
    <h1 class="frame-header header-md">Выполняемые задачи (Skills)</h1>
    <div class="inside-frame">
      <custom-staff-replacement-instuctor-card />
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
