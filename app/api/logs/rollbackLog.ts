export const rollbackLog = async (logId: number) => {
  return await $fetch("/api/logs/rollbackLog", {
    method: "POST",
    body: { logId: logId },
  });
};
