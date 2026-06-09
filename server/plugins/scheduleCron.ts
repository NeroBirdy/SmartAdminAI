import { Cron } from "croner";

const prisma = usePrisma();
const fakeAPI = useFakeAPI();

export default defineNitroPlugin(async () => {
  new Cron("0 18 * * *", { timezone: "Asia/Yekaterinburg" }, async () => {
    console.log(
      `[CRON] Запуск генерации расписания: ${new Date().toISOString()}`,
    );
    try {
      const orgs = await fakeAPI.organization.findMany({
        select: { id: true, name: true },
      });
      console.log(`[CRON] Найдено организаций: ${orgs.length}`);

      for (const org of orgs) {
        try {
          console.log(`[CRON] Обработка орг. ${org.id} (${org.name})...`);
          const availableGenerate = await checkBeforeGenerate(org.id);
          if (availableGenerate) {
            const checkForLesson = await checkForLessons(org.id);
            if (checkForLesson) {
              await generateScheduleForOrg(org.id);
            }
          }
          console.log(`[CRON] Орг. ${org.id} — готово`);
        } catch (err) {
          console.error(`[CRON] Орг. ${org.id} — ошибка:`, err);
        }
      }
      console.log("[CRON] Все организации обработаны");
    } catch (err) {
      console.error("[CRON] Критическая ошибка:", err);
    }
  });

  console.log(
    "[CRON] Планировщик запущен — генерация расписания каждый день в 18:00",
  );
});

async function checkBeforeGenerate(orgId: number) {
  const generateSetting = await prisma.sectionAISetting.findFirst({
    where: {
      settingAIId: 1,
      sectionId: orgId,
    },
    select: { enable: true },
  });
  const horizonPlanning = await prisma.sectionSetting.findFirst({
    where: { settingDefinitionId: 1, sectionId: orgId },
  });

  return horizonPlanning && generateSetting?.enable;
}

async function checkForLessons(orgId: number) {
  const horizonPlanning = await prisma.sectionSetting.findFirst({
    where: { settingDefinitionId: 1, sectionId: orgId },
    select: { settingOption: true },
  });

  if (!horizonPlanning?.settingOption) return false;

  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate() + 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = getHorizonEnd(horizonPlanning.settingOption.key);

  const lessons = await fakeAPI.lesson.findMany({
    where: {
      group: { organizationId: orgId },
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
  });

  return lessons.length === 0;
}

function getHorizonEnd(key: string): Date {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  switch (key) {
    case "1_week":
      end.setDate(end.getDate() + 7);
      break;
    case "2_weeks":
      end.setDate(end.getDate() + 14);
      break;
    case "1_month":
      end.setMonth(end.getMonth() + 1);
      break;
    case "3_months":
      end.setMonth(end.getMonth() + 3);
      break;
  }

  return end;
}
