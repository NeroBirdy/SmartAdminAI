import { vk } from "../vk";

export function registerMessageHandler() {
  vk.updates.on("message_new", async (ctx, next) => {
    if (ctx.isChat) {
      return next();
    }

    console.log(ctx.session.state);

    const userState = ctx.session.state;

    switch (userState) {
      case "choose_city":
        return ctx.scene.enter("chooseCity");

      case "choose_organization":
        return ctx.scene.enter("chooseOrganization");

      case "choose_program":
        return ctx.scene.enter("chooseProgram");

      case "registration":
        return ctx.scene.enter("registration");

      case "askQuestion":
        return ctx.scene.enter("askQuestion");

      case 'login':
        return ctx.scene.enter('login');
    }

    const cmd = ctx.messagePayload?.cmd;

    if (ctx.text?.trim().toLocaleLowerCase() === "начать") {
      return ctx.scene.enter("start");
    }

    switch (cmd) {
      case "signup":
        return ctx.scene.enter("chooseCity");

      case "login":
        return ctx.scene.enter("login");

      case "logout":
        return ctx.scene.enter("logout");

      case "scheduleManagement":
        return ctx.scene.enter("scheduleManagement");

      case "backToScheduleManagement":
        return ctx.scene.enter("scheduleManagement");

      case "changeProgram": {
        return ctx.scene.enter("chooseProgram");
      }

      case "askQuestion": {
        return ctx.scene.enter("askQuestion");
      }

      case "groupInfo": {
        return await sendGroupInfo(ctx.peerId);
      }

      case "subscriptionInfo": {
        return await sendSubscriptionInfo(ctx.peerId);
      }

      case "checkSchedule": {
        return await sendScheduleForClient(ctx.peerId);
      }

      case "returnMainMenu": {
        return ctx.scene.enter("start");
      }
    }

    return next();
  });
}
