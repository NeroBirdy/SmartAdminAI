type ScheduleParams = {
  orgId: number;
  dateFrom: string;
  dateTo: string;
  groupExceptions: number[];
  venueExceptions: number[];
};

export const getSchedule = async (params: ScheduleParams) => {
  const response = await $fetch("/api/schedule/getSchedule", {
    query: params,
  });
  return response;
};
