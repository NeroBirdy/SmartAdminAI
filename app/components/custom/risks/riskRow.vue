<template>
  <div class="red-dot"></div>
  <div class="texts">
    <div class="second-frame-title header-sm">{{ item.title }}</div>
    <div class="second-frame-text main-text-sm">{{ item.text }}</div>
  </div>
</template>

<script lang="ts" setup>
type Risk = {
  id: number;
  title: string;
  text: string;
};

const props = defineProps<{
  item: Risk;
}>();
</script>

<style scoped>
.red-dot {
  min-width: 8px;
  height: 8px;
  background-color: #e6521f;
  border-radius: 50%;
  margin-left: 16px;
  margin-right: 16px;
}

.main-text-sm {
  color: #6a758b;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
}

.second-frame .texts {
  margin-right: 40px;
  margin-left: 0;
}
</style>
