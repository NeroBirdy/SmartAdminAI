import { readFile } from "node:fs/promises";
import { join } from "node:path";
import JSON5 from "json5";

import { collectData } from "~~/server/utils/schedule/getData";

import {
  venueOrInstructorScheduleToMarkdown,
  formatDays,
  orgScheduleToMardown,
  groupsToMarkdown,
} from "../../utils/schedule/formatData";

const fakeAPI = useFakeAPI();

const filePath = join(
  process.cwd(),
  "app",
  "assets",
  "prompts",
  "scheduleSystemPrompt.txt",
);

type OllamaResponse = {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  model: string;
};

type VenueOrInstructorResult = {
  id: number;
  workHours: WorkHours[];
  breaks: Breaks[];
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

type Lesson = {
  date: string;
  startTime: string;
  endTime: string;
  groupId: string | number;
  instructorId: string | number;
  programId: string | number;
  venueId: string | number;
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const orgId = body.orgId;

  const data = await collectData(orgId);

  const prompt = buildPrompt(data);

  const response = await sendMessage(prompt);

  return await saveLessons(response);
});

const sendMessage = async (message: string) => {
  const systemPrompt = await readFile(filePath, "utf-8");

  const response = await $fetch<OllamaResponse>(
    "http://localhost:11434/api/chat",
    {
      method: "POST",
      body: {
        model: "gpt-oss:120b-cloud",
        think: "medium",
        stream: false,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
    },
  );
  return response.message.content;
};

const buildPrompt = (data: Awaited<ReturnType<typeof collectData>>) => {
  const {
    notWorkingDays,
    horizonPlanning,
    groups,
    instructorsCount,
    venuesCount,
    groupsCount,
    instructorsResult,
    venuesResult,
    orgSchedules,
  } = data;

  let prompt = `## Входные данные для генерации\n\n`;
  prompt += `Текущая дата: ${new Date("2026-05-04").toLocaleDateString("ru-RU")}\n`;
  // prompt += `Текущая дата: ${new Date().toLocaleDateString("ru-RU")}\n`;
  prompt += `Горизонт планирования: ${horizonPlanning}\n`;
  prompt += `Количество групп: ${groupsCount}\n`;
  prompt += `Количество площадок: ${venuesCount}\n`;
  prompt += `Количество инструкторов: ${instructorsCount}\n`;
  prompt += `Не рабочие дни организации: ${formatDays(notWorkingDays!)}\n`;

  if (orgSchedules) {
    const orgSchedulesTable = orgScheduleToMardown(orgSchedules as WorkHours[]);
    prompt += `График работы организации: ${orgSchedulesTable}\n`;
  }

  if (venuesResult) {
    const venuesTable = venueOrInstructorScheduleToMarkdown(
      venuesResult as VenueOrInstructorResult[],
    );
    prompt += `График работы площадок: ${venuesTable}\n`;
  }

  if (instructorsResult) {
    const instructorsTable = venueOrInstructorScheduleToMarkdown(
      instructorsResult as VenueOrInstructorResult[],
    );
    prompt += `График работы инструкторов: ${instructorsTable}\n`;
  }

  if (groups) {
    const groupsTable = groupsToMarkdown(groups);
    prompt += `Информация о группах: ${groupsTable}\n`;
  }

  prompt += `Напиши полное расписание, не маленький кусочек\n`;
  prompt += `Не пиши комментарии и примечаний`;

  return prompt;
};

const parseDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, day!));
};

const parseLesson = (lesson: Lesson) => {
  const [startHours, startMinutes] = lesson.startTime.split(":").map(Number);
  const [endHours, endMinutes] = lesson.endTime.split(":").map(Number);

  return {
    date: parseDate(lesson.date),
    startTime: makeTime(startHours!, startMinutes!),
    endTime: makeTime(endHours!, endMinutes!),
    groupId: Number(lesson.groupId),
    instructorId: Number(lesson.instructorId),
    programId: Number(lesson.programId),
    venueId: Number(lesson.venueId),
  };
};

const saveLessons = async (content: string) => {
  const lessons = stringToJson(content);
  const formattedLessons = lessons.map(parseLesson);

  try {
    await fakeAPI.lesson.createMany({ data: formattedLessons });
    return { success: true };
  } catch (e) {
    return lessons;
  }
};

const makeTime = (hours: number, minutes: number) => {
  const date = new Date(0);
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
};

const stringToJson = (message: string) => {
  const match = message.match(/\[[\s\S]*\]/);
  if (match) {
    try {
      const lessons = JSON5.parse(match[0]);
      return lessons;
    } catch (e) {
      console.error("Ошибка парсинка респонса", message);
    }
  }
};
