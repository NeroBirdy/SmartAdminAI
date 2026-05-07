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

        // логика ответа на вопрос пользователя
    }
]);