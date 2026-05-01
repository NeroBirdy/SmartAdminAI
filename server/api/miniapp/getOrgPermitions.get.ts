const prisma = usePrisma();
const fakeAPI = useFakeAPI();

const getSectionSetting = (orgId: number, key: string) => {
  return prisma.sectionSetting.findFirst({
    where: {
      sectionId: orgId,
      settingDefinition: {
        is: { key },
      },
    },
    select: { settingOption: { select: { key: true } } },
  });
};

const checkSettingOption = (dataset: { settingOption: { key: string } }) => {
  if (dataset) {
    if (dataset.settingOption.key == "on") {
      return true;
    }
  }
  return false;
};

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const userId = Number(query.userId);

  const user = await prisma.users.findFirst({
    where: {
      peerId: userId,
    },
    select: { key: true },
  });

  const employee = await fakeAPI.employee.findFirst({
    where: {
      accessCode: user?.key!,
    },
    select: {
      organizationId: true,
    },
  });

  const orgId = employee?.organizationId!;

  let changeDate, changeVenue, cancellationLesson, changeInstructor;

  const [changeDateDB, changeVenueDB, cancellationLessonDB] = await Promise.all(
    [
      getSectionSetting(orgId, "schedule_instructor_change_date"),
      getSectionSetting(orgId, "schedule_instructor_change_venue"),
      getSectionSetting(orgId, "schedule_instructor_lesson_cancellation"),
    ],
  );
  const changeInstructorDB = await prisma.sectionAISetting.findFirst({
    where: {
      sectionId: orgId,
      settingAIId: 3,
    },
  });

  changeDate = checkSettingOption(changeDateDB!);
  changeVenue = checkSettingOption(changeVenueDB!);
  cancellationLesson = checkSettingOption(cancellationLessonDB!);
  changeInstructor = changeInstructorDB ? changeInstructorDB.enable : false;

  return {
    changeDate,
    changeVenue,
    cancellationLesson,
    changeInstructor: changeInstructor,
  };
});
