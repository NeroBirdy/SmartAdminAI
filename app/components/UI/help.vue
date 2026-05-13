<template>
  <div class="help">
    <div class="inside-help">
      <h1 class="help-header main-text-sm">{{ props.title }}</h1>
      <p class="help-p main-text-sm">
        {{ props.text }} <a :href="props.link" v-if="props.link">Ссылка</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string;
  text: string;
  link?: string;
}>();
</script>

<style scoped>
.main-text-sm {
  color: #6a758b;
}

.help {
  background-color: #e9f3ff;
  border-radius: 16px;
  margin-top: 20px;
  margin-left: 16px;
  margin-right: 24px;
  margin-bottom: 16px;
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

.help-p :deep(a) {
  color: #2c71e4;
  text-decoration: none;
}

.inside-help {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  margin-left: 20px;
  padding-bottom: 10px;
  padding-right: 5px;
}
</style>
