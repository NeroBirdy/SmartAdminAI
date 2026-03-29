type SideBarCategory = {
  id: number;
  sectionId: number;
  settingAIId: number;
  enable: boolean;
};

export const useSideBarCategories = () => {
  const categories = useState<SideBarCategory[] | null>("sideBarCategories", () => null);

  const getCategories = async () => {
    const data = await $fetch("/api/sideBar/getCategories", {
      method: "POST",
      body: { sectionId: 1 },
    });
    categories.value = data.categories;
  };

  const updateCategory = async (id: number, enable: boolean) => {
    await $fetch("/api/sideBar/updateCategory", {
      method: "POST",
      body: { id, enable },
    });
    const category = categories.value?.find((c: any) => c.id === id);
    if (category) category.enable = enable;
  };

  onMounted(() => {
    if (!categories.value) getCategories();
  });

  return { categories, updateCategory };
};
