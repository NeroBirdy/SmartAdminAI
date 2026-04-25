import { addDays, startOfDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  getInstructorWorkHours,
  getInstructorBreaks,
  getVenueWorkHours,
  getVenueBreaks,
  getOrgSchedule,
} from "~~/server/utils/schedule/getData";
import { buildKeyboardForDate } from "~~/server/utils/vk/keyboardBuilder";

type OllamaResponse = {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
  model: string;
};

const filePath = join(
  process.cwd(),
  "app",
  "assets",
  "prompts",
  "newLessonDateSystemPrompt.txt",
);

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const lessonId = body.lessonId;
  const userId = body.userId;

  const lesson = await fakeAPI.lesson.findUnique({
    where: { id: lessonId },
    include: { group: { select: { organizationId: true } } },
  });
  const orgId = lesson?.group.organizationId;

  const instructor = await fakeAPI.employee.findUnique({
    where: { id: lesson?.instructorId },
    select: { id: true },
  });

  const instructorData = {
    id: instructor?.id!,
    workHours: await getInstructorWorkHours(instructor?.id!),
    breaks: await getInstructorBreaks(instructor?.id!),
  };

  const venue = await fakeAPI.venue.findUnique({
    where: { id: lesson?.venueId },
    select: { id: true },
  });

  const venueData = {
    id: venue?.id!,
    workHours: await getVenueWorkHours(venue?.id!),
    breaks: await getVenueBreaks(venue?.id!),
  };

  const orgSchedule = await getOrgSchedule(orgId!);

  const tomorrow = startOfDay(addDays(new Date(), 1));
  const endDate = startOfDay(addDays(tomorrow, 8));

  const lessonSchedule = await fakeAPI.lesson.findMany({
    where: {
      instructorId: instructor?.id,
      venueId: venue?.id,

      date: {
        gte: tomorrow,
        lt: endDate,
      },
    },
  });

  const formattedLessonSchedule = lessonSchedule.map((lesson) => ({
    ...lesson,
    date: lesson.date.toISOString().split("T")[0],
    startTime: formatInTimeZone(lesson.startTime, "UTC", "HH:mm"),
    endTime: formatInTimeZone(lesson.endTime, "UTC", "HH:mm"),
  }));

  let prompt = "Данные для переноса\n\n";
  prompt += "Урок\n";
  prompt += `${JSON.stringify(lesson)}\n`;
  prompt += "График инструктора\n";
  prompt += `${JSON.stringify(instructorData)}\n`;
  prompt += "График помещения\n";
  prompt += `${JSON.stringify(venueData)}\n`;
  prompt += "График организации\n";
  prompt += `${JSON.stringify(orgSchedule)}\n`;
  prompt += "Расписание на следующие 8 дней\n";
  prompt += `${JSON.stringify(formattedLessonSchedule)}\n`;
  prompt += "Пиши без комментариев";

  let res;

  res = await sendMessageWithoutKeyboard(userId, "Подождите");

  const response = await sendRequest(prompt);

  await editMessage(userId, Number(res), "Готово");

  const newDateList = JSON.parse(response);
  await saveDateList(userId, newDateList);

  const currentState = await getUserState(userId);
  const keyboard = await buildKeyboardForDate(userId, 0, currentState);

  await sendMessage(userId, keyboard, "Выберите дату и время");

  return newDateList;
});

const sendRequest = async (message: string) => {
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
