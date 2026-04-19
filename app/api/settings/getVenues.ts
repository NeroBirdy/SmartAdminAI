export const getVenues = async (id: number) => {
  return await $fetch("/api/settings/getVenues", {
    query: { orgId: id },
  });
};
