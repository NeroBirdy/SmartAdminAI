export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const lessonId = Number(body.lessonId);
  const userId = Number(body.userId);

  const id = await getUserIdByPeerId(userId);
  const randomId = await generateRandomId(1, 1000000);

  const lessonDateTime = await getLessonDateTime(lessonId);
  const lessonInfo = await getInfoByLesson(lessonId);

  const keyboard = await buildConfirmKeyboard(
    { cmd: "getAvailableInstructor", lessonId: lessonId, randomId: randomId },
    { cmd: "denyGetAvailableInstructor", randomId: randomId },
  );

  const messageId = await sendMessage(
    userId,
    keyboard,
    `Отправить запрос совобным инструкторам?\n    Группа: ${lessonInfo?.group.name}\n    Дата: ${lessonDateTime}`,
  );
  await saveNewMessage(id!, Number(messageId)!, randomId);
});
