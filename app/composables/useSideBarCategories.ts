import { updateCategory as update } from "~/api/sideBar/updateCategory";
import { getCategories as get } from "~/api/sideBar/getCategories";

type SideBarCategory = {
  id: number;
  sectionId: number;
  settingAIId: number;
  enable: boolean;
};

export const useSideBarCategories = () => {
  const categories = useState<SideBarCategory[] | null>(
    "sideBarCategories",
    () => null,
  );

  const getCategories = async () => {
    const data = await get();
    categories.value = data.categories;
  };

  const updateCategory = async (id: number, enable: boolean) => {
    update(id, enable);
    const category = categories.value?.find((c: any) => c.id === id);
    if (category) category.enable = enable;
  };

  onMounted(() => {
    if (!categories.value) getCategories();
  });

  return { categories, updateCategory };
};
