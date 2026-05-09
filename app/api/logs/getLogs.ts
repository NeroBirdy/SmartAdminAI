import type { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

export const getLogs = async (type: ChangeType) => {
  return await $fetch("/api/logs/getLogsByType", {
    method: "GET",
    query: { type: type },
  });
};
