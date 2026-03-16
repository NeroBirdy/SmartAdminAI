<template>
  <div :class="type == 'recommendation' ? 'blue-dot' : 'red-dot'"></div>
  <div class="texts">
    <div class="second-frame-title header-sm">{{ item.title }}</div>
    <div class="second-frame-text main-text-sm">{{ item.text }}</div>
  </div>
  <UIRecommendationButton
    v-if="type == 'recommendation'"
    :item="item as Recommendation"
  />
</template>

<script lang="ts" setup>
type RiskOrRec = {
  id: number;
  title: string;
  text: string;
  done?: boolean;
};

type Recommendation = {
  id: number;
  title: string;
  text: string;
  done: boolean;
};

defineProps<{
  type: string;
  item: RiskOrRec;
}>();
</script>

<style scoped>
.blue-dot {
  min-width: 8px;
  height: 8px;
  background-color: #2c71e4;
  border-radius: 50%;
  margin-left: 16px;
  margin-right: 16px;
}

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
  margin: auto;
  margin-left: 0;
}
</style>
