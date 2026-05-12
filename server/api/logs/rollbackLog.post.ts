import { Prisma } from "~~/prisma/generated/prisma/db1/client";

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
  const change = oldValue?.change;

  if (!change) return { message: "Лог не поддерживает откат" };

  const entityId = log.entityId;

  if (log.entityType === "LESSON") {
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

  //Добавить проверку на доступность помещения и тренера

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
