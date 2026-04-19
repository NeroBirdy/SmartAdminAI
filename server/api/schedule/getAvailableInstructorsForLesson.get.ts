import { format, isWithinInterval, areIntervalsOverlapping } from "date-fns";

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

type LessonSlot = {
  startTime: Date;
  endTime: Date;
};

type WorkHours = {
  dayOfWeek: string;
  startWork: Date;
  endWork: Date;
  isWorkingDay: boolean;
  workScheduleBreaks: {
    break: { startTime: Date; endTime: Date };
  }[];
};

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const lessonId = Number(query.lessonId);

  const lesson = await fakeAPI.lesson.findUnique({ where: { id: lessonId } });

  const date = lesson?.date;
  const startTime = lesson!.startTime;
  const endTime = lesson!.endTime;
  const programId = lesson?.programId;
  const initialInstructorId = lesson?.instructorId;

  const instructors = await fakeAPI.employeeProgram.findMany({
    where: { programId, employeeId: { not: initialInstructorId } },
    select: { employeeId: true },
  });

  const possibleInstructorIds = instructors.map((i) => i.employeeId);

  const availableForWorkHours = (workHours: WorkHours[]) => {
    const dayOfWeek = format(date!, "EEE").toUpperCase();
    const workDay = workHours.find((w) => w.dayOfWeek === dayOfWeek);

    if (!workDay || !workDay.isWorkingDay) return false;

    if (
      !isWithinInterval(startTime, {
        start: workDay.startWork,
        end: workDay.endWork,
      }) ||
      !isWithinInterval(endTime, {
        start: workDay.startWork,
        end: workDay.endWork,
      })
    )
      return false;

    const overlapsBreak = workDay.workScheduleBreaks.some((b) =>
      areIntervalsOverlapping(
        { start: startTime, end: endTime },
        { start: b.break.startTime, end: b.break.endTime },
      ),
    );

    return !overlapsBreak;
  };

  const availableForLessons = (lessons: LessonSlot[]) => {
    return !lessons.some((l) =>
      areIntervalsOverlapping(
        { start: startTime, end: endTime },
        { start: l.startTime, end: l.endTime },
      ),
    );
  };

  const results = await Promise.all(
    possibleInstructorIds.map(async (id) => {
      const workHours = await prisma.workSchedule.findMany({
        where: { employeeId: id },
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
        where: { date, instructorId: id },
        select: { startTime: true, endTime: true },
      });

      return {
        id,
        isAvailable:
          availableForWorkHours(workHours as WorkHours[]) &&
          availableForLessons(lessons),
      };
    }),
  );

  return results;
});
