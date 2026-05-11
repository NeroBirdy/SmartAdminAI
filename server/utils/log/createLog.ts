import {
  ChangeType,
  EntityType,
  Prisma,
} from "~~/prisma/generated/prisma/db1/client";

export { createLog };

const prisma = usePrisma();

type JsonNullable = Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput;

type CreateLogParams = {
  employeeId?: number | null;
  changeType: ChangeType;
  entityType: EntityType;
  entityId: number;
  oldValue?: JsonNullable;
  newValue?: JsonNullable;
  revertedLogId?: number | null;
};

async function createLog({
  employeeId = null,
  changeType,
  entityType,
  entityId,
  oldValue = Prisma.JsonNull,
  newValue = Prisma.JsonNull,
  revertedLogId = null,
}: CreateLogParams) {
  await prisma.log.create({
    data: {
      status: "ACTIVE",
      employeeId,
      changeType,
      entityType,
      entityId,
      oldValue,
      newValue,
      revertedLogId
    },
  });
}
