import { StepScene } from "@vk-io/scenes";

export const loginScene = new StepScene("login", [
  async (context) => {
    const peerId = context.peerId;
    const accessCode = await getUserAccessCode(peerId);
    const cmd = context.messagePayload?.cmd;

    if (cmd === "back") {
      return context.scene.enter("start");
    }

    if (context.scene.step.firstTime) {
      if (accessCode !== null) {
        const isLogined = await login(peerId, accessCode!);

        if (isLogined) {
          await saveUserState({ peerId, state: "isLogined" });
          context.session.state = "isLogined";
          await sendHelloMessage(peerId);
          return context.scene.leave();
        }
      }

      await context.send({
        message: "Введите ключ из личного кабинета",
        keyboard: await buildBackButton(),
      });

      await saveUserState({ peerId, state: "login" });
      return;
    }

    const key = context.text?.trim();
    if (!key) {
      return context.send("Введите ключ текстом.");
    }

    const isLogined = await login(peerId, key);

    if (isLogined) {
      await saveUserState({ peerId, state: "isLogined" });
      context.session.state = "isLogined";
      await sendHelloMessage(peerId);
      return context.scene.leave();
    }

    return context.send("Неверный код");
  },
]);
