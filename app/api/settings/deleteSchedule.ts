export const deleteScheduleSettings = async (idsToDelete: Number[]) => {
  return await $fetch("/api/settings/deleteSchedule", {
    method: "DELETE",
    body: { idsToDelete },
  });
};
