<template>
    <div class="header">
        <div class="leftSide">
            <button class="back-btn">
            </button>
            <h1 class="header-xl header-text">ИИ Администратор</h1>
        </div>
        <div class="rightSide">
            <img class="icon" src="../assets/icons/headset.png" alt="">
            <img class="icon icon-bell" src="../assets/icons/bell.png" alt="">
            <p class="header-sm user-name">Евгений П.</p>
            <img class="user-img" src="../assets/icons/user_pic.png" alt="">
        </div>
    </div>
</template>

<style scoped>
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 15px;
}

.header-text {
    color: #2B3850;
}

.leftSide {
    display: flex;
    flex-direction: row;
}

.back-btn {
    background-image: url(../assets/icons/arrow_left.png);
    background-position: center;
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 50%;
    border: none;
    margin: auto;
    margin-left: 5px;
    margin-right: 15px;
    box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
}

.rightSide {
    display: flex;
    justify-content: end;
    flex-direction: row;
    width: 15%;
}

.icon {
    margin: auto;
    width: 24px;
    height: 24px;
    margin-left: 0;
    margin-right: 0;
}

.icon-bell {
    margin-left: 20px;
    margin-right: 30px;
}

.user-img {
    height: 48px;
    width: 48px;
    margin: auto;
    margin-right: 0;
    margin-left: 0;
}

.user-name {
    margin: auto;
    margin-right: 15px;
    margin-left: 0;
    color: #2B3850;
}
</style>