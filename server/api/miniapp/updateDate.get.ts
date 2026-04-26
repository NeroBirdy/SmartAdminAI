import { fromZonedTime } from "date-fns-tz";

const fakeAPI = useFakeAPI();

import { VK, Keyboard } from "vk-io";
const vk = new VK({ token: useRuntimeConfig().vkToken });

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const lessonId = Number(query.lessonId);
  const userId = Number(query.userId);

  const date = query.date as string;
  const startTime = query.startTime as string;
  const endTime = query.endTime as string;

  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);

    const d = new Date();
    d.setUTCHours(hours!, minutes, 0, 0);

    return d;
  };

  const dateObj = new Date(date);
  const utcDateObj = new Date(
    Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()),
  );

  const startTimeObj = parseTime(startTime);
  const endTimeObj = parseTime(endTime);

  console.log(startTimeObj);
  console.log(endTimeObj);
  console.log(date);
  console.log(dateObj);
  console.log(utcDateObj);

  let res;

  try {
    res = await vk.api.messages.send({
      peer_id: userId,
      message: "Подождите",
      random_id: Date.now(),
    });

    await fakeAPI.lesson.update({
      where: { id: lessonId },
      data: {
        date: utcDateObj,
        startTime: startTimeObj,
        endTime: endTimeObj,
      },
    });
    // ЛОГ

    await Promise.all([
      new Promise((resolve) => setTimeout(resolve, 2000)),
      vk.api.messages.edit({
        peer_id: userId,
        message_id: Number(res),
        message: "Занятие пройдет в другое время",
      }),
    ]);
  } catch (e) {
    console.error("Ошибка обновления урока", e);

    await vk.api.messages.edit({
      peer_id: userId,
      message_id: Number(res),
      message: "Ошибка",
    });
  }
});
