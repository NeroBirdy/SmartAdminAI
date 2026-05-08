import { vk } from '../vk';

export function registerMessageHandler() {
    vk.updates.on('message_new', async (ctx, next) => {
        if (ctx.isChat) {
            return next();
        }

        const cmd = ctx.messagePayload?.cmd;

        if (ctx.text?.trim().toLocaleLowerCase() === 'начать') {
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
        }

        return next();
    });
}