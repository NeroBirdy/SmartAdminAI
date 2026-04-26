import { usePrisma } from "../server/utils/prisma";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { DayOfWeek } from "./generated/prisma/db1/client";

const prisma = usePrisma();

const makeTime = (hours: number, minutes: number) => {
  const date = new Date(0);
  date.setUTCHours(hours, minutes, 0, 0);
  return date;
};

async function main() {
  console.log("🌱 Seeding settings system...");

  // ========== 1. Создаем типы настроек ==========
  const settingTypes = {
    SINGLE_SELECT: await prisma.settingType.upsert({
      where: { key: "single_select" },
      update: {},
      create: {
        key: "single_select",
        name: "Одиночный выбор",
      },
    }),
    MULTI_SELECT: await prisma.settingType.upsert({
      where: { key: "multi_select" },
      update: {},
      create: {
        key: "multi_select",
        name: "Множественный выбор",
      },
    }),
    BOOLEAN: await prisma.settingType.upsert({
      where: { key: "boolean" },
      update: {},
      create: {
        key: "boolean",
        name: "Да/Нет",
      },
    }),
  };

  console.log("✅ Created setting types");

  // ========== 2. Создаем определения настроек ==========

  // Горизонт планирования (Single Select)
  const planningHorizon = await prisma.settingDefinition.create({
    data: {
      key: "schedule_planning_horizon",
      name: "Горизонт планирования",
      settingTypeId: settingTypes.SINGLE_SELECT.id,
      maxValues: 1,
      options: {
        create: [
          {
            key: "1_week",
            name: "1 неделя",
            sortOrder: 1,
          },
          {
            key: "2_weeks",
            name: "2 недели",
            sortOrder: 2,
          },
          {
            key: "1_month",
            name: "1 месяц",
            sortOrder: 3,
          },
          {
            key: "3_months",
            name: "3 месяца",
            sortOrder: 4,
          },
        ],
      },
    },
  });

  await prisma.settingDefinition.create({
    data: {
      key: "schedule_instructor_change_date",
      name: "Перенос даты и времени занятия инструктором",
      settingTypeId: settingTypes.BOOLEAN.id,
      maxValues: 1,
      options: {
        create: [
          {
            key: "on",
            name: "включено",
            sortOrder: 1,
          },
          {
            key: "off",
            name: "выключено",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.settingDefinition.create({
    data: {
      key: "schedule_instructor_change_venue",
      name: "Заменя площадки инструктором",
      settingTypeId: settingTypes.BOOLEAN.id,
      maxValues: 1,
      options: {
        create: [
          {
            key: "on",
            name: "включено",
            sortOrder: 1,
          },
          {
            key: "off",
            name: "выключено",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.settingDefinition.create({
    data: {
      key: "schedule_instructor_lesson_cancellation",
      name: "Отмена занятия инструктором",
      settingTypeId: settingTypes.BOOLEAN.id,
      maxValues: 1,
      options: {
        create: [
          {
            key: "on",
            name: "включено",
            sortOrder: 1,
          },
          {
            key: "off",
            name: "выключено",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.settingDefinition.create({
    data: {
      key: "schedule_instructor_change_instructor",
      name: "Замена инструктора",
      settingTypeId: settingTypes.BOOLEAN.id,
      maxValues: 1,
      options: {
        create: [
          {
            key: "on",
            name: "включено",
            sortOrder: 1,
          },
          {
            key: "off",
            name: "выключено",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.settingDefinition.create({
    data: {
      key: "schedule_extra_setting",
      name: "Дополнительные настройки",
      settingTypeId: settingTypes.MULTI_SELECT.id,
      maxValues: 2,
      options: {
        create: [
          {
            key: "notify_manager",
            name: "Уведомить руководителя",
            sortOrder: 1,
          },
          {
            key: "fix_reason",
            name: "Фиксировать причину",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  await prisma.settingDefinition.create({
    data: {
      key: "staff_extra_setting",
      name: "Дополнительные настройки",
      settingTypeId: settingTypes.MULTI_SELECT.id,
      maxValues: 3,
      options: {
        create: [
          {
            key: "notify_manager",
            name: "Уведомить руководителя",
            sortOrder: 1,
          },
          {
            key: "fix_reason",
            name: "Фиксировать причину",
            sortOrder: 2,
          },
          {
            key: "consider_instructor_schedule",
            name: "Учитывать график инструкторов",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  console.log("✅ Created schedule_planning_horizon setting");

  // Учитывать ресурсы (Multi Select)
  const considerResources = await prisma.settingDefinition.create({
    data: {
      key: "schedule_consider_resources",
      name: "При планировании учитывать",
      settingTypeId: settingTypes.MULTI_SELECT.id,
      maxValues: 3,
      options: {
        create: [
          {
            key: "instructors",
            name: "Занятость инструкторов",
            sortOrder: 1,
          },
          {
            key: "areas",
            name: "Занятость площадок",
            sortOrder: 2,
          },
          {
            key: "org_schedule",
            name: "График организации",
            sortOrder: 3,
          },
        ],
      },
    },
  });

  console.log("✅ Created schedule_consider_resources setting");

  const promptsToLoad = [
    {
      title: "Промпт к Рекомендациям",
      filePath: join(
        process.cwd(),
        "app",
        "assets",
        "prompts",
        "instructionRec.txt",
      ),
    },
    {
      title: "Промпт к Рискам",
      filePath: join(
        process.cwd(),
        "app",
        "assets",
        "prompts",
        "instructionRisk.txt",
      ),
    },
  ];

  for (const promptConfig of promptsToLoad) {
    try {
      const text = await readFile(promptConfig.filePath, "utf-8");

      await prisma.prompt.create({
        data: {
          title: promptConfig.title,
          text,
        },
      });

      console.log(`✅ Loaded: ${promptConfig.title}`);
    } catch (error) {
      console.error(`❌ Failed to load ${promptConfig.filePath}:`, error);
    }
  }

  try {
    await prisma.section.create({
      data: {
        name: "Конфетка",
      },
    });
  } catch (error) {
    console.error(`❌ Failed to load section:`, error);
  }

  try {
    await prisma.settingAI.createMany({
      data: [
        { name: "Управление расписанием" },
        { name: "Сопровождение клиентов" },
        { name: "Координация персонала" },
      ],
    });
  } catch (error) {
    console.error(`❌ Failed to create settingAI:`, error);
  }

  try {
    const settingAIs = await prisma.settingAI.findMany();

    await prisma.sectionAISetting.createMany({
      data: settingAIs.map((setting) => ({
        sectionId: 1,
        settingAIId: setting.id,
      })),
    });
  } catch (error) {
    console.error(`❌ Failed to create sectionAISettings:`, error);
  }

  await prisma.breaks.createMany({
    data: [
      { startTime: makeTime(12, 0), endTime: makeTime(12, 45) },
      { startTime: makeTime(13, 0), endTime: makeTime(14, 0) },
      { startTime: makeTime(13, 0), endTime: makeTime(16, 0) },
      { startTime: makeTime(13, 0), endTime: makeTime(16, 30) },
      { startTime: makeTime(13, 0), endTime: makeTime(13, 30) },
      { startTime: makeTime(13, 30), endTime: makeTime(14, 0) },
      { startTime: makeTime(14, 0), endTime: makeTime(15, 0) },
      { startTime: makeTime(14, 0), endTime: makeTime(14, 30) },
      { startTime: makeTime(14, 0), endTime: makeTime(14, 20) },
      { startTime: makeTime(15, 0), endTime: makeTime(17, 0) },
      { startTime: makeTime(15, 0), endTime: makeTime(15, 30) },
      { startTime: makeTime(15, 0), endTime: makeTime(15, 45) },
      { startTime: makeTime(16, 0), endTime: makeTime(16, 45) },
      { startTime: makeTime(16, 0), endTime: makeTime(18, 0) },
      { startTime: makeTime(16, 30), endTime: makeTime(16, 45) },
      { startTime: makeTime(17, 0), endTime: makeTime(17, 30) },
      { startTime: makeTime(17, 30), endTime: makeTime(18, 0) },
    ],
  });

  await prisma.workSchedule.createMany({
    data: [
      // id 1–7, org 1
      {
        dayOfWeek: DayOfWeek.MON,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        organizationId: 1,
      },
      {
        dayOfWeek: DayOfWeek.TUE,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        organizationId: 1,
      },
      {
        dayOfWeek: DayOfWeek.WED,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        organizationId: 1,
      },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        organizationId: 1,
      },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        organizationId: 1,
      },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(11, 0),
        endWork: makeTime(20, 0),
        organizationId: 1,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, organizationId: 1 },

      // id 8–14, venue 1
      {
        dayOfWeek: DayOfWeek.MON,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 1,
      },
      {
        dayOfWeek: DayOfWeek.TUE,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 1,
      },
      {
        dayOfWeek: DayOfWeek.WED,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 1,
      },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 1,
      },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 1,
      },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(11, 0),
        endWork: makeTime(20, 0),
        venueId: 1,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, venueId: 1 },

      // id 15–21, venue 2
      {
        dayOfWeek: DayOfWeek.MON,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 2,
      },
      {
        dayOfWeek: DayOfWeek.TUE,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 2,
      },
      {
        dayOfWeek: DayOfWeek.WED,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 2,
      },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 2,
      },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        venueId: 2,
      },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(11, 0),
        endWork: makeTime(20, 0),
        venueId: 2,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, venueId: 2 },

      // id 22–28, venue 3
      {
        dayOfWeek: DayOfWeek.MON,
        isWorkingDay: true,
        startWork: makeTime(9, 0),
        endWork: makeTime(18, 0),
        venueId: 3,
      },
      {
        dayOfWeek: DayOfWeek.TUE,
        isWorkingDay: true,
        startWork: makeTime(9, 0),
        endWork: makeTime(18, 0),
        venueId: 3,
      },
      { dayOfWeek: DayOfWeek.WED, isWorkingDay: false, venueId: 3 },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(9, 0),
        endWork: makeTime(18, 0),
        venueId: 3,
      },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(9, 0),
        endWork: makeTime(18, 0),
        venueId: 3,
      },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(11, 0),
        endWork: makeTime(17, 0),
        venueId: 3,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, venueId: 3 },

      // id 29–35, employee 2
      {
        dayOfWeek: DayOfWeek.MON,
        isWorkingDay: true,
        startWork: makeTime(9, 0),
        endWork: makeTime(18, 0),
        employeeId: 2,
      },
      {
        dayOfWeek: DayOfWeek.TUE,
        isWorkingDay: true,
        startWork: makeTime(9, 0),
        endWork: makeTime(18, 0),
        employeeId: 2,
      },
      {
        dayOfWeek: DayOfWeek.WED,
        isWorkingDay: true,
        startWork: makeTime(9, 0),
        endWork: makeTime(18, 0),
        employeeId: 2,
      },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(9, 0),
        endWork: makeTime(18, 0),
        employeeId: 2,
      },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(9, 0),
        endWork: makeTime(18, 0),
        employeeId: 2,
      },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(11, 0),
        endWork: makeTime(17, 0),
        employeeId: 2,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 2 },

      // id 36–42, employee 3
      {
        dayOfWeek: DayOfWeek.MON,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        employeeId: 3,
      },
      { dayOfWeek: DayOfWeek.TUE, isWorkingDay: false, employeeId: 3 },
      {
        dayOfWeek: DayOfWeek.WED,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        employeeId: 3,
      },
      { dayOfWeek: DayOfWeek.THU, isWorkingDay: false, employeeId: 3 },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(20, 0),
        employeeId: 3,
      },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(11, 0),
        endWork: makeTime(20, 0),
        employeeId: 3,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 3 },

      // id 43–49, employee 4
      {
        dayOfWeek: DayOfWeek.MON,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(12, 0),
        employeeId: 4,
      },
      {
        dayOfWeek: DayOfWeek.TUE,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(12, 0),
        employeeId: 4,
      },
      { dayOfWeek: DayOfWeek.WED, isWorkingDay: false, employeeId: 4 },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(12, 0),
        employeeId: 4,
      },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(12, 0),
        employeeId: 4,
      },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(11, 0),
        endWork: makeTime(15, 0),
        employeeId: 4,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 4 },

      // id 50–56, employee 5
      { dayOfWeek: DayOfWeek.MON, isWorkingDay: false, employeeId: 5 },
      {
        dayOfWeek: DayOfWeek.TUE,
        isWorkingDay: true,
        startWork: makeTime(12, 0),
        endWork: makeTime(20, 0),
        employeeId: 5,
      },
      {
        dayOfWeek: DayOfWeek.WED,
        isWorkingDay: true,
        startWork: makeTime(12, 0),
        endWork: makeTime(20, 0),
        employeeId: 5,
      },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(12, 0),
        endWork: makeTime(20, 0),
        employeeId: 5,
      },
      { dayOfWeek: DayOfWeek.FRI, isWorkingDay: false, employeeId: 5 },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(13, 0),
        endWork: makeTime(20, 0),
        employeeId: 5,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 5 },

      // id 57–63, employee 6
      {
        dayOfWeek: DayOfWeek.MON,
        isWorkingDay: true,
        startWork: makeTime(9, 30),
        endWork: makeTime(18, 30),
        employeeId: 6,
      },
      {
        dayOfWeek: DayOfWeek.TUE,
        isWorkingDay: true,
        startWork: makeTime(9, 30),
        endWork: makeTime(18, 30),
        employeeId: 6,
      },
      { dayOfWeek: DayOfWeek.WED, isWorkingDay: false, employeeId: 6 },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(9, 30),
        endWork: makeTime(18, 30),
        employeeId: 6,
      },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(9, 30),
        endWork: makeTime(18, 30),
        employeeId: 6,
      },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(11, 0),
        endWork: makeTime(16, 0),
        employeeId: 6,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 6 },

      // id 64–70, employee 7
      { dayOfWeek: DayOfWeek.MON, isWorkingDay: false, employeeId: 7 },
      { dayOfWeek: DayOfWeek.TUE, isWorkingDay: false, employeeId: 7 },
      {
        dayOfWeek: DayOfWeek.WED,
        isWorkingDay: true,
        startWork: makeTime(10, 0),
        endWork: makeTime(17, 0),
        employeeId: 7,
      },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(10, 0),
        endWork: makeTime(20, 0),
        employeeId: 7,
      },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(10, 0),
        endWork: makeTime(20, 0),
        employeeId: 7,
      },
      {
        dayOfWeek: DayOfWeek.SAT,
        isWorkingDay: true,
        startWork: makeTime(11, 0),
        endWork: makeTime(19, 0),
        employeeId: 7,
      },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 7 },

      // id 71–77, employee 8
      {
        dayOfWeek: DayOfWeek.MON,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(16, 0),
        employeeId: 8,
      },
      {
        dayOfWeek: DayOfWeek.TUE,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(16, 0),
        employeeId: 8,
      },
      {
        dayOfWeek: DayOfWeek.WED,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(16, 0),
        employeeId: 8,
      },
      {
        dayOfWeek: DayOfWeek.THU,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(16, 0),
        employeeId: 8,
      },
      {
        dayOfWeek: DayOfWeek.FRI,
        isWorkingDay: true,
        startWork: makeTime(8, 0),
        endWork: makeTime(16, 0),
        employeeId: 8,
      },
      { dayOfWeek: DayOfWeek.SAT, isWorkingDay: false, employeeId: 8 },
      { dayOfWeek: DayOfWeek.SUN, isWorkingDay: false, employeeId: 8 },
    ],
  });

  await prisma.workScheduleBreaks.createMany({
    data: [
      { workScheduleId: 8, breakId: 7 },
      { workScheduleId: 9, breakId: 7 },
      { workScheduleId: 10, breakId: 7 },
      { workScheduleId: 11, breakId: 7 },
      { workScheduleId: 12, breakId: 7 },
      { workScheduleId: 13, breakId: 12 },
      { workScheduleId: 15, breakId: 4 },
      { workScheduleId: 16, breakId: 4 },
      { workScheduleId: 17, breakId: 4 },
      { workScheduleId: 18, breakId: 4 },
      { workScheduleId: 19, breakId: 4 },
      { workScheduleId: 20, breakId: 14 },
      { workScheduleId: 22, breakId: 5 },
      { workScheduleId: 23, breakId: 5 },
      { workScheduleId: 25, breakId: 5 },
      { workScheduleId: 26, breakId: 5 },
      { workScheduleId: 27, breakId: 9 },
      { workScheduleId: 29, breakId: 2 },
      { workScheduleId: 30, breakId: 2 },
      { workScheduleId: 31, breakId: 2 },
      { workScheduleId: 32, breakId: 2 },
      { workScheduleId: 33, breakId: 2 },
      { workScheduleId: 34, breakId: 7 },
      { workScheduleId: 36, breakId: 3 },
      { workScheduleId: 38, breakId: 3 },
      { workScheduleId: 40, breakId: 3 },
      { workScheduleId: 41, breakId: 10 },
      { workScheduleId: 51, breakId: 13 },
      { workScheduleId: 52, breakId: 13 },
      { workScheduleId: 53, breakId: 13 },
      { workScheduleId: 55, breakId: 16 },
      { workScheduleId: 57, breakId: 6 },
      { workScheduleId: 57, breakId: 13 },
      { workScheduleId: 58, breakId: 6 },
      { workScheduleId: 58, breakId: 13 },
      { workScheduleId: 60, breakId: 6 },
      { workScheduleId: 60, breakId: 13 },
      { workScheduleId: 61, breakId: 6 },
      { workScheduleId: 61, breakId: 13 },
      { workScheduleId: 62, breakId: 6 },
      { workScheduleId: 66, breakId: 8 },
      { workScheduleId: 67, breakId: 8 },
      { workScheduleId: 67, breakId: 17 },
      { workScheduleId: 68, breakId: 8 },
      { workScheduleId: 68, breakId: 17 },
      { workScheduleId: 69, breakId: 11 },
      { workScheduleId: 71, breakId: 1 },
      { workScheduleId: 72, breakId: 1 },
      { workScheduleId: 73, breakId: 1 },
      { workScheduleId: 74, breakId: 1 },
      { workScheduleId: 75, breakId: 1 },
    ],
  });
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
