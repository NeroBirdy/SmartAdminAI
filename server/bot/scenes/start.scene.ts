import { StepScene } from "@vk-io/scenes";

export const startScene = new StepScene("start", [
  async (context) => {
    const keyboard = await buildStartKeyboard();

    context.session.state = "start";

    await context.send({
      message: "Привет! Я умею много крутого и т. д. ... Нажми кнопку ниже 👇",
      keyboard: keyboard,
    });
    return context.scene.leave();
  },
]);
