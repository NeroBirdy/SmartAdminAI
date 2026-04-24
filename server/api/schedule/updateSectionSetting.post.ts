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
        "Требуется передать sectionId | settingDefinitionId | settingOptionId",
    });
  }

  try {
    const existingSetting = await prisma.sectionSetting.findFirst({
      where: {
        sectionId: sectionId,
        settingDefinitionId: settingDefinitionId,
      },
    });

    let updatedSectionSetting;

    if (existingSetting) {
      updatedSectionSetting = await prisma.sectionSetting.update({
        where: { id: existingSetting.id },
        data: {
          settingOptionId: settingOptionId,
        },
      });
    } else {
      updatedSectionSetting = await prisma.sectionSetting.create({
        data: {
          sectionId: sectionId,
          settingDefinitionId: settingDefinitionId,
          settingOptionId: settingOptionId,
        },
      });
    }

    const settingOption = await prisma.settingOption.findUnique({
      where: { id: settingOptionId },
    });

    if (!settingOption) {
      throw createError({
        statusCode: 404,
        message: "Опция настройки не найдена",
      });
    }

    return {
      id: updatedSectionSetting.id,
      option_name: settingOption.name,
      option_key: settingOption.key,
    };
  } catch (err) {
    console.error("Ошибка при обновлении настройки:", err);
    throw createError({
      statusCode: 500,
      message: `Не удалось создать/обновить sectionSetting`,
    });
  }
});
