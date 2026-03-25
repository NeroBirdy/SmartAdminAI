<template>
  <ui-loader v-if="loading" />

  <div v-else>
    <custom-risks-recommendation-list
      title="Рекомендации (Growth opportunities)"
      :items="recommendations"
    />
    <custom-risks-risk-list type="risk" title="Риски (Risks)" :items="risks" />
  </div>
</template>
<script lang="ts" setup>
const { risks, recommendations, loading, getData } = useRisks();

onMounted(async () => {
  await getData();
});
</script>
<style scoped></style>
