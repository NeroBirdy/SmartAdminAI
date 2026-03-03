<template>
    <div class="frame">
        <h1 class="frame-header header-md">
            Результаты
        </h1>
        <div class="inside-frame row">
            <div class="frame second-frame-results">
                <div class="inside-frame">
                    <div class="second-frame-up">
                        <p class="second-frame-text main-text-md">Создано занятий</p>
                        <img class="second-frame-img" src="../assets/icons/ellipsis.svg" alt="">
                    </div>
                    <h1 class="second-frame-header-text header-2xl">24</h1>
                </div>
            </div>
            <div class="frame second-frame-results">
                <div class="inside-frame">
                    <div class="second-frame-up">
                        <p class="second-frame-text main-text-md">Перенесено занятий</p>
                        <img class="second-frame-img" src="../assets/icons/ellipsis.svg" alt="">
                    </div>
                    <h1 class="second-frame-header-text header-2xl">24</h1>
                </div>
            </div>
        </div>
    </div>
    <div class="frame">
        <h1 class="frame-header header-md">
            Выполняемые задачи (Skills)
        </h1>
        <div class="inside-frame ">
            <div class="frame second-frame-skills">
                <div class="second-frame-title">
                    <img src="../assets/icons/sparkles.svg" alt="">
                    <div class="right">
                        <div class="title-texts">
                            <h1 class="header-sm">Генерация расписания</h1>
                            <p class="description main-text-sm">
                                Отслеживать сообщения требующие внимания
                            </p>
                        </div>
                        <img :src="getIcon(openGenerate)" alt="" @click.stop="openGenerate = !openGenerate">
                    </div>
                </div>
                <div class="second-frame-content">
                    <div class="generate-settings">
                        <div class="generate-setting">
                            <h1 class="second-text">
                                Горизонт планирования
                            </h1>
                            <div class="setting-description">
                                <p class="header-sm">2 недели</p>
                                <img src="../assets/icons/remove.svg" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="generate-settings">
                        <div class="generate-setting">
                            <h1 class="second-text">
                                При планировании учитывать </h1>
                            <div class="setting-description">
                                <p class="header-sm">Только занятость инструкторов</p>
                                <img src="../assets/icons/remove.svg" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="generate-settings">
                        <div class="generate-setting">
                            <h1 class="second-text">
                                Учитывать </h1>
                            <div class="setting-description">
                                <p class="header-sm">Занятость инструкторов</p>
                                <img src="../assets/icons/remove.svg" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="help">
                        <div class="inside-help">
                            <h1 class="help-header main-text-sm">
                                Как это работает?
                            </h1>
                            <p class="help-p main-text-sm">Перед тем как назначить пробное занятие, агент свяжется с
                                Клиентом и
                                подберет для него подходящее дату и время. Клиент может написать о том, что пробное
                                занятие нужно перенести. После занятия агент соберет обратную связь и предложит выбрать
                                группу.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import down from './assets/icons/chevron_down.svg'
import up from './assets/icons/chevron_up.svg'

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
    color: #6A758B;
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

.help {
    background-color: #E9F3FF;
    border-radius: 25px;
    margin-left: 16px;
    margin-right: 24px;
}

.help-header {
    margin: 0;
    padding-top: 16px;
    color: #2067DF;
}

.help-p {
    padding-top: 3px;
    margin: 0;
}

.inside-help {
    display: flex;
    flex-direction: column;
    padding-bottom: 15px;
    padding-left: 20px;
    margin-bottom: 10px;
}

.second-text {
    color: #8590A5;
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