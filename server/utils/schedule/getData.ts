const prisma = usePrisma();
const fakeAPI = useFakeAPI();

import { formatWorkHours, formatBreaks } from "../schedule/formatData";

export {
  getInstructorWorkHours,
  getInstructorBreaks,
  getVenueWorkHours,
  getVenueBreaks,
  getOrgSchedule,
  collectData,
};

const collectData = async (orgId: number) => {
  const notWorkingDays = await getNotWorkingDays(orgId);

  const [horizonPlanning, groups] = await Promise.all([
    getHorizonPlanning(orgId),
    getGroups(orgId),
  ]);

  const [instructorsCount, venuesCount, groupsCount] = await Promise.all([
    getInstructorsCount(orgId),
    getVenueCount(orgId),
    getGroupsCount(orgId),
  ]);

  let instructorsResult = null;
  let venuesResult = null;
  let orgSchedules = null;

  const [instructorSettingExist, areaSettingExist, scheduleSettingExist] =
    await Promise.all([
      considerOtherSetting(orgId, "instructors"),
      considerOtherSetting(orgId, "areas"),
      considerOtherSetting(orgId, "org_schedule"),
    ]);

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

  if (scheduleSettingExist) {
    orgSchedules = await getOrgSchedule(orgId);
  }

  return {
    notWorkingDays,
    horizonPlanning,
    groups,
    instructorsCount,
    venuesCount,
    groupsCount,
    instructorsResult,
    venuesResult,
    orgSchedules,
  };
};

const getNotWorkingDays = async (orgId: number) => {
  try {
    const days = await prisma.workSchedule.findMany({
      where: { organizationId: orgId, isWorkingDay: false },
      select: { dayOfWeek: true },
    });

    return days;
  } catch (e) {
    console.error("Ошибка выходных организации", e);
  }
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

const getInstructorsCount = async (orgId: number) => {
  try {
    const count = await fakeAPI.employee.count({
      where: {
        organizationId: orgId,
        role: "INSTRUCTOR",
      },
    });

    return count;
  } catch (e) {
    console.error("Ошибка получения количества инструкторов организации", e);
  }
};

const getVenueCount = async (orgId: number) => {
  try {
    const venues = await fakeAPI.venue.count({
      where: {
        organizationId: orgId,
      },
    });

    return venues;
  } catch (e) {
    console.error("Ошибка получения количества помещений организации", e);
  }
};

const getGroupsCount = async (orgId: number) => {
  try {
    const groups = await fakeAPI.group.count({
      where: { organization: { id: orgId } },
    });

    return groups;
  } catch (e) {
    console.error("Ошибка получения количества групп организации", e);
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
    return formatWorkHours(workHours);
  } catch (e) {
    console.error("Ошибка получения рабочих часов инструктора", e);
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
    return formatWorkHours(workHours);
  } catch (e) {
    console.error("Ошибка получения рабочих часов помещения", e);
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

    return formatWorkHours(orgSchedules);
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
