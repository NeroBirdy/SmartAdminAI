export const updateCategory = async (id: number, enable: boolean) => {
  await $fetch("/api/sideBar/updateCategory", {
    method: "POST",
    body: { id, enable },
  });
};
