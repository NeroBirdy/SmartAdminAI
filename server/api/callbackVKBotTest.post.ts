import { log } from 'node:console';
import { VK, Keyboard } from 'vk-io';

const vk = new VK({ token: useRuntimeConfig().vkToken });

const datePickerId = Number(process.env.MINI_APP_ID);
const ownerGroupId = Number(process.env.OWNER_GROUP_ID);

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    if (body.type === 'confirmation') {
        return '2b7e895d';
    }

    if (body.type === 'message_new') {
        const message = body.object;
        const peerId = message.peer_id;
        const text = message.text?.toLowerCase() || '';

        let payload: any = {};
        try {
            payload = message.payload ? JSON.parse(message.payload) : {};
        } catch {
            payload = {};
        }

        const currentState = await getUserState(peerId);

        if (text === 'начать') {
            await sendStartMessage(peerId);
            await saveUserState({ peerId: peerId, state: 'start' });
            return 'ok';
        }

        switch (currentState) {

            case 'start':
                if (payload.cmd === 'signup') {
                    await sendChooseCityMessage(peerId);
                    await saveUserState({ peerId: peerId, state: 'choose_city' });
                    return 'ok';
                }
                else if (payload.cmd === 'login') {
                    const accessCode = await getUserAccessCode(peerId);

                    if (accessCode === null) {
                        await sendLoginMessage(peerId);
                        await saveUserState({ peerId: peerId, state: 'login' });
                    }
                    else {
                        await login(peerId, accessCode!);
                        await saveUserState({ peerId: peerId, state: 'isLogined' });
                        await sendHelloMessage(peerId);
                    }
                    return 'ok';
                }
                break;

            case 'choose_city':
                if (payload.cmd === 'back') {
                    await sendStartMessage(peerId);
                    await saveUserState({ peerId: peerId, state: 'start' });
                    return 'ok';
                }

                const apiResponse = await getCityOrganizationList();
                const cityList = findCities(apiResponse, text);

                await chooseCity(peerId, cityList);
                break;

            case 'choose_organization':
                if (payload.cmd === 'backToChooseCity') {
                    await sendChooseCityMessage(peerId);
                    await saveUserState({ peerId: peerId, state: 'choose_city' });
                    return 'ok';
                }
                break;

            case 'login':
                if (payload.cmd === 'back') {
                    await sendStartMessage(peerId);
                    await saveUserState({ peerId: peerId, state: 'start' });
                    return 'ok';
                }

                const isLogined = await login(peerId, text);

                if (isLogined) {
                    await saveUserState({ peerId: peerId, state: 'isLogined' });
                    await sendHelloMessage(peerId);
                }
                break;

            case 'isLogined':
                if (payload.cmd == 'logout') {
                    await logout(peerId);
                    await sendStartMessage(peerId);
                    await saveUserState({ peerId: peerId, state: 'start' });
                }
                else if (payload.cmd === 'scheduleManagement') {
                    const keyboard = await buildInstructorKeyboard(peerId);

                    await sendScheduleMenagementMessage(peerId, keyboard, 'Какой-то текст');
                    await saveUserState({ peerId: peerId, state: 'scheduleManagement' });
                }
                break;

            case 'scheduleManagement':
                if (payload.cmd === 'backToInstructorMenu') {
                    await sendHelloMessage(peerId);
                    await saveUserState({ peerId: peerId, state: 'isLogined' });
                }
                else if (payload.cmd === 'cancellationLesson') {
                    const keyboard = await buildKeyboardForMiniApp(peerId, 'Открыть календарь', datePickerId, ownerGroupId);
                    await sendCancellationLessonMessage(peerId, keyboard);
                    await saveUserState({ peerId: peerId, state: 'cancellationLesson' });
                }
                break;

            case 'cancellationLesson':
                if (payload.cmd === 'back') {
                    const keyboard = await buildInstructorKeyboard(peerId);

                    await sendScheduleMenagementMessage(peerId, keyboard, 'Какой-то текст');
                    await saveUserState({ peerId: peerId, state: 'scheduleManagement' });
                }
                break;
        }
    }

    if (body.type === 'message_event') {
        const obj = body.object;
        const peerId: number = obj.peer_id || obj.user_id;
        const eventId: string = obj.event_id;
        const msgId: number = obj.conversation_message_id;
        const payload = obj.payload || {};
        const currentState = await getUserState(peerId);
        let list = [];

        if (currentState === 'choose_organization') {
            list = await getUserOrganizationsList(peerId);
        }
        else {
            list = await getUserCityList(peerId);
        }

        await vk.api.messages.sendMessageEventAnswer({
            event_id: eventId,
            user_id: peerId,
            peer_id: peerId,
        });

        if (payload.cmd === 'page' && list) {
            const page = Number(payload.page) || 1;
            const keyboard = buildKeyboard(list, page, currentState);

            await vk.api.messages.edit({
                peer_id: peerId,
                conversation_message_id: msgId,
                message: 'Выбери город:',
                keyboard
            });

            await saveUserState({ peerId: peerId, page: page });

            return 'ok';
        }

        if (payload.cmd === 'choose_city' && payload.city) {
            await vk.api.messages.edit({
                peer_id: peerId,
                conversation_message_id: msgId,
                message: `Вы выбрали город: ${payload.city}`,
                keyboard: Keyboard.builder().inline()
            });

            await saveOrganizationList(payload.city, peerId);
            await saveUserState({ peerId: peerId, state: 'choose_organization', city: payload.city });
            await sendChooseOrganizationKeyboard(peerId);
            return 'ok';
        }

        if (payload.cmd === 'choose_organization' && payload.organization) {
            await vk.api.messages.edit({
                peer_id: peerId,
                conversation_message_id: msgId,
                message: `Вы выбрали организацию: ${payload.organization}`,
                keyboard: Keyboard.builder().inline()
            });

            await saveOrganizationList(payload.city, peerId);
            await saveUserState({ peerId: peerId, state: 'xz', organization: payload.organization });
            return 'ok';
        }

        if (payload.cmd === 'backToChooseCity') {
            await vk.api.messages.delete({
                peer_id: peerId,
                conversation_message_ids: [msgId],
                delete_for_all: 1
            });

            await sendChooseCityMessage(peerId);
            await saveUserState({ peerId: peerId, state: 'choose_city' });

            return 'ok';
        }

        return 'ok';
    }

    return 'ok';
});