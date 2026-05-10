import { StepScene } from "@vk-io/scenes";

export const chooseProgramScene = new StepScene("chooseProgram", [
  async (context) => {
    if (context.scene.step.firstTime) {
      const orgId = await getUserOrgId(context.peerId);
      const programList = await getPrograms(orgId!);

      context.session.lists = {
        ...(context.session.lists || {}),
        program: programList,
      };

      const keyboard = await buildKeyboard(programList!, 1, "program");

      const message = await context.send({
        message: "Выберите программу: ",
        keyboard: keyboard,
      });

      context.session.messageId = message.id;
      return context.scene.leave();
    }
  },
]);
