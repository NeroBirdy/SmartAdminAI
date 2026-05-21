import { StepScene } from "@vk-io/scenes";

export const chooseCityScene = new StepScene("chooseCity", [
  async (context) => {
    const peerId = context.peerId;
    const payload = context.messagePayload || context.eventPayload;
    const cmd = payload?.cmd;

    if (context.scene.step.firstTime) {
      const keyboard = await buildBackButton();

      context.session.state = "choose_city";
      return context.send({
        message:
          "В каком городе находится секция? Напишите город или его часть",
        keyboard: keyboard,
      });
    }

    if (cmd === "back") {
      return context.scene.enter("start");
    }

    const text = context.text?.trim();
    const apiResponse = await getCityOrganizationList();
    const cityList = findCities(apiResponse, text!);

    context.session.lists = {
      ...(context.session.lists || {}),
      city: cityList,
    };

    if (cityList.length === 0) {
      return context.send("Город не найден, попробуйте ещё раз");
    }

    if (cityList.length === 1) {
      context.session.state = "choose_organization";
      await context.send(`✅ Ваш город: ${cityList[0]}`);

      context.session.city = cityList[0];
      return context.scene.enter("chooseOrganization");
    }

    const keyboard = await buildKeyboard(cityList, 1, "city");

    const message = await context.send({
      message: "📋 Выберите город:",
      keyboard: keyboard,
    });

    context.session.messageId = message.id;
    return context.scene.leave();
  },
]);
