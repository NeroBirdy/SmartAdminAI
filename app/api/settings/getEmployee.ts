export const getEmployees = async (id: number) => {
  return await $fetch("/api/settings/getEmployees", {
    query: { orgId: id },
  });
};
