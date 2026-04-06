const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const sectionId = body.sectionId;
  const settingDefinitionId = body.settingDefinitionId;
  const settingOptionId = body.settingOptionId;

  if (!sectionId || !settingDefinitionId || !settingOptionId) {
    throw createError({
      statusCode: 400,
      message:
        "Требуется передать sectionSettingId | settingDefinitionId | settingOptionId",
    });
  }

  try {
    const newSectionSetting = await prisma.sectionSetting.create({
      data: {
        sectionId: sectionId,
        settingDefinitionId: settingDefinitionId,
        settingOptionId: settingOptionId,
      },
    });

    const settingOption = await prisma.settingOption.findUnique({
      where: { id: settingOptionId },
    });
    return {
      id: newSectionSetting.id,
      option_name: settingOption!.name,
      option_key: settingOption!.key,
    };
  } catch (err) {
    throw createError({
      statusCode: 404,
      message: `Не удалось создать sectionSettring`,
    });
  }
});
