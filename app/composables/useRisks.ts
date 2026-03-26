type ApiResponse = {
  recommendations: Recommendation[];
  risks: Risk[];
};

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

const recommendations = ref<Recommendation[]>([]);
const risks = ref<Risk[]>([]);
const loading = ref(true);

export const useRisks = () => {
  const getData = async () => {
    loading.value = true;
    try {
      const response = await $fetch<ApiResponse>("/api/risks/getData");
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

  return {
    risks,
    recommendations,
    loading,
    getData,
  };
};
