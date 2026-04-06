// composables/useCategoryNavigation.ts

const activeCategory = ref<string | null>(null);

export const useCategoryNavigation = () => {
  const route = useRoute();

  const selectedCategory = computed(() => {
    const path = route.path.split("/")[1] || "risks";
    return path;
  });

  const selectCategory = (category: string) => {
    activeCategory.value = category;
    setTimeout(() => {
      activeCategory.value = null;
      navigateTo(`/${category}`);
    }, 150);
  };

  const isSelected = (category: string) => selectedCategory.value === category;
  const isPressed = (category: string) => activeCategory.value === category;

  return { selectCategory, isSelected, isPressed };
};
