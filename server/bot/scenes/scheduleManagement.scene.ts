import { StepScene } from '@vk-io/scenes';

const datePickerId = Number(process.env.MINI_APP_ID);
const ownerGroupId = Number(process.env.OWNER_GROUP_ID);

export const scheduleManagementScene = new StepScene('scheduleManagement', [
    async (context) => {
        const cmd = context.messagePayload?.cmd;

        if (context.scene.step.firstTime) {
            await saveUserState({ peerId: context.peerId, state: "scheduleManagement" });
            context.session.state = "scheduleManagement";

            const keyboard = await buildInstructorKeyboard(context.peerId);
            return await context.send({
                message: "Какой-то текст",
                keyboard: keyboard,
            });
        }

        if (cmd === 'backToInstructorMenu') {
            await sendHelloMessage(context.peerId);
            await saveUserState({ peerId: context.peerId, state: "isLogined" });
            context.session.state = "isLogined";
            return context.scene.leave();
        }
        else {
            await saveUserState({ peerId: context.peerId, state: cmd });
            context.session.state = cmd;

            const keyboard = await buildKeyboardForMiniApp(context.peerId, "Календарь", datePickerId, ownerGroupId);

            context.send({
                message: "Откройте календарь для выбора занятия",
                keyboard: keyboard,
            });
            return context.scene.leave();
        }
    },
]);