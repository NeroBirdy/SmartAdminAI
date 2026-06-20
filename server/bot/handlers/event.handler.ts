import { getEmployee } from "~~/server/utils/vk/user";
import { vk } from "../vk";
import { ChangeType } from "~~/prisma/generated/prisma/db1/client";

export function registerEventHandler() {
  vk.updates.on("message_event", async (context) => {
    const payload = context.eventPayload;

    if (payload.cmd === "page") {
      const page = Number(payload.page);
      const listKey = payload.listKey as string;

      const list = context.session.lists?.[listKey] || [];
      const keyboard = await buildKeyboard(list, page, listKey);

      await editMessage(
        context.peerId,
        context.session.messageId,
        getListTitle(listKey),
        keyboard,
      );
    }

    if (payload.cmd === "pageForDate") {
      const page = Number(payload.page);
      const list = context.session.lists?.date || [];

      const keyboard = await buildKeyboardForDate(page, list, payload.dateCmd, payload.oldLessonId);

      await editMessage(
        context.peerId,
        context.session.messageId,
        "Выберите дату и время",
        keyboard,
      );
    }

    if (payload.cmd === "pageForTrialLesson") {
      const page = Number(payload.page);
      const list = context.session.lists?.trialLessons || [];

      const keyboard = await buildKeyboardForTrialLesson(list, page);

      await editMessage(
        context.peerId,
        context.session.messageId,
        "Выберите дату и время",
        keyboard,
      );
    }

    if (payload.cmd === "select") {
      const listKey = payload.listKey as string;
      const value = payload.select as string;

      switch (listKey) {
        case "city":
          await editMessage(
            context.peerId,
            context.session.messageId,
            `Вы выбрали город: ${value}`,
          );
          context.session.city = value;
          return context.scene.enter("chooseOrganization");

        case "organization":
          await editMessage(
            context.peerId,
            context.session.messageId,
            `Вы выбрали организацию: ${value}`,
          );
          context.session.organization = value;
          return context.scene.enter("chooseProgram");

        case "program":
          await editMessage(
            context.peerId,
            context.session.messageId,
            `Вы выбрали программу: ${value}`,
          );
          context.session.program = value;

          if (await checkUserRegistration(context.peerId)) {
            context.send("Предлагаем посетить пробное занятие");
            return context.scene.enter("trialLessons");
          }
          return context.scene.enter("registration");

        case "venue":
          const venueData = await findVenueDataFromName(
            context.session.lists.venue,
            value,
          );
          const { venueId, lessonId } = venueData!;
          const oldVenueId = payload.oldVenueId;
          const venueCmd = payload.venueCmd;
          const oldVenueName = await getVenueNameById(oldVenueId);

          const groupName = await getGroupNameByLessonId(lessonId);

          await deleteMessage(context.session.messageId);

          const keyboard = await buildConfirmKeyboard({ cmd: venueCmd, venueId: venueId, lessonId: lessonId, oldVenueId: oldVenueId, userId: context.peerId }, { cmd: "denyChangeVenue" });

          const lessonDateTime = await getLessonDateTime(lessonId);

          let message;
          if (venueCmd === "changeVenue") {
            message = `Замена локации:\n\n    Группа: ${groupName}\n    Дата Занятия: ${lessonDateTime}\n    Предыдущия локация: ${oldVenueName}\n    Новая локация: ${value}`
          }
          else {
            message = `Запрос на замену локации:\n\n    Дата Занятия: ${lessonDateTime}\n    Предыдущия локация: ${oldVenueName}\n    Новая локация: ${value}`
          }

          const sendMessage = await context.send({
            message: message,
            keyboard: keyboard,
          });

          context.session.messageId = sendMessage.id;
          return;

        default:
          await editMessage(
            context.peerId,
            context.session.messageId,
            `Вы выбрали: ${value}`,
          );
      }
    }

    if (payload.cmd === "changeVenue") {
      await deleteMessage(context.session.messageId);

      const venueId = payload.venueId;
      const lessonId = payload.lessonId;

      $fetch("/api/miniapp/updateLesson", {
        method: "GET",
        query: {
          venueId: venueId,
          lessonId: lessonId,
          userId: context.peerId,
        },
        keepalive: true,
      });
    }

    if (payload.cmd === "requestChangeVenue") {
      const managerPeerId = await getManagerId();
      const managerId = await getUserIdByPeerId(managerPeerId!);

      const userPeerId = context.peerId;
      const userId = await getUserIdByPeerId(userPeerId);

      const managerRandomId = generateRandomId(0, 1000000);
      const userRandomId = generateRandomId(0, 1000000);

      const newVenueName = await getVenueNameById(payload.venueId);
      const oldVenueName = await getVenueNameById(payload.oldVenueId);

      const lessonData = await getInfoByLesson(payload.lessonId);
      const groupName = lessonData?.group.name;
      const instructor = `${lessonData?.instructor.firstName} ${lessonData?.instructor.lastName}`;
      const lessonDateTime = await getLessonDateTime(payload.lessonId);

      const keyboard = await buildConfirmKeyboard({ cmd: "confirmRequestChangeVenue", venueId: payload.venueId, lessonId: payload.lessonId, oldVenueId: payload.oldVenueId, userId: context.peerId, userRandomId: userRandomId, managerRandomId: managerRandomId }, { cmd: "denyRequestChangeVenue", venueId: payload.venueId, lessonId: payload.lessonId, oldVenueId: payload.oldVenueId, userId: context.peerId, userRandomId: userRandomId, managerRandomId: managerRandomId });

      const message = `Запрос на изменение локации:\n\n    Инструктор: ${instructor}\n    Группа: ${groupName}\n    Дата: ${lessonDateTime}\n    Предыдущая локация: ${oldVenueName}\n    Новая локация: ${newVenueName}`;

      const messageId = await sendRequestForManager(managerPeerId!, keyboard, message);

      await saveNewMessage(managerId!, Number(messageId)!, managerRandomId);

      await deleteMessage(context.session.messageId);

      const userMessage = await context.send("Запрос отправлен");

      await saveNewMessage(userId!, Number(userMessage.id)!, userRandomId);
    }

    if (payload.cmd === "denyChangeVenue") {
      await deleteMessage(context.session.messageId);
    }

    if (payload.cmd === "confirmRequestChangeVenue") {
      const managerId = await getUserIdByPeerId(context.peerId);
      const messageId = await getMessageId(managerId!, payload.managerRandomId);

      await editMessage(context.peerId, messageId, "Запрос одобрен");
      await deleteMessageFromDb(messageId);

      const userId = await getUserIdByPeerId(payload.userId);
      const userMessageId = await getMessageId(userId!, payload.userRandomId);

      const lessonDateTime = await getLessonDateTime(payload.lessonId);
      const groupName = await getGroupNameByLessonId(payload.lessonId);
      const venueName = await getVenueNameById(payload.venueId);

      await editMessage(Number(payload.userId), userMessageId, `Ваш запрос на замену локации у группы ${groupName} одобрен\nДата: ${lessonDateTime}\nНовая локация: ${venueName}`);
      await deleteMessageFromDb(userMessageId);

      $fetch("/api/miniapp/updateLesson", {
        method: "GET",
        query: {
          venueId: payload.venueId,
          lessonId: payload.lessonId,
          userId: payload.userId,
        },
        keepalive: true,
      });
    }

    if (payload.cmd === "denyRequestChangeVenue") {
      const managerId = await getUserIdByPeerId(context.peerId);
      const messageId = await getMessageId(managerId!, payload.managerRandomId);

      await editMessage(context.peerId, messageId, "Запрос отклонен");
      await deleteMessageFromDb(messageId);

      const userId = await getUserIdByPeerId(payload.userId);
      const userMessageId = await getMessageId(userId!, payload.userRandomId);

      const lessonDateTime = await getLessonDateTime(payload.lessonId);
      const oldVenueName = await getVenueNameById(payload.oldVenueId);

      await editMessage(Number(payload.userId), userMessageId, `Ваш запрос на замену локации ${oldVenueName} занятия ${lessonDateTime} отклонен`);
      await deleteMessageFromDb(userMessageId);
    }

    if (payload.cmd === "changeDate") {
      const keyboard = await buildConfirmKeyboard({ cmd: "confirmChangeDate", lessonId: payload.lessonId, date: payload.date, startTime: payload.startTime, endTime: payload.endTime }, { cmd: "denyChangeDate" });

      const lessonDateTime = await getLessonDateTime(Number(payload.oldLessonId));

      const message = await context.send({
        message: `Перенести занятие: ${lessonDateTime}\nНа новую дату: ${payload.date} в ${payload.startTime} - ${payload.endTime}`,
        keyboard: keyboard,
      });

      await deleteMessage(context.session.messageId);

      context.session.messageId = message.id;
    }

    if (payload.cmd === "confirmChangeDate") {
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

    if (payload.cmd === "requestChangeDate") {
      const keyboard = await buildConfirmKeyboard({ cmd: "confirmRequestChangeDate", lessonId: payload.lessonId, date: payload.date, startTime: payload.startTime, endTime: payload.endTime, oldLessonId: payload.oldLessonId }, { cmd: "denyChangeDate" });

      const lessonDateTime = await getLessonDateTime(Number(payload.oldLessonId));

      const message = await context.send({
        message: `Запросить перенос занятия: ${lessonDateTime}\nНа новую дату: ${payload.date} в ${payload.startTime} - ${payload.endTime}`,
        keyboard: keyboard,
      });

      await deleteMessage(context.session.messageId);

      context.session.messageId = message.id;
    }

    if (payload.cmd === "confirmRequestChangeDate") {
      await deleteMessage(context.session.messageId);

      const message = await context.send({
        message: "Запрос отправлен",
      });

      context.session.state = "isLogined";
      await sendHelloMessage(context.peerId);

      const managerId = await getManagerId();

      const id = await getUserIdByPeerId(managerId!);
      const userId = await getUserIdByPeerId(context.peerId);

      const randomId = generateRandomId(1, 10000000);
      const userRandomId = generateRandomId(1, 10000000);

      const keyboard = await buildConfirmKeyboard(
        {
          cmd: "confirmRequestChangeDateForManager",
          lessonId: payload.lessonId,
          userId: context.peerId,
          date: payload.date,
          startTime: payload.startTime,
          endTime: payload.endTime,
          randomId: randomId,
          userRandomId: userRandomId,
        },
        {
          cmd: "denyRequestChangeDateForManager",
          userId: context.peerId,
          date: payload.date,
          startTime: payload.startTime,
          endTime: payload.endTime,
          randomId: randomId,
          userRandomId: userRandomId,
        },
      );

      const lessonDateTime = await getLessonDateTime(Number(payload.lessonId));
      const info = await getInfoByLesson(Number(payload.lessonId));

      const messageId = await sendRequestForManager(
        managerId!,
        keyboard,
        `Запрос на перенос занятия:\n    Инструктор: ${info?.instructor.firstName} ${info?.instructor.lastName}\n    Группа: ${info?.group.name}\n    Занятие: ${lessonDateTime}\n    Новая дата: ${payload.date} в ${payload.startTime} - ${payload.endTime}`,
      );

      await saveNewMessage(id!, Number(messageId)!, randomId);
      await saveNewMessage(userId!, message.id, userRandomId);
    }

    if (payload.cmd === "confirmRequestChangeDateForManager") {
      const managerId = await getUserIdByPeerId(context.peerId)
      const userId = await getUserIdByPeerId(payload.userId);

      const managerMessage = await getMessageId(managerId!, payload.randomId);
      const userMessage = await getMessageId(userId!, payload.userRandimId);

      await editMessage(context.peerId, managerMessage, "Запрос одобрен");
      await deleteMessage(userMessage);
      await sendMessageWithoutKeyboard(payload.userId, `Ваш запрос на перенос занятия ${payload.date} ${payload.startTime} - ${payload.endTime} одобрен`);

      await deleteMessageFromDb(managerMessage);
      await deleteMessageFromDb(userMessage);

      $fetch("/api/miniapp/updateDate", {
        method: "GET",
        query: {
          lessonId: payload.lessonId,
          userId: payload.userId,
          date: payload.date,
          startTime: payload.startTime,
          endTime: payload.endTime,
        },
        keepalive: true,
      });
    }

    if (payload.cmd === "denyRequestChangeDateForManager") {
      const managerId = await getUserIdByPeerId(context.peerId)
      const userId = await getUserIdByPeerId(payload.userId);

      const managerMessage = await getMessageId(managerId!, payload.randomId);
      const userMessage = await getMessageId(userId!, payload.userRandimId);

      await editMessage(context.peerId, managerMessage, "Запрос отклонен");
      await deleteMessage(userMessage);
      await sendMessageWithoutKeyboard(payload.userId, `Ваш запрос на перенос занятия ${payload.date} ${payload.startTime} - ${payload.endTime} отклонен`);

      await deleteMessageFromDb(managerMessage);
      await deleteMessageFromDb(userMessage);
    }

    if (payload.cmd == "backToScheduleManagement") {
      return context.scene.enter("scheduleManagement");
    }

    if (payload.cmd === "denyChangeDate") {
      await deleteMessage(context.session.messageId);
    }

    if (payload.cmd === "selectTrialLesson") {
      await deleteMessage(context.session.messageId);
      context.send(
        `Вы записаны на занятие: ${payload.date} в ${payload.startTime}`,
      );
      // запись на выбранное пробное занятие

      const user = await getUser({ peerId: context.peerId });
      const client = await getClient(user?.key!);

      const lessonFields = await getLessonFields(payload.lessonId);
      const clientFields = await getClientFields(client!.id);

      //LOG Назначение пробного занятия
      await createLog({
        entityType: "LESSON",
        entityId: payload.lessonId,
        changeType: "SCHEDULED_TRIAL_LESSON",
        newValue: { ...lessonFields, ...clientFields },
      });

      const keyboard = await buildConfirmKeyboard(
        { cmd: "confirmSelectionGroup" },
        { cmd: "denySelectionGroup" },
      );
      const message = await context.send({
        message:
          "Мы рады, что вы посетили наше пробное занятие, надеемся вам всё понравилось!\n\nХотите подберем вам группы для регулярного посещения?",
        keyboard: keyboard,
      });

      context.session.messageId = message.id;
    }

    if (payload.cmd === "selectGroup") {
      await editMessage(
        context.peerId,
        context.session.messageId,
        `Вы записаны в группу: ${payload.groupName}`,
      );
      await setUserGroup(context.peerId, payload.groupId);

      await sendHelloMessage(context.peerId);
    }

    if (payload.cmd === "pageGroup") {
      const page = Number(payload.page);
      const list = context.session.lists?.groups;

      const keyboard = await buildKeyboardForGroup(list, page);

      await editMessage(
        context.peerId,
        context.session.messageId,
        context.session.message,
        keyboard,
      );
    }

    if (payload.cmd === "confirmSelectionGroup") {
      await deleteMessage(context.session.messageId);
      return context.scene.enter("chooseGroup");
    }

    if (payload.cmd === "denySelectionGroup") {
      await deleteMessage(context.session.messageId);
    }

    if (payload.cmd == "cancellationLesson") {
      $fetch("/api/miniapp/deleteLesson", {
        method: "DELETE",
        body: {
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
      const managerId = await getManagerId();

      const id = await getUserIdByPeerId(managerId!);
      const randomId = generateRandomId(1, 10000000);

      const keyboard = await buildConfirmKeyboard(
        {
          cmd: "confirmRequestCancellationLesson",
          lessonId: payload.lessonId,
          userId: payload.userId,
          randomId: randomId,
        },
        {
          cmd: "denyRequestCancellationLesson",
          randomId: randomId,
          userId: payload.userId,
        },
      );

      const messageId = await sendRequestForManager(
        managerId!,
        keyboard,
        "Запрос на отмену занятия",
      );
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
        method: "DELETE",
        body: {
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
      const instructors = await $fetch(
        "/api/miniapp/getAvailableInstructorsForLesson",
        {
          method: "GET",
          query: {
            lessonId: payload.lessonId,
          },
          keepalive: true,
        },
      );

      console.log(instructors);

      const id = await getUserIdByPeerId(context.peerId);
      const messageId = await getMessageId(id!, payload.randomId);

      await deleteMessage(messageId);
      await deleteMessageFromDb(messageId);

      const isAvailable = checkAvailableInstructor(instructors);

      if (!isAvailable) {
        await sendMessageWithoutKeyboard(
          context.peerId,
          "Нет доступных для замены инструкторов",
        );
        return "ok";
      }

      const randomId = generateRandomId(1, 1000000);
      const peerIdList = await getPeerIdList(instructors);

      const user = await getUser({ peerId: context.peerId });
      const employee = await getEmployee(user?.key!);

      const lessonFields = await getLessonFields(payload.lessonId);

      //LOG Подбор замены инструктора
      await createLog({
        employeeId: employee!.id,
        entityType: "LESSON",
        entityId: payload.lessonId,
        changeType: "SELECTION_INSTRUCTOR_CHANGE",
        newValue: { ...lessonFields },
      });

      await sendChangeInstructorRequest(
        context.peerId,
        peerIdList,
        randomId,
        payload.lessonId,
      );
    }

    if (payload.cmd === "confirmChangeInstructor") {
      await sendMessageWithoutKeyboard(
        payload.ownerId,
        "Вас заменит другой инструктор",
      );

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
      } catch (e) {
        console.log(e);
      }
    }

    if (payload.cmd == "back") {
      switch (payload.listKey) {
        case "city":
          await deleteMessage(context.session.messageId);
          return context.scene.enter("chooseCity");

        case "organization":
          await deleteMessage(context.session.messageId);
          return context.scene.enter("chooseCity");

        case "program":
          await deleteMessage(context.session.messageId);

          if (context.session.program) {
            return;
          }
          return context.scene.enter("chooseOrganization");

        case "trialLesson":
          await deleteMessage(context.session.messageId);

        case "venue":
          return await deleteMessage(context.session.messageId);

        default:
          return context.scene.enter("start");
      }
    }
  });
}
