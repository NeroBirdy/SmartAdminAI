import { ChangeType } from "~~/prisma/generated/prisma/db1/enums";
import { startOfMonth, endOfMonth } from "date-fns";

const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const type = query.type as ChangeType;

  const now = new Date();

  const logs = await prisma.log.count({
    where: {
      changeType: type,
      createdAt: {
        gte: startOfMonth(now),
        lte: endOfMonth(now),
      },
    },
  });

  return logs;
});
