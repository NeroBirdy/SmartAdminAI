const prisma = usePrisma();

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
  const orgId = Number(query.orgId);

  let changeDate, changeVenue, cancelLesson;

  const [changeDateDB, changeVenueDB, cancelLessonDB] = await Promise.all([
    getSectionSetting(orgId, "schedule_instructor_change_date"),
    getSectionSetting(orgId, "schedule_instructor_change_venue"),
    getSectionSetting(orgId, "schedule_instructor_lesson_cancellation"),
  ]);

  changeDate = checkSettingOption(changeDateDB!);
  changeVenue = checkSettingOption(changeVenueDB!);
  cancelLesson = checkSettingOption(cancelLessonDB!);

  return {
    changeDate,
    changeVenue,
    cancelLesson,
  };
});
