const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const orgId = body.orgId;

  try {
    const setting = await prisma.sectionSetting.findFirst({
      where: {
        sectionId: orgId,
        settingDefinition: { is: { key: "schedule_planning_horizon" } },
      },
    });
    if (setting) {
      return { isHorizonPlanning: true };
    }
    return { isHorizonPlanning: false };
  } catch (e) {
    console.error("Ошибка получения горзинта планирования");
  }
});
