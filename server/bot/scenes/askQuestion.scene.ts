import { StepScene } from '@vk-io/scenes';

export const askQuestionScene = new StepScene('askQuestion', [
    async (context) => {
        const cmd = context.messagePayload?.cmd;

        if (context.scene.step.firstTime) {
            await saveUserState({peerId: context.peerId, state: "askQuestion"});
            context.session.state = "askQuestion";

            const keyboard = await buildBackButton();
            
            return context.send({
                message: "Задайте ваш вопрос",
                keyboard: keyboard,
            });
        }

        if (cmd === "back") {
            await sendHelloMessage(context.peerId);
            return context.scene.leave();
        }

        const text = context.text?.trim();
        const message = await context.send("Пожалуйста подождите");

        const response = await $fetch("/api/miniapp/QA", {
                method: "POST",
                body: {
                    userId: context.peerId,
                    question: text,
                },
                keepalive: true,
            });

        await editMessage(context.peerId, message.id, response);

        // если не ответит то отправить менеджеру
    }
]);