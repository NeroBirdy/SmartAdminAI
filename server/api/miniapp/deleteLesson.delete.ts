const fakeAPI = useFakeAPI();

import { VK, Keyboard } from "vk-io";
import { ChangeType } from "~~/prisma/generated/prisma/db1/enums";
const vk = new VK({ token: useRuntimeConfig().vkToken });

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const lessonId = Number(body.lessonId);
  const userId = Number(body.userId);

  const user = await getUser({ peerId: userId });
  const employee = await getEmployee(user?.key!);

  let res;

  try {
    res = await vk.api.messages.send({
      peer_id: userId,
      message: "Подождите",
      random_id: Date.now(),
    });

    await fakeAPI.lesson.delete({ where: { id: lessonId } });

    //LOG Отмена занятия
    await createLog(
      employee!.id,
      ChangeType.LESSON_CANCELLATION,
      { lessonId: lessonId },
      {},
    );

    await Promise.all([
      new Promise((resolve) => setTimeout(resolve, 2000)),
      vk.api.messages.edit({
        peer_id: userId,
        message_id: Number(res),
        message: "Занятие удалено",
      }),
    ]);
  } catch (e) {
    console.error("Ошибка удаления урока", e);

    await vk.api.messages.edit({
      peer_id: userId,
      message_id: Number(res),
      message: "Ошибка",
    });
  }
});
