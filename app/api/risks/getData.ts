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

export const getData = async () => {
  return await $fetch<ApiResponse>("/api/risks/getData");
};
