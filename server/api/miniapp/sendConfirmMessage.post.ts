export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const lessonId = Number(body.lessonId);
  const userId = Number(body.userId);

  const id = await getUserIdByPeerId(userId);
  const randomId = await generateRandomId(1, 1000000);

  const keyboard = await buildConfirmKeyboard(
    { cmd: "getAvailableInstructor", lessonId: lessonId, randomId: randomId },
    { cmd: "cancelGetAvailableInstructor", randomId: randomId },
  );

  const messageId = await sendMessage(
    userId,
    keyboard,
    "Отправить запрос совобным инструкторам?",
  );
  await saveNewMessage(id!, Number(messageId)!, randomId);
});
