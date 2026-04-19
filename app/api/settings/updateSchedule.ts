export const updateSchedule = async (
  removeIds: [number, number][],
  schedule: [],
  type: "employee" | "venue" | "organisation",
  id: number,
) => {
  return await $fetch("/api/settings/updateSchedule", {
    method: "POST",
    body: { removeIds, schedule, type, id },
  });
};
