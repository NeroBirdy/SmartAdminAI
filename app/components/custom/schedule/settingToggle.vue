<template>
  <ui-page-toggle :enabled="enabled" @click="updateHandler()" />
</template>
<script lang="ts" setup>
import { updateSectionSetting } from "~/api/schedule/updateSectionSetting";

type Setting = {
  id: number;
  key: string;
  maxValues: number;
  name: string;
  settingTypeId: number;
};

type SectionSetting = { id: number; option_name: string; option_key: string };

const props = defineProps<{
  setting: Setting;
  sectionSettings: SectionSetting[];
  options: { id: number; key: string }[];
}>();

const emit = defineEmits<{
  update: [item: SectionSetting];
}>();

const enabled = computed(() => {
  return (
    props.sectionSettings.length > 0 &&
    props.sectionSettings[0]?.option_key == "on"
  );
});

const updateHandler = async () => {
  try {
    const currentKey = props.sectionSettings[0]?.option_key || "off";

    const newKey = currentKey === "on" ? "off" : "on";

    const targetOption = props.options.find((opt) => opt.key === newKey);

    if (!targetOption) {
      console.error(`Option with key "${newKey}" not found`);
      return;
    }

    const result = await updateSectionSetting(
      1,
      props.setting.id,
      targetOption.id,
    );
    emit("update", result);
  } catch (err) {
    console.error("Failed to update setting option:", err);
  }
};
</script>
<style scoped>
.setting-description {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  margin-right: 15px;
  padding-left: 15px;
  padding-right: 10px;
  height: 34px;
}

.setting-description p {
  margin: 0;
}

.setting-description img {
  padding-left: 10px;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
}
</style>
