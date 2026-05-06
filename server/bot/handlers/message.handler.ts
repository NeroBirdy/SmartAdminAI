import { vk } from '../vk';

export function registerMessageHandler() {
    vk.updates.on('message_new', async (ctx, next) => {
        const cmd = ctx.messagePayload?.cmd;
        console.log('MSG:', {
            peerId: ctx.peerId,
            senderId: ctx.senderId,
            text: ctx.text,
            scene: ctx.scene?.current,
            session: ctx.session,
        });

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

            case "getTrialLessons": {
                return ctx.scene.enter("trialLessons");
            }

        }

        return next();
    });
}