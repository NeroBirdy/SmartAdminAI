export default defineEventHandler(async (event) => {
    const query = await getQuery(event);
    const lessonId = Number(query.lessonId);
    const userId = Number(query.userId);

    const keyboard = await buildConfirmKeyboard({cmd: "getAvailableInstructor", lessonId: lessonId});

    await sendMessage(userId, keyboard, "Отправить запрос совобным инструкторам?");
});