<template>
  <div class="setting-card" v-if="!loading">
    <div class="inside-setting-card">
      <h1 class="second-text">{{ setting.name }}</h1>
      <div class="btn-and-options">
        <template v-if="setting.settingType.key != 'boolean'">
          <custom-schedule-add-button-and-option-list
            :setting="setting"
            :section-settings="sectionSettings"
            :options="options"
            :list-id="listId"
            @add="(item: SectionSetting) => addToSectionSetting(item)"
          />
          <custom-schedule-section-option-list
            :section-settings="sectionSettings"
            :setting="setting"
            @delete="(id: number) => deleteFromSectionSetting(id)"
          />
        </template>
        <template v-else>
          <custom-schedule-setting-toggle
            :section-settings="sectionSettings"
            :setting="setting"
            :options="options"
            @update="(item: SectionSetting) => updateSectionSetting(item)"
          />
        </template>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { getSettingsByKey } from "~/api/schedule/getSettingsByKey";

const props = defineProps<{
  queryKey: string;
}>();

type SectionSetting = { id: number; option_name: string; option_key: string };

const { closeList } = useOptionList();

const listId = `setting-${props.queryKey}`;

const setting = ref();
const options = ref();
const sectionSettings = ref();

const loading = ref(true);
const error = ref<string | null>(null);

const addToSectionSetting = (item: any) => {
  sectionSettings.value.push(item);
};

const deleteFromSectionSetting = (id: number) => {
  sectionSettings.value = (sectionSettings.value as SectionSetting[]).filter(
    (item) => item.id !== id,
  );
};

const updateSectionSetting = (item: SectionSetting) => {
  const index = (sectionSettings.value as SectionSetting[]).findIndex(
    (s) => s.id === item.id,
  );

  if (index !== -1) {
    sectionSettings.value[index] = item;
  } else {
    sectionSettings.value.push(item);
  }
};

const getData = async () => {
  try {
    loading.value = true;
    error.value = null;

    const data = await getSettingsByKey(props.queryKey);

    setting.value = data.setting;
    options.value = data.options;
    sectionSettings.value = data.sectionSettings;

    console.log(data.options);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Ошибка загрузки";
    console.error("Failed to load settings:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getData();
  document.addEventListener("click", closeList);
});

onUnmounted(() => {
  document.removeEventListener("click", closeList);
});
</script>
<style scoped>
.setting-card {
  margin-left: 30px;
}

.second-text {
  color: #8590a5;
}

.btn-and-options {
  display: flex;
  flex-direction: row;
}
</style>
