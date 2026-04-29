const fakeAPI = useFakeAPI();

import { VK, Keyboard } from "vk-io";
const vk = new VK({ token: useRuntimeConfig().vkToken });

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const lessonId = Number(query.lessonId);
  const userId = Number(query.userId);
  let res;

  try {
    res = await vk.api.messages.send({
      peer_id: userId,
      message: "Подождите",
      random_id: Date.now(),
    });

    await fakeAPI.lesson.delete({ where: { id: lessonId } });
    // ЛОГ

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
