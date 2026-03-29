const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { sectionId } = body;
  const sectionAISetting = await prisma.sectionAISetting.findMany({
    where: {
      sectionId: sectionId,
    },
  });
  return { categories: sectionAISetting };
});
