<template>
  <div class="frame">
    <h1 class="frame-header header-md">
      {{ title }}
    </h1>
    <div class="inside-frame">
      <div
        class="frame second-frame"
        v-if="items.length"
        v-for="item in items"
        :key="item.id"
      >
        <custom-risks-recommendation-row :item="item" />
      </div>
      <div v-else class="error">
        <h1 class="header-sm">
          Упс! Кажется произошла ошибка. Попробуйте еще раз позже.
        </h1>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
type Recommendation = {
  id: number;
  title: string;
  text: string;
  done: boolean;
};

defineProps<{
  title: string;
  items: Recommendation[];
}>();
</script>

<style scoped>
.frame {
  margin-top: 10px;
}

.inside-frame {
  padding-bottom: 10px;
}

.frame-header {
  margin: 0;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 24px;
}

.second-frame {
  margin: auto;
  width: 96%;
  min-height: 78px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.header-sm {
  color: #717e97;
  margin: 0;
}

.error {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  margin-bottom: 56px;
}
</style>
