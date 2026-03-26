import { usePrisma } from "../server/utils/prisma";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const prisma = usePrisma();

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
          },
          {
            key: "2_weeks",
            name: "2 недели",
          },
          {
            key: "1_month",
            name: "1 месяц",
          },
          {
            key: "3_months",
            name: "3 месяца",
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
          },
          {
            key: "areas",
            name: "Занятость площадок",
          },
          {
            key: "org_schedule",
            name: "График организации",
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
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
