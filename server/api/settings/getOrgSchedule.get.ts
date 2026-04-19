import { Employee } from "~~/prisma/generated/prisma/db2/client";

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const orgId = Number(query.orgId);

  const scheduleExists = await prisma.workSchedule.findFirst({
    where: { organizationId: orgId, isWorkingDay: true },
  });

  return {
    scheduleExist: !!scheduleExists,
  };
});
