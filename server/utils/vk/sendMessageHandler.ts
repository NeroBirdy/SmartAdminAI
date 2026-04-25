import { VK, Keyboard } from "vk-io";

export {
  sendStartMessage,
  sendChooseCityMessage,
  sendLoginMessage,
  sendChooseOrganizationKeyboard,
  sendCompleteLoginMessage,
  sendHelloMessage,
  sendScheduleMenagementMessage,
  sendMessage,
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
  const keyboard = Keyboard.builder().textButton({
    label: "Назад",
    color: Keyboard.POSITIVE_COLOR,
    payload: { cmd: "back" },
  });

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

async function sendChooseOrganizationKeyboard(peerId: number) {
  const organizationsList = await getUserOrganizationsList(peerId);

  const keyboard = await buildKeyboard(peerId, 1, "choose_organization");
  await vk.api.messages.send({
    peer_id: peerId,
    message: "Выберите организацию",
    keyboard: keyboard,
    random_id: Date.now(),
  });
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
            label: 'Моё расписание', appId: datePickerId, ownerId: ownerGroupId
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
            label: 'Расписание', appId: datePickerId, ownerId: ownerGroupId
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

async function sendMessage(
  peerId: number,
  keyboard: Keyboard,
  text: string
) {
  return vk.api.messages.send({
    peer_id: peerId,
    message: text,
    keyboard: keyboard,
    random_id: Date.now(),
  });
}
