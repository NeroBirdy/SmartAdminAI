export const getCategories =  async () => {
    return await $fetch("/api/sideBar/getCategories", {
      method: "POST",
      body: { sectionId: 1 },
    });
};
