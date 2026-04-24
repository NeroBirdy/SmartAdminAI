import { isWithinInterval, areIntervalsOverlapping, format } from "date-fns";

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

const datePickerId = Number(process.env.MINI_APP_ID);
const ownerGroupId = Number(process.env.OWNER_GROUP_ID);

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
  const userId = body.userId;

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
    select: {
      venue: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const availableVenues = programVenues
    .map((pv) => pv.venue)
    .filter((venue) => venue.id !== venueId);

  const availableForWorkHours = (workHours: WorkHours[]) => {
    const dayOfWeek = format(date!, "EEE").toUpperCase();
    const workDay = workHours.find((w) => w.dayOfWeek === dayOfWeek);

    if (!workDay || !workDay.isWorkingDay) return false;

    if (
      !isWithinInterval(startTime!, {
        start: workDay.startWork,
        end: workDay.endWork,
      }) ||
      !isWithinInterval(endTime!, {
        start: workDay.startWork,
        end: workDay.endWork,
      })
    )
      return false;

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
    availableVenues.map(async (venue) => {
      const workHours = await prisma.workSchedule.findMany({
        where: { venueId: venue.id },
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
        where: { date, venueId: venue.id },
        select: { startTime: true, endTime: true },
      });

      return {
        lessonId: lessonId,
        venueId: venue.id,
        venueName: venue.name,
        isAvailable:
          availableForWorkHours(workHours as WorkHours[]) &&
          availableForLessons(lessons),
      };
    }),
  );

  if (results.length === 0) {
    const keyboard = await buildKeyboardForMiniApp(userId, 'Календарь', datePickerId, ownerGroupId);

    await sendMessage(userId, keyboard, 'Нет доступных локаций');
    
  } else {
    await saveVenue(userId, results);
    const venueList = await createVenueList(userId);

    const keyboard = await buildKeyboard(userId, 1, "changeVenue");

    await sendMessage(userId, keyboard, "Выберите локацию для замены");
  }

  return results;
});
