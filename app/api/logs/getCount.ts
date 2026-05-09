import type { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

export const getCount = async (type: ChangeType) => {
  return await $fetch("/api/logs/getLogsCount", {
    method: "GET",
    query: { type: type },
  });
};
