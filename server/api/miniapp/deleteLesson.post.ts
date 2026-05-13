export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const lessonId = Number(body.lessonId);
  const userId = Number(body.userId);

  const permission = await getPermission(userId);

  const id = await getUserIdByPeerId(userId);
  const randomId = generateRandomId(1, 1000000);

  if (permission.cancellationLesson) {
    const keyboard = await buildConfirmKeyboard(
      {
        cmd: "cancellationLesson",
        lessonId: lessonId,
        userId: userId,
        randomId: randomId,
      },
      { cmd: "denyCancellationLesson", randomId: randomId },
    );
    const messageId = await sendConfirmMessage(
      userId,
      keyboard,
      "Точно отменить?",
    );
    await saveNewMessage(id!, Number(messageId), randomId);
  } else {
    const keyboard = await buildConfirmKeyboard(
      {
        cmd: "requestCancellationLesson",
        lessonId: lessonId,
        userId: userId,
        randomId: randomId,
      },
      { cmd: "denyCancellationLesson", randomId: randomId },
    );
    const messageId = await sendConfirmMessage(
      userId,
      keyboard,
      "Точно отменить?",
    );
    await saveNewMessage(id!, Number(messageId), randomId);
  }
  return "ok";
});
