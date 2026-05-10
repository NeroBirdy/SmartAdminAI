import { ChangeType } from "~~/prisma/generated/prisma/db1/enums";
import { startOfMonth, endOfMonth, format } from "date-fns";
import { ru } from "date-fns/locale";
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
      display = [
        { title: "Занятие", text: o.lessonName },
        { title: "Группа", text: o.groupName },
      ];

      if (o.date !== n.date) {
        changes.push({
          title: "Дата",
          oldValue: formatDate(o.lessonDate),
          newValue: formatDate(n.lessonDate),
        });
      }
      if (o.startTime !== n.startTime) {
        changes.push({
          title: "Время",
          oldValue: formatTime(o.lessonStartTime),
          newValue: formatTime(n.lessonStartTime),
        });
      }

      break;
    }
    case "VENUE_CHANGE": {
      display = [
        { title: "Занятие", text: o.lessonName },
        { title: "Группа", text: o.groupName },
        {
          title: "Дата",
          text: formatLessonDate(o.lessonDate, o.lessonStartTime),
        },
      ];
      changes = [
        {
          title: "Площадка",
          oldValue: o.venueName,
          newValue: n.venueName,
        },
      ];

      break;
    }
    case "LESSON_CANCELLATION": {
      display = [
        { title: "Занятие", text: o.lessonName },
        { title: "Группа", text: o.groupName },
        {
          title: "Дата",
          text: formatLessonDate(o.lessonDate, o.lessonStartTime),
        },
      ];

      break;
    }
    case "INSTRUCTOR_CHANGE": {
      display = [
        { title: "Занятие", text: o.lessonName },
        { title: "Группа", text: o.groupName },
        {
          title: "Дата",
          text: formatLessonDate(o.lessonDate, o.lessonStartTime),
        },
      ];
      changes = [
        {
          title: "Инструктор",
          oldValue: `${o.employeeFirstName} ${o.empolyeeLastName}`,
          newValue: `${n.employeeFirstName} ${n.empolyeeLastName}`,
        },
      ];
      break;
    }
    case "LESSON_CREATE": {
      display = [
        { title: "Занятие", text: n.lessonName },
        { title: "Группа", text: n.groupName },
        {
          title: "Дата",
          text: formatLessonDate(n.lessonDate, n.lessonStartTime),
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
      display = [
        {
          title: "Клиент",
          text: formatName({
            firstName: o.clientFirstName,
            lastName: o.clientLastName,
          }),
        },
      ];
      changes = [
        {
          title: "Группа",
          oldValue: o.groupName,
          newValue: n.groupName,
        },
      ];

      break;
    }
    case "SCHEDULED_TRIAL_LESSON": {
      display = [
        { title: "Занятие", text: n.lessonName },
        {
          title: "Клиент",
          text: formatName({
            firstName: n.clientFirstName,
            lastName: n.clientLastName,
          }),
        },
        { title: "Группа", text: n.groupName },
        {
          title: "Дата",
          text: formatLessonDate(n.lessonDate, n.lessonStartTime),
        },
      ];

      break;
    }
    case "SELECTION_INSTRUCTOR_CHANGE": {
      display = [
        { title: "Занятие", text: n.lessonName },
        { title: "Группа", text: n.groupName },
        {
          title: "Дата",
          text: formatLessonDate(n.lessonDate, n.lessonStartTime),
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
