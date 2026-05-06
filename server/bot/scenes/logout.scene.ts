import { StepScene } from '@vk-io/scenes';

export const logoutScene = new StepScene('logout', [
    async (context) => {
        const peerId = context.peerId;

        await logout(peerId);
        await saveUserState({ peerId: peerId, state: "start" });
        context.session.state = "start"

        return context.scene.enter("start");
    },
]);