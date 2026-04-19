const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const sectionSettingId = body.id;

  if (!sectionSettingId) {
    throw createError({
      statusCode: 400,
      message: "Требуется передать sectionSettingId",
    });
  }

  try {
    await prisma.sectionSetting.delete({ where: { id: sectionSettingId } });
  } catch (err) {
    throw createError({
      statusCode: 404,
      message: `Не удалось удалить sectionSettring, id: ${sectionSettingId}`,
    });
  }
});
