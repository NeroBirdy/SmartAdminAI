import { ChangeType } from "~~/prisma/generated/prisma/db1/enums";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ru, tr } from "date-fns/locale";
import { Log } from "~~/prisma/generated/prisma/db1/client";
import { formatInTimeZone } from "date-fns-tz";

type DisplayField = { title: string; text: string };
type ChangeField = {
  title: string;
  oldValue: string | null;
  newValue: string | null;
};

type LogResult = {
  id: number;
  changeType: ChangeType;
  employee: { firstName: string; lastName: string } | null;
  display: DisplayField[];
  changes: ChangeField[];
  createdAt: Date;
};

const prisma = usePrisma();
const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const type = query.type as ChangeType;

  const now = new Date();

  const logsDB = await prisma.log.findMany({
    where: {
      changeType: type,
      createdAt: {
        gte: startOfMonth(now),
        lte: endOfMonth(now),
      },
    },
  });

  const logs = Promise.all(logsDB.map(buildLog));

  return logs;
});

async function buildLog(log: Log): Promise<LogResult> {
  const employee = log.employeeId ? await getEmployee(log.employeeId) : null;
  const o = log.oldValue as Record<string, any>;
  const n = log.newValue as Record<string, any>;

  let display: DisplayField[] = [];
  let changes: ChangeField[] = [];

  switch (log.changeType) {
    case "DATE_CHANGE": {
      const lesson = await getLesson(n.lessonId);
      display = [
        { title: "Занятие", text: lesson!.program.name },
        { title: "Группа", text: lesson!.group.name },
      ];

      if (o.date !== n.date) {
        changes.push({
          title: "Дата",
          oldValue: formatDate(o.date),
          newValue: formatDate(n.date),
        });
      }
      if (o.startTime !== n.startTime) {
        changes.push({
          title: "Время",
          oldValue: formatTime(o.startTime),
          newValue: formatTime(n.startTime),
        });
      }

      break;
    }
    case "VENUE_CHANGE": {
      const lesson = await getLesson(n.lessonId);
      const oldVenue = await getVenue(o.venueId);
      const newVenue = await getVenue(n.venueId);
      display = [
        { title: "Занятие", text: lesson!.program.name },
        { title: "Группа", text: lesson!.group.name },
        {
          title: "Дата",
          text: formatLessonDate(lesson!.date, lesson!.startTime),
        },
      ];
      changes = [
        {
          title: "Площадка",
          oldValue: oldVenue!.name,
          newValue: newVenue!.name,
        },
      ];

      break;
    }
    case "LESSON_CANCELLATION": {
      const lesson = await getLesson(o.lessonId);

      display = [
        { title: "Занятие", text: lesson!.program.name },
        { title: "Группа", text: lesson!.group.name },
        {
          title: "Дата",
          text: formatLessonDate(lesson!.date, lesson!.startTime),
        },
      ];

      break;
    }
    case "INSTRUCTOR_CHANGE": {
      const lesson = await getLesson(n.lessonId);
      const oldInstructor = await getEmployee(o.instructorId);
      const newInstructor = await getEmployee(n.instructorId);

      display = [
        { title: "Занятие", text: lesson!.program.name },
        { title: "Группа", text: lesson!.group.name },
        {
          title: "Дата",
          text: formatLessonDate(lesson!.date, lesson!.startTime),
        },
      ];
      changes = [
        {
          title: "Инструктор",
          oldValue: formatName(oldInstructor),
          newValue: formatName(newInstructor),
        },
      ];
      break;
    }
    case "LESSON_CREATE": {
      const lesson = await getLesson(n.id ?? n.lessonId);
      display = [
        { title: "Занятие", text: lesson!.program.name },
        { title: "Группа", text: lesson!.group.name },
        {
          title: "Дата",
          text: formatLessonDate(lesson!.date, lesson!.startTime),
        },
      ];

      break;
    }
    case "QUESTION_ANSWER": {
      changes = [
        { title: "Вопрос", oldValue: n.question, newValue: null },
        { title: "Ответ", oldValue: null, newValue: n.answer },
      ];

      break;
    }
    case "ASSIGNED_TO_GROUP": {
      const oldGroup = o.groupId ? await getGroup(o.groupId) : null;
      const newGroup = n.groupId ? await getGroup(n.groupId) : null;
      display = [{ title: "Клиент", text: `${n.firstName} ${n.lastName}` }];
      changes = [
        {
          title: "Группа",
          oldValue: oldGroup?.name ?? "не распределен",
          newValue: newGroup?.name ?? "не распределен",
        },
      ];

      break;
    }
    case "SCHEDULED_TRIAL_LESSON": {
      const lesson = await getLesson(n.lessonId);
      const client = await getClient(n.clientId);
      display = [
        { title: "Занятие", text: lesson!.program.name },
        {
          title: "Клиент",
          text: formatName({
            firstName: client!.firstName,
            lastName: client!.lastName,
          }),
        },
        { title: "Группа", text: lesson!.group.name },
        {
          title: "Дата",
          text: formatLessonDate(lesson!.date, lesson!.startTime),
        },
      ];

      break;
    }
    case "SELECTION_INSTRUCTOR_CHANGE": {
      const lesson = await getLesson(n.id ?? n.lessonId);
      display = [
        { title: "Занятие", text: lesson!.program.name },
        { title: "Группа", text: lesson!.group.name },
        {
          title: "Дата",
          text: formatLessonDate(lesson!.date, lesson!.startTime),
        },
      ];

      break;
    }
  }

  return {
    id: log.id,
    changeType: log.changeType,
    createdAt: log.createdAt,
    employee,
    display,
    changes,
  };
}

function formatDate(date: Date) {
  return formatInTimeZone(new Date(date), "UTC", "dd.MM.yyyy");
}

function formatLessonDate(d: Date, startTime: Date) {
  const date = formatInTimeZone(new Date(d), "UTC", "dd.MM.yyyy");
  const time = formatInTimeZone(new Date(startTime), "UTC", "HH:mm");
  return `${date}, ${time}`;
}

function formatTime(time: Date) {
  return formatInTimeZone(new Date(time), "UTC", "HH:mm");
}

function formatName(employee: { firstName: string; lastName: string }) {
  return `${employee.firstName} ${employee.lastName}`;
}

async function getEmployee(id: number) {
  const employee = await fakeAPI.employee.findUnique({ where: { id } });

  return { firstName: employee!.firstName, lastName: employee!.lastName };
}

async function getLesson(id: number) {
  const lesson = await fakeAPI.lesson.findUnique({
    where: { id },
    include: { group: true, program: true },
  });

  return lesson;
}

async function getClient(id: number) {
  const client = await fakeAPI.client.findUnique({ where: { id } });

  return client;
}

async function getGroup(id: number) {
  const group = await fakeAPI.group.findUnique({ where: { id } });

  return group;
}

async function getVenue(id: number) {
  const venue = await fakeAPI.venue.findUnique({ where: { id } });

  return venue;
}
