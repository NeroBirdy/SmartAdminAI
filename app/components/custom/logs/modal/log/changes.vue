<template>
  <div class="changes">
    <p class="main-text-sm">Изменение</p>
    <custom-logs-modal-log-change-field
      v-for="item in changes"
      :key="item.title"
      :change="item"
    />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  changes: {
    title: string;
    oldValue: string | null;
    newValue: string | null;
  }[];
}>();
</script>

<style scoped>
.changes {
  display: flex;
  flex-direction: column;
  margin-top: 5px;
}

.main-text-sm {
  width: 95%;
  align-self: center;
  margin-bottom: 10px;
  color: #6a758b;
}

p {
  margin: 0;
}
</style>
