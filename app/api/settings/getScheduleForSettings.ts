export const getScheduleForSettings = async (
  type: "employee" | "venue" | "organisation",
  id: number,
) => {
  return await $fetch("/api/settings/getSchedule", {
    query: { type: type, id: id },
  });
};
