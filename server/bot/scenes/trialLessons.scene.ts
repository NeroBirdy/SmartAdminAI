import { StepScene } from '@vk-io/scenes';

export const trialLesonsScene = new StepScene('trialLessons', [
    async (context) => {
        if (context.scene.step.firstTime) {
            await saveUserState({ peerId: context.peerId, state: "chooseTrialLessons" });
            context.session.state = "trialLessons";

            const trialLessonsList = await $fetch("/api/miniapp/getScheduleForTrialLesson", {
                method: "GET",
                query: {
                    userId: context.peerId,
                },
                keepalive: true,
            });

            if (trialLessonsList.length === 0) {
                context.send("Нет занятий в ближайшее время");
                return context.scene.leave();
            }

            context.session.lists = {
                ...(context.session.lists || {}),
                trialLessons: trialLessonsList,
            };

            const keyboard = await buildKeyboardForTrialLesson(trialLessonsList as any, 0);

            const message = await context.send({
                message: "Выберите дату и время",
                keyboard: keyboard,
            });

            context.session.messageId = message.id;

            return context.scene.leave();
        }
    }
]);