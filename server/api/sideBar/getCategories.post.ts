const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { sectionId } = body;
  let sectionAISetting = await prisma.sectionAISetting.findMany({
    where: {
      sectionId: sectionId,
    },
  });
  if (!sectionAISetting.length) {
    const ids = [1, 2, 3];

    await prisma.sectionAISetting.createMany({
      data: ids.map((id) => ({
        sectionId,
        settingAIId: id,
        enable: false,
      })),
    });

    sectionAISetting = await prisma.sectionAISetting.findMany({
      where: { sectionId },
    });
  }
  return { categories: sectionAISetting };
});
