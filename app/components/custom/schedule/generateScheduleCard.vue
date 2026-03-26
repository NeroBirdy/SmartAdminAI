<template>
  <div class="frame">
    <h1 class="frame-header header-md">Выполняемые задачи (Skills)</h1>
    <div class="inside-frame">
      <div class="frame second-frame-skills">
        <div class="second-frame-title">
          <img src="../../../assets/icons/sparkles.svg" alt="" />
          <div class="right">
            <div class="title-texts">
              <h1 class="header-sm">Генерация расписания</h1>
              <p class="description main-text-sm">
                Отслеживать сообщения требующие внимания
              </p>
            </div>
            <img
              :src="getIcon(openGenerate)"
              alt=""
              @click.stop="openGenerate = !openGenerate"
            />
          </div>
        </div>
        <div class="second-frame-content">
          <custom-schedule-horizon-planning
            queryKey="schedule_planning_horizon"
          />

          <custom-schedule-horizon-planning
            queryKey="schedule_consider_resources"
          />

          <ui-help
            title="Как это работает?"
            text=" Перед тем как назначить пробное занятие, агент свяжется с
                Клиентом и подберет для него подходящее дату и время. Клиент
                может написать о том, что пробное занятие нужно перенести. После
                занятия агент соберет обратную связь и предложит выбрать группу."
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import down from "../../../assets/icons/chevron_down.svg";
import up from "../../../assets/icons/chevron_up.svg";

const openManagement = ref(false);
const openGenerate = ref(false);

const getIcon = (bool) => {
  if (bool) {
    return up;
  }
  return down;
};
</script>

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
  padding-left: 16px;
}

.second-frame-title img {
  padding-right: 10px;
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

.setting-description img {
  padding-left: 5px;
}
</style>
