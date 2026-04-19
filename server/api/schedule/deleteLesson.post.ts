const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const lessonId = body.lessonId;

  try {
    await fakeAPI.lesson.delete({ where: { id: lessonId } });
    //ЛОГ
  } catch (e) {
    console.error("Ошибка удаления урока", e);
  }
});
