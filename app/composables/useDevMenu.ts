const isDevMenuOpen = ref(false);

export const useDevMenu = () => {
  const toggleDevMenu = () => {
    isDevMenuOpen.value = !isDevMenuOpen.value;
  };

  return {
    isDevMenuOpen,
    toggleDevMenu,
  };
};
