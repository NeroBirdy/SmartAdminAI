import { ChangeType, Prisma } from "~~/prisma/generated/prisma/db1/client";

export { createLog };

const prisma = usePrisma();

async function createLog(
  employeeId: number | null,
  changeType: ChangeType,
  oldValue: Prisma.InputJsonValue,
  newValue: Prisma.InputJsonValue,
) {
  await prisma.log.create({
    data: {
      employeeId: employeeId,
      changeType: changeType,
      oldValue: oldValue,
      newValue: newValue,
    },
  });
}
