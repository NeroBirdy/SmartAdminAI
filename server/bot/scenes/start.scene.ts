import { StepScene } from "@vk-io/scenes";

export const startScene = new StepScene("start", [
  async (context) => {
    const keyboard = await buildStartKeyboard();

    await saveUserState({ peerId: context.peerId, state: "start" });
    context.session.state = "start";

    await context.send({
      message: "Привет! Я умею много крутого и т. д. ... Нажми кнопку ниже 👇",
      keyboard: keyboard,
    });
    return context.scene.leave();
  },
]);
