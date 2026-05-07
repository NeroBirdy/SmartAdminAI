import { vk } from '../vk';

export function registerEventHandler() {
    vk.updates.on('message_event', async (context) => {
        const payload = context.eventPayload;

        if (payload.cmd === 'page') {
            const page = Number(payload.page);
            const listKey = payload.listKey as string;

            const list = context.session.lists?.[listKey] || [];
            const keyboard = await buildKeyboard(list, page, listKey);

            await editMessage(context.peerId, context.session.messageId, getListTitle(listKey), keyboard);
        }

        if (payload.cmd === 'pageForDate') {
            const page = Number(payload.page);
            const list = context.session.lists?.date || [];

            const keyboard = await buildKeyboardForDate(page, list);

            await editMessage(context.peerId, context.session.messageId, 'Выберите дату и время', keyboard);
        }

        if (payload.cmd === "pageForTrialLesson") {
            const page = Number(payload.page);
            const list = context.session.lists?.trialLessons || [];

            const keyboard = await buildKeyboardForTrialLesson(list, page);

            await editMessage(context.peerId, context.session.messageId, 'Выберите дату и время', keyboard);
        }

        if (payload.cmd === 'select') {
            const listKey = payload.listKey as string;
            const value = payload.select as string;

            switch (listKey) {
                case 'city':
                    await saveUserState({ peerId: context.peerId, city: value, state: "choose_organization" });
                    await editMessage(
                        context.peerId,
                        context.session.messageId,
                        `Вы выбрали город: ${value}`,
                    );
                    context.session.city = value;
                    return context.scene.enter('chooseOrganization');

                case 'organization':
                    await saveUserState({ peerId: context.peerId, organization: value, state: "choose_program" });
                    context.session.state = "choose_program";
                    await editMessage(
                        context.peerId,
                        context.session.messageId,
                        `Вы выбрали организацию: ${value}`,
                    );
                    context.session.organization = value;
                    return context.scene.enter('chooseProgram');

                case 'program':
                    await saveUserState({ peerId: context.peerId, program: value});
                    await editMessage(
                        context.peerId,
                        context.session.messageId,
                        `Вы выбрали программу: ${value}`,
                    );
                    context.session.program = value;

                    if(await checkUserRegistration(context.peerId)) {
                        context.send("Предлагаем посетить пробное занятие");
                        return context.scene.enter("trialLessons");
                    }
                    return context.scene.enter("registration");

                case "venue":
                    const venueData = await findVenueDataFromName(context.session.lists.venue, value);
                    const { venueId, lessonId } = venueData!;

                    await editMessage(
                        context.peerId,
                        context.session.messageId,
                        `Вы выбрали: ${value}`,
                    );

                    $fetch("/api/miniapp/updateLesson", {
                        method: "GET",
                        query: {
                            venueId: venueId,
                            lessonId: lessonId,
                            userId: context.peerId,
                        },
                        keepalive: true,
                    });

                default:
                    await editMessage(
                        context.peerId,
                        context.session.messageId,
                        `Вы выбрали: ${value}`,
                    );
            }
        }

        if (payload.cmd === "selectDate") {
            await deleteMessage(context.session.messageId);

            $fetch("/api/miniapp/updateDate", {
                method: "GET",
                query: {
                    lessonId: payload.lessonId,
                    userId: context.peerId,
                    date: payload.date,
                    startTime: payload.startTime,
                    endTime: payload.endTime,
                },
                keepalive: true,
            });
        }

        if (payload.cmd === "selectTrialLesson") {
            await deleteMessage(context.session.messageId);
            context.send(`Вы записаны на занятие: ${payload.date} в ${payload.startTime}`);
            // запись на выбранное пробное занятие
        }

        if (payload.cmd == "cancellationLesson") {
            $fetch("/api/miniapp/deleteLesson", {
                method: "GET",
                query: {
                    lessonId: payload.lessonId,
                    userId: payload.userId,
                },
                keepalive: true,
            });

            const id = await getUserIdByPeerId(context.peerId);
            const messageId = await getMessageId(id!, payload.randomId);

            await deleteMessage(messageId);
            await deleteMessageFromDb(messageId);

        }

        if (payload.cmd === "requestCancellationLesson") {
            const managerId = await getMenagerId();

            const id = await getUserIdByPeerId(managerId!);
            const randomId = generateRandomId(1, 10000000);

            const keyboard = await buildConfirmKeyboard({ cmd: "confirmRequestCancellationLesson", lessonId: payload.lessonId, userId: payload.userId, randomId: randomId }, { cmd: "denyRequestCancellationLesson", randomId: randomId, userId: payload.userId });

            const messageId = await sendRequestForManager(managerId!, keyboard, "Запрос на отмену занятия");
            await saveNewMessage(id!, Number(messageId)!, randomId);

            context.send({
                message: "Запрос отправлен",
            });

            const uid = await getUserIdByPeerId(context.peerId);
            const umessageId = await getMessageId(uid!, payload.randomId);

            await deleteMessage(umessageId);
            await deleteMessageFromDb(umessageId);

        }

        if (payload.cmd === "confirmRequestCancellationLesson") {
            await sendMessageWithoutKeyboard(payload.userId, "Ваш запрос одобрен");

            $fetch("/api/miniapp/deleteLesson", {
                method: "GET",
                query: {
                    lessonId: payload.lessonId,
                    userId: payload.userId,
                },
                keepalive: true,
            });

            const id = await getUserIdByPeerId(context.peerId);
            const messageId = await getMessageId(id!, payload.randomId);

            await deleteMessage(messageId);
            await deleteMessageFromDb(messageId);
        }

        if (payload.cmd === "denyCancellationLesson") {
            const id = await getUserIdByPeerId(context.peerId);
            const messageId = await getMessageId(id!, payload.randomId);

            await deleteMessage(messageId);
            await deleteMessageFromDb(messageId);
        }

        if (payload.cmd === "getAvailableInstructor") {
            const instructors = await $fetch("/api/miniapp/getAvailableInstructorsForLesson", {
                method: "GET",
                query: {
                    lessonId: payload.lessonId,
                },
                keepalive: true,
            });

            const id = await getUserIdByPeerId(context.peerId);
            const messageId = await getMessageId(id!, payload.randomId);

            await deleteMessage(messageId);
            await deleteMessageFromDb(messageId);

            const isAvailable = checkAvailableInstructor(instructors);

            if (!isAvailable) {
                await sendMessageWithoutKeyboard(context.peerId, "Нет доступных для замены инструкторов");
                return "ok";
            }

            const randomId = generateRandomId(1, 1000000);
            const peerIdList = await getPeerIdList(instructors);

            await sendChangeInstructorRequest(context.peerId, peerIdList, randomId, payload.lessonId);
        }

        if (payload.cmd === "confirmChangeInstructor") {
            await sendMessageWithoutKeyboard(payload.ownerId, "Вас заменит другой инструктор");

            await deleteChangeInstructorMessage(context.peerId, payload.randomId);

            await updateInstructor(payload.lessonId, context.peerId);
        }

        if (payload.cmd === "denyRequestCancellationLesson") {
            const id = await getUserIdByPeerId(context.peerId);
            const messageId = await getMessageId(id!, payload.randomId);

            await deleteMessage(messageId);
            await deleteMessageFromDb(messageId);

            await sendMessageWithoutKeyboard(payload.userId, "Ваш запрос отклонен");
        }

        if (payload.cmd === "cancelGetAvailableInstructor") {
            const id = await getUserIdByPeerId(context.peerId);
            const messageId = await getMessageId(id!, payload.randomId);

            await deleteMessage(messageId);
            await deleteMessageFromDb(messageId);
        }

        if (payload.cmd === "deny") {
            try {
                const id = await getUserIdByPeerId(context.peerId);
                const messageId = await getMessageId(id!, payload.randomId);

                if (messageId === 0) return "ok";

                await deleteMessage(messageId);
                await deleteMessageFromDb(messageId);

                const messagesCount = await checkMessagesCount(payload.randomId);

                if (messagesCount === 0) {
                    await sendMessageWithoutKeyboard(payload.ownerId, "Все отказались");
                }
            }
            catch (e) {
                console.log(e);
            }
        }

        if (payload.cmd == 'back') {
            switch (payload.listKey) {
                case 'city':
                    await deleteMessage(context.session.messageId);
                    return context.scene.enter('chooseCity');

                case 'organization':
                    await deleteMessage(context.session.messageId);
                    return context.scene.enter('chooseCity');

                case 'program':
                    await deleteMessage(context.session.messageId);
                    return context.scene.enter('chooseOrganization');

                default:
                    return context.scene.enter('start');
            }
        }
    });
}