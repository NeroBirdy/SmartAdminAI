const prisma = usePrisma();
const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const userId = Number(query.userId);
  const date = new Date(String(query.date));
  date.setHours(19, 0, 0, 0);

  const today = new Date();
  today.setHours(19, 0, 0, 0);

  if (today > date) {
    return {};
  }

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
        status: "ACTUAL",
      },
      include: { group: true, venue: true },
    });
  } else if (role == "MANAGER") {
    lessons = await fakeAPI.lesson.findMany({
      where: {
        date: date,
        group: {
          organizationId: orgId,
        },
        status: "ACTUAL",
      },
      include: { group: true, venue: true },
    });
  }

  return lessons;
});
