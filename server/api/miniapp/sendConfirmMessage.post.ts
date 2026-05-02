export default defineEventHandler(async (event) => {
    const query = await readBody(event);
    const lessonId = Number(query.lessonId);
    const userId = Number(query.userId);

    const id = await getUserIdByPeerId(userId);
    const randomId = await generateRandomId(1, 1000000);

    const keyboard = await buildConfirmKeyboard({cmd: "getAvailableInstructor", lessonId: lessonId, randomId: randomId}, {cmd: "cancelGetAvailableInstructor", randomId: randomId});

    const messageId =  await sendMessage(userId, keyboard, "Отправить запрос совобным инструкторам?");
    await saveNewMessage(id!, Number(messageId)!, randomId);
});