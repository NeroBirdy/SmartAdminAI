import { Employee } from "~~/prisma/generated/prisma/db2/client";

const fakeAPI = useFakeAPI();
const prisma = usePrisma();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const orgId = Number(query.orgId);

  const employees = await fakeAPI.employee.findMany({
    where: { organizationId: orgId },
  });

  return await Promise.all(employees.map(async (employee: Employee) => {
    const scheduleExists = await prisma.workSchedule.findFirst({
      where: { employeeId: employee.id, isWorkingDay: true },
    });

    return {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      scheduleExist: !!scheduleExists,
    };
  }));
});
