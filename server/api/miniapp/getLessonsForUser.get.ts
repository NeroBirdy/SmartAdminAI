const prisma = usePrisma();
const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const userId = Number(query.userId);
  const date = String(query.date);

  const user = await prisma.users.findFirst({ where: { peerId: userId } });

  if (!user) {
    return { message: "Доступ ограничен" };
  }
  const key = String(user!.key);

  const employee = await fakeAPI.employee.findFirst({
    where: { accessCode: key },
  });
  const role = employee?.role;
  const orgId = employee?.organizationId;

  let lessons = {};
  if (role == "INSTRUCTOR") {
    lessons = await fakeAPI.lesson.findMany({
      where: {
        instructorId: employee!.id,
        date: date,
      },
    });
  } else if (role == "MANAGER") {
    lessons = await fakeAPI.lesson.findMany({
      where: {
        date: date,
        group: {
          organizationId: orgId,
        },
      },
    });
  }

   return { lessons }; 
});
