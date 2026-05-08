import { VK, Keyboard } from "vk-io";
import { format } from "date-fns";
import { ChangeType } from "~~/prisma/generated/prisma/db1/client";
const vk = new VK({ token: useRuntimeConfig().vkToken });

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const lessonId = Number(query.lessonId);
  const userId = Number(query.userId);

  const user = await prisma.users.findFirst({ where: { peerId: userId } });
  const employee = await getEmployee(user?.key!);

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

  let res;

  try {
    res = await vk.api.messages.send({
      peer_id: userId,
      message: "Подождите",
      random_id: Date.now(),
    });

    const oldLesson = await fakeAPI.lesson.findUnique({
      where: { id: lessonId },
    });

    const newLesson = await fakeAPI.lesson.update({
      where: { id: lessonId },
      data: {
        date: utcDateObj,
        startTime: startTimeObj,
        endTime: endTimeObj,
      },
    });

    //LOG Перенос занятия на другую дату
    await createLog(
      employee!.id,
      ChangeType.DATE_CHANGE,
      {
        id: oldLesson?.id,
        date: format(oldLesson?.date!, "dd.MM.yyyy"),
      },
      {
        id: newLesson?.id,
        date: format(newLesson?.date!, "dd.MM.yyyy"),
      },
    );

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
