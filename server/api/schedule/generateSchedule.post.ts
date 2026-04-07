import { GigaChatSchedule } from "../../utils/gigaChat";

const prisma = usePrisma();
const fakeAPI = useFakeAPI();

const gigaChat = new GigaChatSchedule();

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const orgId = body.orgId;

  const horizonPlanning = await getHorizonPlanning(orgId);

  let instructorsResult = null;
  let venuesResult = null;
  let orgSchedules = null;

  const instructorSettingExist = await considerOtherSetting(
    orgId,
    "instructors",
  );
  if (instructorSettingExist) {
    const instructors = await getInstructors(orgId);

    instructorsResult = await Promise.all(
      instructors!.map(async (instructor) => ({
        ...instructor,
        workHours: await getInstructorWorkHours(instructor.id),
        breaks: await getInstructorBreaks(instructor.id),
      })),
    );


  }

  const areaSettingExist = await considerOtherSetting(orgId, "areas");
  if (areaSettingExist) {
    const venues = await getVenues(orgId);

    venuesResult = await Promise.all(
      venues!.map(async (venue) => ({
        ...venue,
        workHours: await getVenueWorkHours(venue.id),
        breaks: await getVenueBreaks(venue.id),
      })),
    );
  }

  const scheduleSettingExit = await considerOtherSetting(orgId, "org_schedule");
  if (scheduleSettingExit) {
    orgSchedules = await getOrgSchedule(orgId);
  }

  const groups = await getGroups(orgId);

    let prompt = `## Входные данные для генерации\n\n`;
    prompt+=`Текущая дата: ${new Date().toLocaleDateString("ru-RU")}\n`;
    prompt+=`Горизонт планирования: ${horizonPlanning}\n`;
    prompt+=`Количество групп: ${groups?.length}\n`;
    prompt+=`Количество площадок: ${venuesResult?.length}\n`;
    prompt+=`Количество инструкторов: ${instructorsResult?.length}\n`;
    prompt+=`График работы организации: ${JSON.stringify(orgSchedules)}\n`;
    prompt+=`График работы площадок: ${JSON.stringify(venuesResult)}\n`;
    prompt+=`График работы инструкторов: ${JSON.stringify(instructorsResult)}\n`;
    prompt+=`Информация о группах: ${JSON.stringify(groups)}\n`;
    prompt+=`Напиши полное расписание, не маленький кусочек\n`;
    // prompt+=`Не пиши комментарии и примечаний`;

  return prompt;
//   return gigaChat.sendMessage(prompt);
});

const formatTime = (date: Date | null) => {
  if (!date) return null;
  return date.toISOString().substring(11, 16);
};

const formatData = <T extends { startWork: Date | null; endWork: Date | null }>(
  dataSet: T[],
) => {
  return dataSet.map((data) => ({
    ...data,
    startWork: formatTime(data.startWork),
    endWork: formatTime(data.endWork),
  }));
};

const formatBreaks = <
  T extends { startTime: Date | null; endTime: Date | null },
>(
  breaks: T[],
) => {
  return breaks.map((b) => ({
    ...b,
    startTime: formatTime(b.startTime),
    endTime: formatTime(b.endTime),
  }));
};

const getHorizonPlanning = async (orgId: number) => {
  try {
    const sectionSetting = await prisma.sectionSetting.findFirst({
      where: {
        sectionId: orgId,
        settingDefinition: { key: "schedule_planning_horizon" },
      },
      include: { settingOption: true },
    });

    const sectionSettingText = sectionSetting!.settingOption.name;

    return sectionSettingText;
  } catch (e) {
    console.error("Ошибка получения горизонта планирования организации", e);
  }
};

const considerOtherSetting = async (orgId: number, key: string) => {
  try {
    const exist =
      (await prisma.sectionSetting.findFirst({
        where: {
          sectionId: orgId,
          settingDefinition: { key: "schedule_consider_resources" },
          settingOption: { key: key },
        },
        include: { settingOption: true },
      })) !== null;
    return exist;
  } catch (e) {
    console.error(`Ошибка проверки учитывания настройки ${key} ${orgId} `, e);
  }
};

const getInstructors = async (orgId: number) => {
  try {
    const instructors = await fakeAPI.employee.findMany({
      where: {
        organizationId: orgId,
        role: "INSTRUCTOR",
      },
      select: {
        id: true,
      },
    });

    return instructors;
  } catch (e) {
    console.error("Ошибка получения инструкторов организации", e);
  }
};

const getInstructorWorkHours = async (instructorId: number) => {
  try {
    const workHours = await prisma.workSchedule.findMany({
      where: {
        employeeId: instructorId,
      },
      select: {
        dayOfWeek: true,
        isWorkingDay: true,
        startWork: true,
        endWork: true,
      },
    });
    return formatData(workHours);
  } catch (e) {
    console.error("Ошибка получения рабочих часов инструктора", e);
  }
};

const getInstructorBreaks = async (instructorId: number) => {
  try {
    const workScheduleBreaks = await prisma.workScheduleBreaks.findMany({
      where: {
        workSchedule: { employeeId: instructorId },
      },
      select: {
        workSchedule: { select: { dayOfWeek: true } },
        break: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });
    const breaks = workScheduleBreaks.map((b) => ({
      ...b.break,
      dayOfWeek: b.workSchedule.dayOfWeek,
    }));
    return formatBreaks(breaks);
  } catch (e) {
    console.error("Ошибка получения перерывов инструктора", e);
  }
};

const getVenues = async (orgId: number) => {
  try {
    const venues = await fakeAPI.venue.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        id: true,
      },
    });

    return venues;
  } catch (e) {
    console.error("Ошибка получения помещений организации", e);
  }
};

const getVenueWorkHours = async (venueId: number) => {
  try {
    const workHours = await prisma.workSchedule.findMany({
      where: {
        venueId: venueId,
      },
      select: {
        dayOfWeek: true,
        isWorkingDay: true,
        startWork: true,
        endWork: true,
      },
    });
    return formatData(workHours);
  } catch (e) {
    console.error("Ошибка получения рабочих часов помещения", e);
  }
};

const getVenueBreaks = async (venueId: number) => {
  try {
    const workScheduleBreaks = await prisma.workScheduleBreaks.findMany({
      where: {
        workSchedule: { venueId: venueId },
      },
      select: {
        workSchedule: { select: { dayOfWeek: true } },
        break: {
          select: {
            startTime: true,
            endTime: true,
          },
        },
      },
    });

    const breaks = workScheduleBreaks.map((b) => ({
      ...b.break,
      dayOfWeek: b.workSchedule.dayOfWeek,
    }));
    return formatBreaks(breaks);
  } catch (e) {
    console.error("Ошибка получения перерывов помещения", e);
  }
};

const getOrgSchedule = async (orgId: number) => {
  try {
    const orgSchedules = await prisma.workSchedule.findMany({
      where: {
        organizationId: orgId,
      },
      select: {
        dayOfWeek: true,
        isWorkingDay: true,
        startWork: true,
        endWork: true,
      },
    });

    return formatData(orgSchedules);
  } catch (e) {
    console.error("Ошибка получения расписания организации", e);
  }
};

const getGroups = async (orgId: number) => {
  try {
    const groups = await fakeAPI.group.findMany({
      where: { organization: { id: orgId } },
      select: {
        id: true,
        instructor: { select: { id: true } },
        defaultVenue: {
          select: { id: true },
        },
        program: { select: { id: true } },
      },
    });

    return groups;
  } catch (e) {
    console.error("Ошибка получения групп организации", e);
  }
};
