import type { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

export const getLogs = async (
  type: ChangeType,
  chosenCategories: ChangeType[],
  startDate: string | null,
  endDate: string | null,
) => {
  return await $fetch("/api/logs/getLogsByType", {
    method: "GET",
    query: { type, chosenCategories, startDate, endDate },
  });
};
