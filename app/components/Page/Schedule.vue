<template>
  <div class="frame">
    <h1 class="frame-header header-md">Результаты</h1>
    <div class="inside-frame row">
      <div class="frame second-frame-results">
        <div class="inside-frame">
          <div class="second-frame-up">
            <p class="second-frame-text main-text-md">Создано занятий</p>
            <img
              class="second-frame-img"
              src="../../assets/icons/ellipsis.svg"
              alt=""
            />
          </div>
          <h1 class="second-frame-header-text header-2xl">24</h1>
        </div>
      </div>
      <div class="frame second-frame-results">
        <div class="inside-frame">
          <div class="second-frame-up">
            <p class="second-frame-text main-text-md">Перенесено занятий</p>
            <img
              class="second-frame-img"
              src="../../assets/icons/ellipsis.svg"
              alt=""
            />
          </div>
          <h1 class="second-frame-header-text header-2xl">24</h1>
        </div>
      </div>
    </div>
  </div>
  <div class="frame">
    <h1 class="frame-header header-md">Выполняемые задачи (Skills)</h1>
    <div class="inside-frame">
      <div class="frame second-frame-skills">
        <div class="second-frame-title">
          <img src="../../assets/icons/sparkles.svg" alt="" />
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
          <div class="generate-settings">
            <div class="generate-setting">
              <h1 class="second-text">Горизонт планирования</h1>
              <div class="setting-description">
                <p class="header-sm">2 недели</p>
                <img src="../../assets/icons/remove.svg" alt="" />
              </div>
            </div>
          </div>
          <div class="generate-settings">
            <div class="generate-setting">
              <h1 class="second-text">При планировании учитывать</h1>
              <div class="setting-description">
                <p class="header-sm">Только занятость инструкторов</p>
                <img src="../../assets/icons/remove.svg" alt="" />
              </div>
            </div>
          </div>
          <div class="generate-settings">
            <div class="generate-setting">
              <h1 class="second-text">Учитывать</h1>
              <div class="setting-description">
                <p class="header-sm">Занятость инструкторов</p>
                <img src="../../assets/icons/remove.svg" alt="" />
              </div>
            </div>
          </div>
          <ui-help title="Как это работает?" text=" Перед тем как назначить пробное занятие, агент свяжется с
                Клиентом и подберет для него подходящее дату и время. Клиент
                может написать о том, что пробное занятие нужно перенести. После
                занятия агент соберет обратную связь и предложит выбрать группу."/>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import down from "../../assets/icons/chevron_down.svg";
import up from "../../assets/icons/chevron_up.svg";

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

.second-frame-results {
  width: 348px;
  height: 110px;
  margin-right: 15px;
}

.second-frame-up {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.second-frame-img {
  margin-right: 20px;
}

.second-frame-header-text {
  margin: 0;
}

.second-text {
  color: #8590a5;
}

.generate-settings {
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
