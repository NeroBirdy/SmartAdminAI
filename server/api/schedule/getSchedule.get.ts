import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const parsedOrgId = Number(query.orgId);
  const parsedDateFrom = new Date(String(query.dateFrom));
  const parsedDateTo = new Date(String(query.dateTo));
  const groupExceptions = query.groupExceptions
    ? [query.groupExceptions].flat().map(Number)
    : [];
  const venueExceptions = query.venueExceptions
    ? [query.venueExceptions].flat().map(Number)
    : [];

  const [allLessons, filteredLessons] = await Promise.all([
    fetchAllLessons(parsedOrgId, parsedDateFrom, parsedDateTo),
    fetchFilteredLessons(
      parsedOrgId,
      parsedDateFrom,
      parsedDateTo,
      groupExceptions,
      venueExceptions,
    ),
  ]);

  const { groups, colorMap } = buildGroups(allLessons);
  const venues = buildVenues(allLessons);
  const lessons = groupLessonsByDate(filteredLessons, colorMap);

  return { lessons, groups, venues };
});

const generateGroupColors = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const hue = (200 + (i * 360) / count) % 360;
    return `hsl(${hue}, 70%, 37%)`;
  });
};

const fetchAllLessons = (orgId: number, dateFrom: Date, dateTo: Date) =>
  fakeAPI.lesson.findMany({
    where: {
      group: { organizationId: orgId },
      date: { gte: dateFrom, lt: dateTo },
    },
    select: {
      group: { select: { id: true, name: true } },
      venue: { select: { id: true, name: true } },
    },
  });

const fetchFilteredLessons = (
  orgId: number,
  dateFrom: Date,
  dateTo: Date,
  groupExceptions: number[],
  venueExceptions: number[],
) =>
  fakeAPI.lesson.findMany({
    where: {
      group: { organizationId: orgId, id: { notIn: groupExceptions } },
      venue: { id: { notIn: venueExceptions } },
      date: { gte: dateFrom, lt: dateTo },
    },
    orderBy: {
      startTime: "asc",
    },
    include: {
      group: { select: { id: true, name: true } },
      venue: { select: { id: true, name: true } },
    },
  });

const buildGroups = (lessons: any[]) => {
  const uniqueGroups = [
    ...new Map(lessons.map((l) => [l.group.id, l.group])).values(),
  ];
  const colors = generateGroupColors(uniqueGroups.length);
  const colorMap = new Map<number, string>(
    uniqueGroups.map((g, i) => [g.id, colors[i] ?? "#cccccc"]),
  );
  const groups = uniqueGroups.map((g, i) => ({
    ...g,
    color: colors[i] || "#cccccc",
    venueId: lessons.find((l) => l.group.id === g.id)?.venue.id ?? 0,
  }));
  return { groups, colorMap };
};

const buildVenues = (lessons: any[]) => [
  ...new Map(lessons.map((l) => [l.venue.id, l.venue])).values(),
];

const groupLessonsByDate = (lessons: any[], colorMap: Map<number, string>) => {
  const result: Record<string, any[]> = {};
  for (const lesson of lessons) {
    if (!lesson.date) continue;
    const dateKey = format(new Date(lesson.date), "yyyy-MM-dd");
    if (!result[dateKey]) result[dateKey] = [];
    result[dateKey].push({
      id: lesson.id,
      startTime: formatInTimeZone(new Date(lesson.startTime), "UTC", "HH:mm"),
      endTime: formatInTimeZone(new Date(lesson.endTime), "UTC", "HH:mm"),
      group: lesson.group,
      venue: lesson.venue,
      color: colorMap.get(lesson.group.id) || "#cccccc",
    });
  }
  return result;
};
