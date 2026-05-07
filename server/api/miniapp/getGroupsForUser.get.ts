import { format } from "date-fns";

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
    include: { groups: { include: { defaultVenue: true, instructor: true } } },
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
      if (group.maxMembers < group.currentMembers + 1) return false;

      const [minAge, maxAge] = group.ageCategory.split("-").map(Number);
      return clientAge >= minAge! && clientAge <= maxAge!;
    })
    .map((group) => ({
      id: group.id,
      name: group.name,
      instructor: group.instructor.firstName + " " + group.instructor.lastName,
      venue: group.defaultVenue.name + ", " + group.defaultVenue.address,
    }));

  if (!groups?.length) {
    return {
      success: false,
      message: `Извините наши группы в данный момент переполнены. 
         Мы передадим информацию сотрудникам и сообщим если появятся доступные места!`,
      groups: [],
    };
  }

  const today = new Date();
  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(today.getDate() + 14);

  const messages = await Promise.all(
    groups.map(async (group) => {
      const schedule = await getLessons(group.id, today, twoWeeksLater);
      return `👥Группа: ${group.name}
      Инструктор: ${group.instructor}
      Площадка проведения: ${group.venue}
      Расписание на 14 дней:\n${schedule}`;
    }),
  );

  return {
    success: true,
    message: messages.join("\n\n"),
    groups: groups.map((group) => ({ id: group.id, name: group.name })),
  };
});

async function getLessons(groupId: number, today: Date, twoWeeksLater: Date) {
  const lessons = await fakeAPI.lesson.findMany({
    where: {
      groupId: groupId,
      date: {
        gte: today,
        lte: twoWeeksLater,
      },
    },
  });

  return lessons
    .map(
      (lesson) =>
        `      ${format(lesson.date, "dd.MM")} - ${format(lesson.startTime, "HH.mm")}`,
    )
    .join("\n");
}

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
