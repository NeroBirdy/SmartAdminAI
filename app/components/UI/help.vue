<template>
  <div class="help">
    <div class="inside-help">
      <h1 class="help-header main-text-sm">{{ props.title }}</h1>
      <p class="help-p main-text-sm">
        {{ props.text }}
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string;
  text: string;
}>();
</script>

<style scoped>
.main-text-sm {
  color: #6a758b;
}

.help {
  background-color: #e9f3ff;
  border-radius: 25px;
  margin-left: 16px;
  margin-right: 24px;
}

.help-header {
  margin: 0;
  padding-top: 16px;
  color: #2067df;
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
</style>
