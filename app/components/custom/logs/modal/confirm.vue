<template>
  <div class="frame">
    <div class="inside-frame">
      <p class="header-sm">Вы точно хотите откатить лог?</p>
      <div class="btns">
        <ui-button class="delete" @click="emit('revert')"
          ><p class="btn-text header-sm">Да</p></ui-button
        >
        <ui-button class="back" @click="emit('close')"
          ><p class="btn-text header-sm">нет</p></ui-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (e: "revert"): void;
  (e: "close"): void;
}>();
</script>

<style scoped>
.frame {
  width: 315px;
  height: 115px;
  pointer-events: all;
  z-index: 3;
}

.inside-frame {
  margin: 18px 22px;
  text-align: end;
}

.btns {
  padding-top: 20px;
  display: flex;
  justify-content: end;
}

.back {
  background-color: #d33046;
  min-width: 70px;
  margin-left: 13px;
  margin-right: 28px;
}

.delete {
  min-width: 124px;
}

p {
  margin: 0;
}
</style>
