import { StepScene } from '@vk-io/scenes';

export const chooseOrganizationScene = new StepScene('chooseOrganization', [
    async (context) => {
        const peerId = context.peerId;

        if (context.scene.step.firstTime) {
            await saveUserState({peerId: context.peerId, state: "choose_organization"});
            context.session.state = "choose_organization";

            const response = await getCityOrganizationList();
            const organizationsList = findOrganizations(response, context.session.city);

            context.session.lists = {
                ...(context.session.lists || {}),
                organization: organizationsList,
            };

            const keyboard = await buildKeyboard(organizationsList!, 1, "organization");

            const message = await context.send({
                message: "Выберите организацию: ",
                keyboard: keyboard,
            })

            context.session.messageId = message.id;
            return context.scene.leave();
        }
    },
]);