<template>
  <UILoader v-if="loading" />
  <div v-else>
    <CustomBusinessRiskOrRecList
      type="recommendation"
      title="Рекомендации (Growth opportunities)"
      :items="recommendations"
    />
    <CustomBusinessRiskOrRecList
      type="risk"
      title="Риски (Risks)"
      :items="risks"
    />
  </div>
</template>
<script lang="ts" setup>
type Recommendation = {
  id: number;
  title: string;
  text: string;
  done: boolean;
};

type Risk = {
  id: number;
  title: string;
  text: string;
};

type ApiResponse = {
  recommendations: Recommendation[];
  risks: Risk[];
};

const recommendations = ref<Recommendation[]>([]);
const risks = ref<Risk[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await $fetch<ApiResponse>("/api/risks");

    recommendations.value = response.recommendations;
    risks.value = response.risks;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>
<style scoped></style>
