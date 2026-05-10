<template>
  <div class="display-field">
    <p class="display-title header-sm">{{ display.title }}</p>
    <p class="display-text main-text-sm">{{ display.text }}</p>
  </div>
</template>
<script lang="ts" setup>
defineProps<{ display: { title: string; text: string } }>();
</script>

<style scoped>
.display-field {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  width: 95%;
  padding-top: 2.5px;
  padding-bottom: 2.5px;
}

.header-sm,
.main-text-sm {
  color: #324260;
}

p {
  margin: 0;
}
</style>
