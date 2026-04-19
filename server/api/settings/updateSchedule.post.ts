import { DayOfWeek } from "~~/prisma/generated/prisma/db1/enums";

const prisma = usePrisma();

type Day = {
  id: number;
  dayOfWeek: DayOfWeek;
  isWorkingDay: boolean;
  startWork: Date | null;
  endWork: Date | null;
  breaks: Break[];
};

type Break = { id: number; startTime: Date; endTime: Date };

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const schedule = body.schedule;
    const removeIds = body.removeIds as [number, number][];
    const type = body.type as "employee" | "venue" | "organisation";
    const id = body.id as number;

    await updateSchedule(schedule, type, id, removeIds);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
});

const getRelationField = (
  type: "employee" | "venue" | "organisation",
  id: number,
) =>
  ({
    organisation: { organizationId: id },
    employee: { employeeId: id },
    venue: { venueId: id },
  })[type];

const removeBreakLinks = async (removeIds: [number, number][]) => {
  if (removeIds.length === 0) return;

  for (const [workScheduleId, breakId] of removeIds) {
    await prisma.workScheduleBreaks.delete({
      where: { workScheduleId_breakId: { workScheduleId, breakId } },
    });
  }
};

const upsertDay = async (
  day: Day,
  type: "employee" | "venue" | "organisation",
  id: number,
) => {
  if (day.id === -1) {
    const created = await prisma.workSchedule.create({
      data: {
        dayOfWeek: day.dayOfWeek,
        isWorkingDay: day.isWorkingDay,
        startWork: day.startWork,
        endWork: day.endWork,
        ...getRelationField(type, id),
      },
    });
    return created.id;
  }

  await prisma.workSchedule.update({
    where: { id: day.id },
    data: {
      isWorkingDay: day.isWorkingDay,
      startWork: day.startWork,
      endWork: day.endWork,
    },
  });

  return day.id;
};

const findOrCreateBreak = async (b: Break) => {
  const existing = await prisma.breaks.findFirst({
    where: { startTime: new Date(b.startTime), endTime: new Date(b.endTime) },
  });

  if (existing) return existing;

  return prisma.breaks.create({
    data: { startTime: new Date(b.startTime), endTime: new Date(b.endTime) },
  });
};

const linkBreakToDay = async (workScheduleId: number, breakId: number) => {
  const linkExists = await prisma.workScheduleBreaks.findFirst({
    where: { workScheduleId, breakId },
  });

  if (linkExists) return;

  await prisma.workScheduleBreaks.create({
    data: { workScheduleId, breakId },
  });
};

const processBreaks = async (scheduleId: number, breaks: Break[]) => {
  if (breaks.length === 0) return;

  const validBreaks = breaks.filter((b) => b.startTime && b.endTime);

  for (const b of validBreaks) {
    const breakRecord = await findOrCreateBreak(b);
    await linkBreakToDay(scheduleId, breakRecord.id);
  }
};

const updateSchedule = async (
  schedule: Day[],
  type: "employee" | "venue" | "organisation",
  id: number,
  removeIds: [number, number][],
) => {
  await removeBreakLinks(removeIds);

  await Promise.all(
    schedule.map(async (day) => {
      const scheduleId = await upsertDay(day, type, id);
      await processBreaks(scheduleId, day.breaks);
    }),
  );
};
