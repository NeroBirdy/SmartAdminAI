<template>
  <div class="display">
    <div class="inside-display">
      <custom-logs-modal-display-field
        v-for="item in display"
        :key="item.title"
        :display="item"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{ display: { title: string; text: string }[] }>();
</script>

<style scoped>
.display {
  display: flex;
  flex-direction: column;
  width: 95%;
  align-self: center;
  background-color: #dee2e6;
  border-radius: 8px;
  margin-bottom: 5px;
}

.inside-display {
  display: flex;
  flex-direction: column;
  margin: 7px 5px;
}
</style>
