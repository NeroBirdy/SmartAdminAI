import { measureMemory } from "node:vm";
import { format } from "date-fns";
import { VK, Keyboard } from "vk-io";

export {
  sendStartMessage,
  sendChooseCityMessage,
  sendLoginMessage,
  sendCompleteLoginMessage,
  sendHelloMessage,
  sendScheduleMenagementMessage,
  sendMessage,
  sendMessageWithoutKeyboard,
  editMessage,
  sendConfirmMessage,
  sendRequestForManager,
  sendChangeInstructorRequest,
  deleteMessage,
  sendGroupInfo,
  sendSubscriptionInfo,
  sendScheduleForClient,
};

const vk = new VK({ token: useRuntimeConfig().vkToken });

const datePickerId = Number(process.env.MINI_APP_ID);
const ownerGroupId = Number(process.env.OWNER_GROUP_ID);

async function sendStartMessage(peerId: number) {
  const keyboard = Keyboard.builder()
    .textButton({
      label: "Хочу записаться",
      color: Keyboard.POSITIVE_COLOR,
      payload: { cmd: "signup" },
    })
    .row()
    .textButton({
      label: "Войти в систему",
      color: Keyboard.PRIMARY_COLOR,
      payload: { cmd: "login" },
    })
    .oneTime();

  await vk.api.messages.send({
    peer_id: peerId,
    message: "Привет! Я умею много крутого и т. д. ... Нажми кнопку ниже 👇",
    keyboard,
    random_id: Math.floor(Math.random() * 1000000),
  });
  return "ok";
}

async function sendChooseCityMessage(peerId: number) {
  const keyboard = Keyboard.builder()
    .textButton({
      label: "Назад",
      color: Keyboard.POSITIVE_COLOR,
      payload: { cmd: "back" },
    })
    .oneTime();

  await vk.api.messages.send({
    peer_id: peerId,
    message: "В каком городе находится секция? Напишите город или его часть",
    keyboard,
    random_id: Math.floor(Math.random() * 1000000),
  });
  return "ok";
}

async function sendLoginMessage(peerId: number) {
  const keyboard = Keyboard.builder().textButton({
    label: "Назад",
    color: Keyboard.POSITIVE_COLOR,
    payload: { cmd: "back" },
  });

  await vk.api.messages.send({
    peer_id: peerId,
    message: "Введите ключ из личного кабинета",
    keyboard,
    random_id: Math.floor(Math.random() * 1000000),
  });
  return "ok";
}

async function sendCompleteLoginMessage(
  peerId: number,
  firstName: string,
  lastName: string,
) {
  await vk.api.messages.send({
    peer_id: peerId,
    message: `Вы вошли как ${firstName} ${lastName}`,
    random_id: Date.now(),
  });
  return true;
}

async function sendHelloMessage(peerId: number) {
  const role = await getUserRole(peerId);

  let keyboard = Keyboard.builder();

  let message;

  switch (role) {
    case "CLIENT":
      message = `Добро пожаловать в бот нашей детской секции! Мы рады, что вы выбрали нас для развития вашего ребёнка. Здесь вы сможете в пару кликов отслеживать расписание, абонементы, видеть прогресс юного спортсмена и задать вопросы. Так же я уведомлю вас о важных событиях и изменениях. Выберите нужный раздел!`;

      keyboard
        .textButton({ label: "Задать вопрос", payload: { cmd: "askQuestion" } })
        .row();
      keyboard
        .textButton({ label: "О моей группе", payload: { cmd: "groupInfo" } })
        .row();
      keyboard
        .textButton({
          label: "Абонемент",
          payload: { cmd: "subscriptionInfo" },
        })
        .row();
      keyboard
        .textButton({ label: "Расписание", payload: { cmd: "checkSchedule" } })
        .row();
      keyboard
        .textButton({
          label: "Сменить программу",
          payload: { cmd: "changeProgram" },
        })
        .row();
      break;

    case "INSTRUCTOR":
      message = `Здравствуйте, коллега! Добро пожаловать в рабочий кабинет инструктора. Этот бот создан, чтобы упростить вашу рутину! Управляйте и отслеживайте расписание, информируйте владельца и клиентов о важных событиях.`;

      keyboard
        .textButton({
          label: "Управление расписание",
          color: Keyboard.PRIMARY_COLOR,
          payload: { cmd: "scheduleManagement" },
        })
        .row()
        .applicationButton({
          label: "Моё расписание",
          appId: datePickerId,
          ownerId: ownerGroupId,
        })
        .row();
      break;

    case "MANAGER":
      message = `Уважаемый руководитель! Добро пожаловать в панель управления. Здесь собраны все инструменты для контроля бизнес-процессов: аналитика в реальном времени, управление командой и клиентами, рассылки и системные настройки.`;
      keyboard
        .textButton({
          label: "Управление расписание",
          color: Keyboard.PRIMARY_COLOR,
          payload: { cmd: "scheduleManagement" },
        })
        .row()
        .applicationButton({
          label: "Расписание",
          appId: datePickerId,
          ownerId: ownerGroupId,
        })
        .row();
      break;
  }

  keyboard.textButton({
    label: "Выйти из системы",
    color: Keyboard.POSITIVE_COLOR,
    payload: { cmd: "logout" },
  });

  return await vk.api.messages.send({
    peer_id: peerId,
    message: message,
    keyboard: keyboard,
    random_id: Date.now(),
  });
}

