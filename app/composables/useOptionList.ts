const activeListId = ref<string | null>(null);

export const useOptionList = () => {
  const toggleList = (id: string) => {
    activeListId.value = activeListId.value === id ? null : id;
  };

  const closeList = () => {
    activeListId.value = null;
  };

  const isOpen = (id: string) => {
    return activeListId.value === id;
  };

  return { toggleList, closeList, isOpen };
};