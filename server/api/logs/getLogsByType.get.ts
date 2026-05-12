import { ChangeType, LogStatus } from "~~/prisma/generated/prisma/db1/enums";
import { startOfMonth, endOfMonth } from "date-fns";
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
  originalType?: ChangeType | null;
  changeType: ChangeType;
  status: LogStatus;
  employee: { firstName: string; lastName: string } | null;
  display: DisplayField[];
  changes: ChangeField[];
  createdAt: Date;
};

type Builder = (
  o: any,
  n: any,
) => { display: DisplayField[]; changes: ChangeField[] };
type FieldExtractor = (v: any) => string;

const prisma = usePrisma();
const fakeAPI = useFakeAPI();

const fieldExtractors: Record<string, FieldExtractor> = {
  Занятие: (v) => v.lessonName,
  Группа: (v) => v.groupName,
  Дата: (v) => formatLessonDate(v.lessonDate, v.lessonStartTime),
  Клиент: (v) =>
    formatName({ firstName: v.clientFirstName, lastName: v.clientLastName }),
  Площадка: (v) => v.venueName,
  Инструктор: (v) => `${v.employeeFirstName} ${v.empolyeeLastName}`,
};

function buildDisplay(fields: string[], v: any): DisplayField[] {
  return fields.map((title) => ({ title, text: fieldExtractors[title]!(v) }));
}

function buildChanges(fields: string[], o: any, n: any): ChangeField[] {
  return fields.map((title) => ({
    title,
    oldValue: fieldExtractors[title]!(o),
    newValue: fieldExtractors[title]!(n),
  }));
}

function dateChanges(o: any, n: any): ChangeField[] {
  const changes: ChangeField[] = [];
  if (o.lessonDate !== n.lessonDate) {
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
  return changes;
}

const builders: Partial<Record<ChangeType, Builder>> = {
  DATE_CHANGE: (o, n) => ({
    display: buildDisplay(["Занятие", "Группа"], o),
    changes: dateChanges(o, n),
  }),
  VENUE_CHANGE: (o, n) => ({
    display: buildDisplay(["Занятие", "Группа", "Дата"], o),
    changes: buildChanges(["Площадка"], o, n),
  }),
  LESSON_CANCELLATION: (o, n) => ({
    display: buildDisplay(["Занятие", "Группа", "Дата"], o),
    changes: [
      {
        title: "Статус",
        oldValue: null,
        newValue: n.lessonStatus == "ACTUAL" ? "Актуален" : "Удалён",
      },
    ],
  }),
  INSTRUCTOR_CHANGE: (o, n) => ({
    display: buildDisplay(["Занятие", "Группа", "Дата"], o),
    changes: buildChanges(["Инструктор"], o, n),
  }),
  LESSON_CREATE: (_o, n) => ({
    display: buildDisplay(["Занятие", "Группа", "Дата"], n),
    changes: [
      {
        title: "Статус",
        oldValue: null,
        newValue: n.lessonStatus == "ACTUAL" ? "Создан" : "Удалён",
      },
    ],
  }),
  QUESTION_ANSWER: (_o, n) => ({
    display: buildDisplay(["Клиент"], n),
    changes: [
      { title: "Вопрос", oldValue: n.question, newValue: null },
      { title: "Ответ", oldValue: null, newValue: n.answer },
    ],
  }),
  ASSIGNED_TO_GROUP: (o, n) => ({
    display: buildDisplay(["Клиент"], o),
    changes: buildChanges(["Группа"], o, n),
  }),
  SCHEDULED_TRIAL_LESSON: (_o, n) => ({
    display: buildDisplay(["Занятие", "Клиент", "Группа", "Дата"], n),
    changes: [],
  }),
  SELECTION_INSTRUCTOR_CHANGE: (_o, n) => ({
    display: buildDisplay(["Занятие", "Группа", "Дата"], n),
    changes: [],
  }),
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const type = query.type as ChangeType;
  const chosenCategories = (
    Array.isArray(query.chosenCategories)
      ? query.chosenCategories
      : [query.chosenCategories]
  ) as ChangeType[];

  const now = new Date();

  let logsDB = [];

  if (type === "LOG_ROLLBACK") {
    logsDB = await prisma.log.findMany({
      where: {
        changeType: type,
        originalChangeType: { in: chosenCategories },
        createdAt: {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        },
      },
    });
  } else {
    logsDB = await prisma.log.findMany({
      where: {
        changeType: type,
        createdAt: {
          gte: startOfMonth(now),
          lte: endOfMonth(now),
        },
      },
    });
  }

  return Promise.all(logsDB.map(buildLog));
});

async function buildLog(log: Log): Promise<LogResult> {
  const employee = log.employeeId ? await getEmployee(log.employeeId) : null;
  const o = log.oldValue as Record<string, any>;
  const n = log.newValue as Record<string, any>;

  let display: DisplayField[] = [];
  let changes: ChangeField[] = [];

  const originalChangeType = log.originalChangeType;

  let type =
    log.changeType === "LOG_ROLLBACK" ? originalChangeType! : log.changeType;

  const builder = builders[type];
  if (builder) {
    ({ display, changes } = builder(o, n));
  }

  return {
    id: log.id,
    changeType: log.changeType,
    originalType: log.originalChangeType,
    createdAt: log.createdAt,
    status: log.status,
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

function formatName(v: { firstName: string; lastName: string }) {
  return `${v.firstName} ${v.lastName}`;
}

async function getEmployee(id: number) {
  const employee = await fakeAPI.employee.findUnique({ where: { id } });
  return { firstName: employee!.firstName, lastName: employee!.lastName };
}
