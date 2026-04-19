const prisma = usePrisma();

const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

const defaultShedule = daysOfWeek.map((day) => ({
  id: -1,
  dayOfWeek: day,
  isWorkingDay: false,
  startWork: null,
  endWork: null,
  breaks: [],
}));


export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = Number(query.id);
  const type = String(query.type) as "employee" | "venue" | "organisation";

  return await getSchedule(type, id);
});

const getWhere = (type: "employee" | "venue" | "organisation", id: number) => ({
  organisation: { organizationId: id },
  employee: { employeeId: id },
  venue: { venueId: id },
}[type]);

const getSchedule = async (type: "employee" | "venue" | "organisation", id: number) => {
  try {
    const workSchedule = await prisma.workSchedule.findMany({
      where: getWhere(type, id),
      select: {
        id: true,
        dayOfWeek: true,
        isWorkingDay: true,
        startWork: true,
        endWork: true,
        workScheduleBreaks: { select: { break: true } },
      },
    });

    if (workSchedule.length === 0) {
      return defaultShedule;
    }

    return workSchedule.map((schedule) => ({
      id: schedule.id,
      dayOfWeek: schedule.dayOfWeek,
      isWorkingDay: schedule.isWorkingDay,
      startWork: schedule.startWork,
      endWork: schedule.endWork,
      breaks: schedule.workScheduleBreaks.map((item) => item.break),
    }));
  } catch (e) {
    console.error("Ошибка получения расписания организации", e);
  }
};
