import { isWithinInterval, areIntervalsOverlapping, format } from "date-fns";

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

type WorkHours = {
  dayOfWeek: string;
  startWork: Date;
  endWork: Date;
  isWorkingDay: boolean;
  workScheduleBreaks: {
    break: { startTime: Date; endTime: Date };
  }[];
};

type LessonSlot = {
  startTime: Date;
  endTime: Date;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const lessonId = body.lessonId;

  const lesson = await fakeAPI.lesson.findUnique({
    where: { id: lessonId },
    include: { venue: true, program: true },
  });

  const venueId = lesson?.venue.id;
  const programId = lesson?.program.id;
  const date = lesson?.date;
  const startTime = lesson?.startTime;
  const endTime = lesson?.endTime;

  const programVenues = await fakeAPI.programVenue.findMany({
    where: { programId },
    select: { venueId: true },
  });

  const availableVenues = programVenues
    .map((pv) => pv.venueId)
    .filter((id) => id !== venueId);

  const availableForWorkHours = (workHours: WorkHours[]) => {
    const dayOfWeek = format(date!, "EEE").toUpperCase();
    const workDay = workHours.find((w) => w.dayOfWeek === dayOfWeek);

    if (!workDay || !workDay.isWorkingDay) return false;

    if (
      !isWithinInterval(startTime!, { start: workDay.startWork, end: workDay.endWork }) ||
      !isWithinInterval(endTime!, { start: workDay.startWork, end: workDay.endWork })
    ) return false;

    const overlapsBreak = workDay.workScheduleBreaks.some((b) =>
      areIntervalsOverlapping(
        { start: startTime!, end: endTime! },
        { start: b.break.startTime, end: b.break.endTime },
      ),
    );

    return !overlapsBreak;
  };

  const availableForLessons = (lessons: LessonSlot[]) => {
    return !lessons.some((l) =>
      areIntervalsOverlapping(
        { start: startTime!, end: endTime! },
        { start: l.startTime, end: l.endTime },
      ),
    );
  };

  const results = await Promise.all(
    availableVenues.map(async (venueId) => {
      const workHours = await prisma.workSchedule.findMany({
        where: { venueId },
        select: {
          dayOfWeek: true,
          startWork: true,
          endWork: true,
          isWorkingDay: true,
          workScheduleBreaks: {
            select: { break: { select: { startTime: true, endTime: true } } },
          },
        },
      });

      const lessons = await fakeAPI.lesson.findMany({
        where: { date, venueId },
        select: { startTime: true, endTime: true },
      });

      return {
        venueId,
        isAvailable: availableForWorkHours(workHours as WorkHours[]) && availableForLessons(lessons),
      };
    }),
  );

  return results;
});