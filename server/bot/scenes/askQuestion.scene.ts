import { StepScene } from "@vk-io/scenes";
import { transcribeWithWhisper } from "../whisperClient";

export const askQuestionScene = new StepScene("askQuestion", [
  async (context) => {
    const cmd = context.messagePayload?.cmd;

    if (context.scene.step.firstTime && context.session.state !== "askQuestion") {
      context.session.state = "askQuestion";

      const keyboard = await buildBackButton();

      return context.send({
        message: "Задайте ваш вопрос",
        keyboard,
      });
    }

    if (cmd === "back") {
      await sendHelloMessage(context.peerId);
      context.session.state = 'isLogined';
      return context.scene.leave();
    }

    let questionText: string | undefined;

    if (context.hasAttachments()) {
      const audioMessages = context.getAttachments("audio_message");

      if (audioMessages.length) {
        const message = await context.send("Распознаю голосовое сообщение, подождите...");

        try {
          const audioBuffer = await downloadAudioMessageToBuffer(audioMessages[0]!);
          const recognizedText = await transcribeWithWhisper(audioBuffer);

          if (!recognizedText) {
            await editMessage(context.peerId, message.id, "Не удалось распознать голосовое сообщение. Попробуйте ещё раз или напишите текстом.");
            return;
          }

          questionText = recognizedText;

          await editMessage(
            context.peerId,
            message.id,
            `Я распознал: "${recognizedText}". Пытаюсь обработать ваш запрос`,
          );
        } catch (e) {
          console.error("Whisper error", e);
          await editMessage(
            context.peerId,
            message.id,
            "Произошла ошибка при распознавании голосового сообщения.",
          );
          return;
        }
      } else {
        return context.send("Пожалуйста, отправьте голосовое сообщение или текст вопроса.");
      }
    } else {
      questionText = context.text?.trim();
    }

    if (!questionText) {
      return context.send("Пожалуйста, задайте ваш вопрос текстом или голосовым сообщением.");
    }

    const waitMessage = await context.send("Пожалуйста, подождите...");

    const response = await $fetch("/api/miniapp/QA", {
      method: "POST",
      body: {
        userId: context.peerId,
        question: questionText,
      },
      keepalive: true,
    });

    await editMessage(context.peerId, waitMessage.id, response);

    // если не ответит то отправить менеджеру
  },
]);