const prisma = usePrisma();
const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const idsToDelete = body.idsToDelete;

    for (const id of idsToDelete) {
      await prisma.workSchedule.delete({ where: { id: Number(id) } });
    }
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
});
