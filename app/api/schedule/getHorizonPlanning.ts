export const getHorizonPlanning = async () => {
  return await $fetch("/api/schedule/getHorizonPlanning", {
    query: {
      orgId: 1,
    },
  });
};
