<template>
    <div class="frame">
        <h1 class="frame-header header-md">
            Основные настройки
        </h1>
        <div class="inside-frame">
            <div class="setting">
                <p class="second-text">Поле 1</p>
                <input class="settings-text" type="text" placeholder="Текст">
            </div>
            <div class="setting">
                <p class="second-text">Поле 2</p>
                <input class="settings-text" type="text" placeholder="Текст">
            </div>
            <div class="setting">
                <p class="second-text">Поле 3</p>
                <input class="settings-text" type="text" placeholder="Текст">
            </div>
        </div>
    </div>
    <div class="frame">
        <h1 class="frame-header header-md">
            Социальные сети
        </h1>
        <div class="inside-frame">
            <div class="setting">
                <p class="second-text">Поле 1</p>
                <input class="settings-text" type="text" placeholder="Текст">
            </div>
            <div class="setting">
                <p class="second-text">Поле 2</p>
                <input class="settings-text" type="text" placeholder="Текст">
            </div>
            <div class="setting">
                <p class="second-text">Поле 3</p>
                <input class="settings-text" type="text" placeholder="Текст">
            </div>
        </div>
    </div>
    <div class="frame">
        <h1 class="frame-header header-md">
            Настройки TG-бота
        </h1>
        <div class="inside-frame">
            <div class="setting">
                <p class="second-text">Поле 1</p>
                <input class="settings-text" type="text" placeholder="Текст">
            </div>
            <div class="setting">
                <p class="second-text">Поле 2</p>
                <input class="settings-text" type="text" placeholder="Текст">
            </div>
            <div class="setting">
                <p class="second-text">Поле 3</p>
                <input class="settings-text" type="text" placeholder="Текст">
            </div>
        </div>
    </div>
</template>

<style scoped>
.frame {
    margin-top: 10px;
}

.inside-frame {
    display: flex;
    flex-direction: column;
    padding-bottom: 24px;
    padding-left: 30px;
}

.header-sm {
    color: #324260;
    padding-bottom: 3px;
}

.main-text-sm {
    color: #6A758B;
}

.frame-header {
    margin: 0;
    padding-left: 30px;
    padding-top: 20px;
    padding-bottom: 6px;
}

.setting {
    display: flex;
    flex-direction: column;
}

.second-text {
    margin-top: 18px;
    color: #8590A5;
}

input {
    width: 380px;
    height: 48px;
    border: 0;
    padding: 0;
    padding-left: 20px;
    border-radius: 10px;
    background-color: #f8f8f8;
    outline: none;
    color: #2B3850;
}
</style>