async function sendScheduleMenagementMessage(
  peerId: number,
  keyboard: Keyboard,
  text: string,
) {
  return await vk.api.messages.send({
    peer_id: peerId,
    message: text,
    keyboard: keyboard,
    random_id: Date.now(),
  });
}

async function sendMessage(peerId: number, keyboard: Keyboard, text: string) {
  return vk.api.messages.send({
    peer_id: peerId,
    message: text,
    keyboard: keyboard,
    random_id: Date.now(),
  });
}

async function sendMessageWithoutKeyboard(peerId: number, text: string) {
  return vk.api.messages.send({
    peer_id: peerId,
    message: text,
    random_id: Date.now(),
  });
}

async function editMessage(
  peerId: number,
  messageId: number,
  text: string,
  keyboard?: Keyboard,
) {
  return vk.api.messages.edit({
    peer_id: peerId,
    message_id: Number(messageId),
    message: text,
    keyboard: keyboard,
  });
}

async function sendConfirmMessage(
  peerId: number,
  keyboard: Keyboard,
  text: string,
) {
  return vk.api.messages.send({
    peer_id: peerId,
    message: text,
    keyboard: keyboard,
    random_id: Date.now(),
  });
}

async function sendRequestForManager(
  peerId: number,
  keyboard: Keyboard,
  text: string,
) {
  return vk.api.messages.send({
    peer_id: peerId,
    message: text,
    keyboard: keyboard,
    random_id: Date.now(),
  });
}

async function sendChangeInstructorRequest(
  peerId: number,
  peerIdList: number[],
  randomId: number,
  lessonId: number,
) {
  await sendMessageWithoutKeyboard(peerId, "Запрос отправлен");

  console.log(peerIdList)
  for (const id of peerIdList) {
    if (Number(id) !== 0) {
      const keyboard = await buildConfirmKeyboard(
        {
          cmd: "confirmChangeInstructor",
          ownerId: peerId,
          randomId: randomId,
          lessonId: lessonId,
        },
        { cmd: "deny", randomId: randomId, ownerId: peerId },
      );

      const res = await sendMessage(Number(id), keyboard, "Сможешь подменить?");
      const userId = await getUserIdByPeerId(id);

      await saveNewMessage(userId!, Number(res), randomId);
    }
  }
}

async function deleteMessage(messageId: number) {
  await vk.api.messages.delete({
    message_ids: messageId,
    delete_for_all: 1,
  });
}

async function sendGroupInfo(peerId: number) {
  const userKey = await getUserAccessCode(peerId);

  const group = await getClientGroup(userKey!);

  if (!group) {
    return await vk.api.messages.send({
      peer_id: peerId,
      random_id: Date.now(),
      message: "Вы еще не состоите в группе",
    });
  }

  const userSession = await getUserSession(peerId);

  return await vk.api.messages.send({
    peer_id: peerId,
    random_id: Date.now(),
    message: `Информация о вашей группе:\nНазвание организации: ${userSession.organization}\nПрограмма: ${userSession.program}\nГруппа: ${group.groupName}\nИнструктор: ${group.instructor}\nЛокация: ${group.venueName}, расположена по адресу ${group.venueAddress}`,
  });
}

async function sendSubscriptionInfo(peerId: number) {
  const userKey = await getUserAccessCode(peerId);

  const subscription = await getSubscriptionInfo(userKey!);

  if (!subscription) {
    return await vk.api.messages.send({
    peer_id: peerId,
    random_id: Date.now(),
    message: "Ваш абонемент не найден",
  });
  }

  let message = `Информация об абонементе \n`;
  message += `Тип: ${subscription.type}\n`;
  if (subscription.date) {
    message += `Действует до: ${subscription.date}\n`;
  }
  message += `Остаток посещений: ${subscription.remainingVisits}`;

  return await vk.api.messages.send({
    peer_id: peerId,
    random_id: Date.now(),
    message: message,
  });
}

async function sendScheduleForClient(peerId: number) {
  const userKey = await getUserAccessCode(peerId);

  const lessons = await getLessonsForClient(userKey!);

  if (!lessons) {
    return await vk.api.messages.send({
    peer_id: peerId,
    random_id: Date.now(),
    message: "Вы еще не состоите в группе",
  });
  }

  let message = `Расписание \n`;
  message += lessons
    .map(
      (lesson) =>
        `${format(lesson.date, "dd.MM")} - ${format(lesson.startTime, "HH.mm")}`,
    )
    .join("\n");

  return await vk.api.messages.send({
    peer_id: peerId,
    random_id: Date.now(),
    message: message,
  });
}
