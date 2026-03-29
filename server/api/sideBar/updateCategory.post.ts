const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, enable } = body;

  try {
    const response = await prisma.sectionAISetting.update({
      where: { id },
      data: { enable },
    });

    console.log(response);

    return { success: true };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: "Failed to update category",
    });
  }
});
