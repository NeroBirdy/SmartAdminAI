import type {
  SettingDefinition,
  SettingOption,
} from "~~/prisma/generated/prisma/db1/client";

type SectionResponse = {
  setting: SettingDefinition;
  options: SettingOption[];
  sectionSettings: {
    id: number;
    option_name: string;
    option_key: string;
  }[];
};

export const getSettingsByKey = async (queryKey: string) => {
  return await $fetch<SectionResponse>("/api/schedule/getSettingsByKey", {
    method: "GET",
    query: {
      sectionId: 1,
      key: queryKey,
    },
  });
};
