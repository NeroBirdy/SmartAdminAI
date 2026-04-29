const fakeAPI = useFakeAPI();

import { VK, Keyboard } from "vk-io";
const vk = new VK({ token: useRuntimeConfig().vkToken });

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const lessonId = body.lessonId;
  const userId = body.userId;

  const currentState = getUserState(userId);
  
  const permission = await getPermission(userId);

  if (permission.cancellationLesson) {
    const keyboard = await buildConfirmKeyboard({cmd: currentState, lessonId: lessonId, userId: userId});
    await sendConfirmMessage(userId, keyboard, "Точно отменить?");
  }
  else {
    const keyboard = await buildConfirmKeyboard({cmd: "requestCancellationLesson", lessonId: lessonId, userId: userId});
    await sendConfirmMessage(userId, keyboard, "Точно отменить?");
  }
});
