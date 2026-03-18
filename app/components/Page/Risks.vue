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
import { toast } from "vue-sonner";
import UIToast from "~/components/ui/toast.vue";

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
  await getData();
});

const getData = async () => {
  try {
    const response = await $fetch<ApiResponse>("/api/risks");

    recommendations.value = response.recommendations;
    risks.value = response.risks;
  } catch (err) {
    console.error(err);

    showCustomToast(
      "danger",
      "Что‑то пошло не так",
      "Не удалось выполнить операцию. Попробуйте позже или обратитесь в поддержку.",
    );
  } finally {
    loading.value = false;
  }
};

const showCustomToast = (
  type: "success" | "warning" | "danger",
  title: string,
  description: string,
) => {
  toast.custom(
    (t) =>
      h(UIToast, {
        toast: t,
        type: type,
        title: title,
        description: description,
      }),
    {
      duration: type === "danger" ? Infinity : 5000,
    },
  );
};
</script>
<style scoped></style>
