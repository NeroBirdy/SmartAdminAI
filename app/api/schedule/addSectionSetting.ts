export const addSectionSetting = async (
  sectionId: number,
  settingDefinitionId: number,
  settingOptionId: number,
) => {
  return await $fetch("/api/schedule/addSectionSetting", {
    method: "POST",
    body: {
      sectionId: sectionId,
      settingDefinitionId: settingDefinitionId,
      settingOptionId: settingOptionId,
    },
  });
};
