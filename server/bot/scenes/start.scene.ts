import { StepScene } from "@vk-io/scenes";

export const startScene = new StepScene("start", [
  async (context) => {
    const keyboard = await buildStartKeyboard(context.peerId);

    context.session.state = "start";
    await saveUserState({peerId: context.peerId});

    await context.send({
      message: "Приветствую нового пользователя!\nЯ чат-бот WOLFIE и твой персональный помощник для работы с нашей системой. 👋\nЕсли ты уже с нами, скорей авторизовывайся!\nЛибо регистрируйся и занимайся любимым делом с удовольствием 🧩",
      keyboard: keyboard,
    });
    return context.scene.leave();
  },
]);
