export const getOrganisationSchedule = async (id: number) => {
  return await $fetch("/api/settings/getOrgSchedule", {
    query: { orgId: id },
  });
};
