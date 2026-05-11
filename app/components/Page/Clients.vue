<template>
  <div class="frame">
    <h1 class="frame-header header-md">Результаты</h1>
    <div class="inside-frame row">
      <ui-result-card
        title="Назначено пробных занятий"
        type="SCHEDULED_TRIAL_LESSON"
      />
      <ui-result-card
        title="Распределено клиентов в группу"
        type="ASSIGNED_TO_GROUP"
      />
      <ui-result-card title="Откат логов" type="LOG_ROLLBACK" />
      <ui-result-card title="Консультаций клиентов" type="QUESTION_ANSWER" />
    </div>
  </div>
  <div class="frame">
    <h1 class="frame-header header-md">Выполняемые задачи (Skills)</h1>
    <div class="inside-frame">
      <custom-clients-card
        class="card"
        :header="{
          title: 'Назначение пробных занятий',
          description:
            'Назначать дату и время для проведения пробных занятий для новых заявок',
        }"
        :help="{
          exist: true,
          title: 'Как это работает?',
          text: 'Перед тем как назначить пробное занятие, ИИ-агент свяжется с клиентом и подберёт для него подходящие дату и время. После занятия соберём обратную связь и предложим выбрать группу.',
        }"
      />

      <custom-clients-card
        class="card"
        :header="{
          title: 'Распределение в группу',
          description:
            'Помогать клиентам выбрать подходящую группу и распределять их в системе',
        }"
        :help="{
          exist: true,
          title: 'Как это работает?',
          text: 'Клиент при помощи чат-бота может записаться на занятия, а ИИ-агент подберёт для него оптимальную группу, соберет данные и внесёт всеё необходимое в систему.',
        }"
      />

      <custom-clients-card
        class="card"
        :header="{
          title: 'Консультирование клиентов по общим вопросам',
          description: 'Ответы на вопросы клиентов',
        }"
        :help="{
          exist: false,
        }"
      />
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

.card :deep(.help) {
  margin-top: 16px !important;
}
</style>
