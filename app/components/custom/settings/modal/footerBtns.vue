<template>
  <div class="btns-wrapper">
    <ui-button
      v-if="!initDataDefault"
      class="delete-btn"
      @click.stop="emit('delete')"
    >
      <p class="header-sm">Удалить</p>
    </ui-button>
    <ui-button class="submit-btn" @click.stop="emit('save')">
      <p class="header-sm">Сохранить</p>
    </ui-button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  initDataDefault: boolean;
}>();

const emit = defineEmits<{
  (e: "delete"): void;
  (e: "save"): void;
}>();
</script>

<style scoped>
.btns-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: end;
  margin-top: 35px;
  margin-bottom: 14px;
  margin-right: 28px;
}

.submit-btn {
  min-width: 124px !important;
  transition: background-color 0.1s ease;
}

.delete-btn {
  min-width: 106px !important;
  background-color: #d33046;
  margin-right: 12px;
  transition: background-color 0.1s ease;
}

.submit-btn:hover {
  background-color: #1f59bd;
}

.delete-btn:hover {
  background-color: #ad2538;
}

.header-sm {
  margin: 0;
}
</style>
