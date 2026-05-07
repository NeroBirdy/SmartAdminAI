import { StepScene } from '@vk-io/scenes';

export const chooseGroupScene = new StepScene('chooseGroup', [
    async (context) => {
        if (context.scene.step.firstTime) {
            await saveUserState({ peerId: context.peerId, state: "chooseGroup" });
            context.session.state = "chooseGroup";

            const response = await $fetch("/api/miniapp/getGroupsForUser", {
                method: "GET",
                query: {
                    userId: context.peerId,
                },
                keepalive: true,
            });

            if (!response.success) {
                context.send(response.message);
                return context.scene.leave();
            }

            context.session.lists = {
                ...(context.session.lists || {}),
                groups: response.groups,
            };

            const keyboard = await buildKeyboardForGroup(response.groups, 1);

            const message = await context.send({
                message: response.message,
                keyboard: keyboard,
            });

            context.session.messageId = message.id;
            context.session.message = response.message;

            return context.scene.leave();
        }
    }
]);