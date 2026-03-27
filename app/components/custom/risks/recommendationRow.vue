<template>
  <div class="blue-dot"></div>
  <div class="texts">
    <div class="second-frame-title header-sm">{{ item.title }}</div>
    <div class="second-frame-text main-text-sm">{{ item.text }}</div>
  </div>
  <div class="btn-block">
    <ui-button
      v-if="item.done"
      @click="handleRecommendationButtonClick()"
      class="header-sm done-btn-pushed"
    >
      <component :is="checkImg" />
    </ui-button>
    <ui-button
      v-else
      @click="handleRecommendationButtonClick()"
      class="header-sm done-btn"
    >
      Выполнено
    </ui-button>
  </div>
</template>

<script lang="ts" setup>
import checkImg from "~/assets/icons/check.svg";

type Recommendation = {
  id: number;
  title: string;
  text: string;
  done: boolean;
};

const props = defineProps<{
  item: Recommendation;
}>();

const handleRecommendationButtonClick = async () => {
  try {
    await $fetch("/api/risks/changeDoneState", {
      method: "POST",
      body: { id: props.item.id, done: !props.item.done },
    });

    props.item.done = !props.item.done;
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
</script>

<style scoped>
.btn-block {
  min-width: 200px;
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.blue-dot {
  min-width: 8px;
  height: 8px;
  background-color: #2c71e4;
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
  margin-right: auto;
  margin-left: 0;
  margin-bottom: 5px;
}

.done-btn {
  margin-right: 20px;
}

.done-btn-pushed {
  min-width: 40px;
  background-color: #e9f3ff;
  padding: 8px;
  margin-right: 20px;
}
</style>
