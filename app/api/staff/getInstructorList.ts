export const getInstructorList = async () => {
  return await $fetch("/api/staff/getInstructorList", {
    query: { orgId: 1 },
  });
};
