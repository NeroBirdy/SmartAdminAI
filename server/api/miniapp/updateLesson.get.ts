import { VK, Keyboard } from "vk-io";
const vk = new VK({ token: useRuntimeConfig().vkToken });

const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const lessonId = Number(query.lessonId);
  const userId = Number(query.userId);
  const venueId = Number(query.venueId);

  const user = await getUser({ peerId: userId });

  const employee = await getEmployee(user?.key!);

  let res;

  try {
    res = await vk.api.messages.send({
      peer_id: userId,
      message: "Подождите",
      random_id: Date.now(),
    });

    const lesson = await fakeAPI.lesson.findUnique({
      where: { id: lessonId },
    });

    const lessonFields = await getLessonFields(lessonId);
    const oldVenueFields = await getVenueFields(lesson!.venueId);
    const newVenueFields = await getVenueFields(venueId);

    await fakeAPI.lesson.update({
      where: { id: lessonId },
      data: {
        venueId: venueId,
      },
    });

    //LOG Смена помещения
    await createLog({
      entityType: "LESSON",
      entityId: lessonId,
      employeeId: employee!.id,
      changeType: "VENUE_CHANGE",
      oldValue: {
        ...lessonFields,
        ...oldVenueFields,
        change: { venueId: lesson!.venueId },
      },
      newValue: { ...newVenueFields, change: { venueId: venueId } },
    });

    await Promise.all([
      new Promise((resolve) => setTimeout(resolve, 2000)),
      vk.api.messages.edit({
        peer_id: userId,
        message_id: Number(res),
        message: "Занятие пройдет в другом месте",
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
