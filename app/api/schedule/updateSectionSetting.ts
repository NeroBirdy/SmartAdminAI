export const updateSectionSetting = async (
  sectionId: number,
  settingDefinitionId: number,
  settingOptionId: number,
) => {
  return await $fetch("/api/schedule/updateSectionSetting", {
    method: "POST",
    body: {
      sectionId: sectionId,
      settingDefinitionId: settingDefinitionId,
      settingOptionId: settingOptionId,
    },
  });
};
