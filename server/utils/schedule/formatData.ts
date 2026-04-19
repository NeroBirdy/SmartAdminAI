import { markdownTable } from "markdown-table";

export {
  venueOrInstructorScheduleToMarkdown,
  orgScheduleToMardown,
  groupsToMarkdown,
  formatBreaks,
  formatWorkHours,
  formatTime,
  formatDays
};

type group = {
  id: number;
  instructor: {
    id: number;
  };
  defaultVenue: {
    id: number;
  };
  program: {
    id: number;
  };
};

type WorkHours = {
  dayOfWeek: string;
  isWorkingDay: boolean;
  startWork: string;
  endWork: string;
};

type Breaks = {
  startTime: string;
  endTime: string;
  dayOfWeek: string;
};

type VenueOrInstructorResult = {
  id: number;
  workHours: WorkHours[];
  breaks: Breaks[];
};

const days = <Record<string, string>>{
  MON: "Понедельник",
  TUE: "Вторник",
  WED: "Среда",
  THU: "Четверг",
  FRI: "Пятница",
  SAT: "Суббота",
  SUN: "Воскресенье",
};

const formatDays = (schedule: { dayOfWeek: string }[]) => {
  return schedule.map((s) => days[s.dayOfWeek]);
};

const venueOrInstructorScheduleToMarkdown = (items: VenueOrInstructorResult[]) => {
  const rows = items.flatMap((item) =>
    item.workHours.map((day: WorkHours) => {
      const breaks = item.breaks
        .filter((b: Breaks) => b.dayOfWeek === day.dayOfWeek)
        .map((b: Breaks) => `${b.startTime}-${b.endTime}`)
        .join(", ");

      return [
        String(item.id),
        days[day.dayOfWeek],
        day.isWorkingDay ? "Да" : "Нет",
        day.startWork ?? "-",
        day.endWork ?? "-",
        breaks || "-",
      ];
    }),
  );

  return markdownTable([
    ["ID", "День недели", "Рабочий", "Начало", "Конец", "Перерывы"],
    ...rows,
  ]);
};

const orgScheduleToMardown = (orgSchedules: WorkHours[]) => {
  return markdownTable([
    ["День недели", "Рабочий", "Начало", "Конец"],
    ...orgSchedules!.map((day) => [
      days[day.dayOfWeek],
      day.isWorkingDay ? "Да" : "Нет",
      day.startWork ?? "-",
      day.endWork ?? "-",
    ]),
  ]);
};

const groupsToMarkdown = (groups: group[]) => {
  return markdownTable([
    ["ID группы", "ID инструктора", "ID площадки", "ID программы"],
    ...groups!.map((group) => [
      String(group.id),
      String(group.instructor.id),
      String(group.defaultVenue.id),
      String(group.program.id),
    ]),
  ]);
};

const formatTime = (date: Date | null) => {
  if (!date) return null;
  return date.toISOString().substring(11, 16);
};

const formatWorkHours = (
  dataSet: { startWork: Date | null; endWork: Date | null }[],
) => {
  return dataSet.map((data) => ({
    ...data,
    startWork: formatTime(data.startWork),
    endWork: formatTime(data.endWork),
  }));
};

const formatBreaks = (
  breaks: { startTime: Date | null; endTime: Date | null }[],
) => {
  return breaks.map((b) => ({
    ...b,
    startTime: formatTime(b.startTime),
    endTime: formatTime(b.endTime),
  }));
};
