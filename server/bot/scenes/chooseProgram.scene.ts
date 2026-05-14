import { StepScene } from "@vk-io/scenes";

export const chooseProgramScene = new StepScene("chooseProgram", [
  async (context) => {
    if (context.scene.step.firstTime) {
      context.session.state = "choose_program";
      
      const orgId = await getUserOrgId(context.peerId, context.session.city, context.session.organization);

      let programList;
      if (context.session.program) {
        programList = await getPrograms(orgId!, context.session.program);
      }
      else {
        programList = await getPrograms(orgId!);
      }

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
