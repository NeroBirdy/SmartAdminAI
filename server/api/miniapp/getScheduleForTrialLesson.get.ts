const prisma = usePrisma();
const fakeAPI = useFakeAPI();

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const userId = Number(query.userId);
  const user = await prisma.users.findUnique({ where: { peerId: userId } });
  const client = await fakeAPI.client.findFirst({
    where: {
      accessCode: String(user?.key),
    },
  });

  const organisation = await fakeAPI.organization.findFirst({
    where: { city: { name: user?.city! }, name: user?.organization! },
    include: { groups: true },
  });

  const program = await fakeAPI.program.findFirst({
    where: {
      name: user?.program!,
      organizationId: organisation!.id,
    },
  });

  const clientAge = getAge(String(client!.birthDate));

  const groups = organisation?.groups
    .filter((group) => {
      if (group.programId !== program!.id) return false;

      const [minAge, maxAge] = group.ageCategory.split("-").map(Number);
      return clientAge >= minAge! && clientAge <= maxAge!;
    })
    .map((group) => group.id);

  if (!groups?.length) {
    return {
      success: false,
      message:
        "Извините, под ваши параметры в данный момент нет доступных групп в организации, мы передадим информацию сотрудникам.",
      data: [],
    };
  }

  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  const lessons = await fakeAPI.lesson.findMany({
    where: {
      groupId: { in: groups },
      date: {
        gte: today,
        lte: twoWeeksLater,
      },
      status: "ACTUAL"
    },
  });

  if (!lessons?.length) {
    return {
      success: false,
      message: `Извините у организации в данный момент нет актуального расписания на ближайший период, мы передадим информацию сотрудникам.\n🙁Попробуйте отправить запрос позже.`,
      data: [],
    };
  }

  const groupedByDate = lessons.reduce(
    (acc, lesson) => {
      const dateKey = lesson.date.toISOString().split("T")[0];
      if (!acc[dateKey!]) {
        acc[dateKey!] = { date: dateKey!, lessons: [] };
      }
      acc[dateKey!]!.lessons.push(lesson);
      return acc;
    },
    {} as Record<string, { date: string; lessons: typeof lessons }>,
  );

  return {
    success: true,
    message: "",
    data: Object.values(groupedByDate).sort((a, b) =>
      a.date.localeCompare(b.date),
    ),
  };
});

function getAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
