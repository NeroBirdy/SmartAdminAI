<template>
  <ui-loader class="loader" v-if="loading" />

  <Transition name="fade">
    <div v-if="!loading">
      <custom-risks-recommendation-list
        title="Рекомендации (Growth opportunities)"
        :items="recommendations"
      />
      <custom-risks-risk-list
        type="risk"
        title="Риски (Risks)"
        :items="risks"
      />
    </div>
  </Transition>
</template>
<script lang="ts" setup>
const { risks, recommendations, loading, getData } = useRisks();

onMounted(async () => {
  await getData();
});
</script>
<style scoped>
.loader {
  margin-top: 20px;
}

.fade-enter-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>
