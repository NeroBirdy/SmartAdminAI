import { StepScene } from "@vk-io/scenes";

export const logoutScene = new StepScene("logout", [
  async (context) => {
    const peerId = context.peerId;

    await logout(peerId);

    return context.scene.enter("start");
  },
]);
