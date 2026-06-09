import { StepScene } from "@vk-io/scenes";
import { Keyboard } from "vk-io";

export const trialLesonsScene = new StepScene("trialLessons", [
  async (context) => {
    if (context.scene.step.firstTime) {
      context.session.state = "trialLessons";

      const trialLessonsList = await $fetch(
        "/api/miniapp/getScheduleForTrialLesson",
        {
          method: "GET",
          query: {
            userId: context.peerId,
          },
          keepalive: true,
        },
      );

      if (!trialLessonsList.success) {
        const keyboard = await Keyboard.builder().textButton({label: "В главное меню", payload: {cmd: "returnMainMenu"}});
        context.send({
          message: trialLessonsList.message,
          keyboard: keyboard,
        });
        return context.scene.leave();
      }

      context.session.lists = {
        ...(context.session.lists || {}),
        trialLessons: trialLessonsList.data,
      };

      const keyboard = await buildKeyboardForTrialLesson(
        trialLessonsList.data as any,
        0,
      );

      const message = await context.send({
        message: "Выберите дату и время",
        keyboard: keyboard,
      });

      context.session.messageId = message.id;

      return context.scene.leave();
    }
  },
]);
