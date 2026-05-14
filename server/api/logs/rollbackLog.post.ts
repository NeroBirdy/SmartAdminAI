import { Prisma } from "~~/prisma/generated/prisma/db1/client";
import { LessonStatus } from "~~/prisma/generated/prisma/db2/enums";

const prisma = usePrisma();
const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const logId = body.logId;

  const log = await prisma.log.findFirst({ where: { id: logId } });

  if (!log) return { success: false, message: "Лог не найден" };
  if (log.status === "REVERTED")
    return { success: false, message: "Лог уже откатан" };

  const oldValue = log.oldValue as Record<string, any>;
  const newValue = log.newValue as Record<string, any>;
  const change = oldValue?.change;

  if (!change) return { message: "Лог не поддерживает откат" };

  const entityId = log.entityId;

  if (log.entityType === "LESSON") {
    const lesson = await fakeAPI.lesson.findFirst({
      where: { id: entityId },
    });

    if (!lesson) return { success: false, message: "Урок не найден" };

    if (newValue.change.status === "DELETED") {
      const newDate = lesson.date;
      const newStartTime = lesson.startTime;
      const newEndTime = lesson.endTime;
      const newVenueId = lesson.venueId;
      const newInstructorId = lesson.instructorId;
      const newGroupId = lesson.groupId;

      const conflictWhere = {
        id: { not: entityId },
        date: newDate,
        status: LessonStatus.ACTUAL,
        startTime: { lt: newEndTime },
        endTime: { gt: newStartTime },
      };
      console.log(conflictWhere);

      const venueConflict = await fakeAPI.lesson.findFirst({
        where: { ...conflictWhere, venueId: newVenueId },
      });
      if (venueConflict) {
        console.log(venueConflict);
        return {
          success: false,
          message: "Помещение уже занято в это время",
        };
      }

      const instructorConflict = await fakeAPI.lesson.findFirst({
        where: { ...conflictWhere, instructorId: newInstructorId },
      });
      if (instructorConflict) {
        console.log(instructorConflict);
        return {
          success: false,
          message: "Инструктор уже занят в это время",
        };
      }

      const groupConflict = await fakeAPI.lesson.findFirst({
        where: { ...conflictWhere, groupId: newGroupId },
      });
      if (groupConflict) {
        console.log(groupConflict);
        return {
          success: false,
          message: "Группа уже имеет урок в это время",
        };
      }
    }

    await fakeAPI.lesson.update({
      where: { id: entityId },
      data: change,
    });
  } else if (log.entityType === "CLIENT") {
    await fakeAPI.client.update({
      where: { id: entityId },
      data: change,
    });
  } else {
    return {
      success: false,
      message: "Откат для этого типа сущности не поддерживается",
    };
  }

  await prisma.log.update({
    where: { id: logId },
    data: { status: "REVERTED" },
  });

  const fields = await getFieldsForLog(logId);

  //LOG Откат
  await createLog({
    changeType: "LOG_ROLLBACK",
    originalChangeType:
      log.changeType != "LOG_ROLLBACK"
        ? log.changeType
        : log.originalChangeType,
    entityType: log.entityType,
    entityId: entityId,
    revertedLogId: logId,
    oldValue: log.newValue as Prisma.InputJsonValue,
    newValue: {
      ...fields,
      change,
    },
  });

  return { success: true };
});
