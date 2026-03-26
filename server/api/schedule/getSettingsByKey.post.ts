const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { key, sectionId } = body;

  if (!key || !sectionId) {
    throw createError({
      statusCode: 400,
      message: "Требуется передать key и sectionId",
    });
  }

  const settingDefinition = await prisma.settingDefinition.findUnique({
    where: {
      key: key,
    },
  });

  if (!settingDefinition) {
    throw createError({
      statusCode: 404,
      message: `Настройка с ключом "${key}" не найдена`,
    });
  }

  const settingOptions = await prisma.settingOption.findMany({
    where: { settingDefinitionId: settingDefinition.id },
    orderBy: {
      name: "asc",
    },
  });

  const sectionSettingsPrisma = await prisma.sectionSetting.findMany({
    where: { sectionId: sectionId, settingDefinitionId: settingDefinition.id },
    include: { settingOption: true },
  });

  const sectionSettings = sectionSettingsPrisma.map((item) => ({
    id: item.id,
    option_name: item.settingOption.name,
    option_key: item.settingOption.key,
  }));

  return {
    setting: settingDefinition,
    options: settingOptions,
    sectionSettings: sectionSettings,
  };
});
