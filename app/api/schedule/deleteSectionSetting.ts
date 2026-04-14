export const deleteSectionSetting = async (id: number) => {
  await $fetch("/api/schedule/deleteSectionSetting", {
    method: "DELETE",
    body: {
      id: id,
    },
  });
};
