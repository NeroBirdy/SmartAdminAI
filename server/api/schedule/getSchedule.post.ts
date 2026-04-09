const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { orgId, date } = body;

  const targetDate = new Date(date);

  const formatTime = (date: Date | null) => {
    if (!date) return null;
    return date.toISOString().substring(11, 16);
  };

  const lessons = await fakeAPI.lesson.findMany({
    where: {
      group: { organizationId: orgId },
      date: {
        gte: new Date(targetDate.getFullYear(), targetDate.getMonth(), 1),
        lt: new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 1),
      },
    },
    include: {
      group: {
        select: {
          id: true,
          name: true,
        },
      },
      venue: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return lessons.map((data) => ({
    id: data.id,
    date: data.date,
    startTime: formatTime(data.startTime),
    endTime: formatTime(data.endTime),
    group: data.group,
    venue: data.venue,
  }));
});
