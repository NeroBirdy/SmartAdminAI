<template>
  <div class="setting-card" v-if="!loading">
    <div class="inside-setting-card">
      <h1 class="second-text">{{ setting.name }}</h1>
      <div class="btn-and-options">
        <button
          class="add-button"
          @click="showOptionList = !showOptionList"
          v-if="availableToAddMore"
        >
          <img src="../../../assets/icons/plus.svg" alt="" />
          <div class="option-list" v-if="showOptionList">
            <div
              class="option"
              v-for="option in availableOptions"
              @click="addHandler(1, setting.id, option.id)"
            >
              <p>{{ option.name }}</p>
            </div>
          </div>
        </button>
        <div
          class="setting-description"
          :class="{
            'white-back': availableToAddMore || sectionSettings.length > 1,
          }"
          v-for="option in sectionSettings"
        >
          <p class="header-sm">{{ option.option_name }}</p>
          <img
            src="../../../assets/icons/remove.svg"
            alt=""
            @click="deleteHandler(option.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
type Option = {
  id: number;
  key: string;
  name: string;
  settingDefinitionId: number;
};
type SectionSetting = { id: number; option_name: string; option_key: string };

const props = defineProps<{
  queryKey: string;
}>();

const setting = ref();
const options = ref();
const sectionSettings = ref();

const availableToAddMore = ref(false);

const loading = ref(true);
const error = ref<string | null>(null);

const showOptionList = ref(false);

const updateAvailableOption = () => {
  availableToAddMore.value =
    setting.value.maxValues > sectionSettings.value.length;
};

const availableOptions = computed(() => {
  const selectedKeys = new Set(
    (sectionSettings.value as SectionSetting[]).map((s) => s.option_key),
  );

  return (options.value as Option[]).filter(
    (opt) => !selectedKeys.has(opt.key),
  );
});

const addHandler = async (
  sectionId: number,
  settingDefinitionId: number,
  settingOptionId: number,
) => {
  try {
    const newsectionSetting = await $fetch("/api/schedule/addSectionSetting", {
      method: "POST",
      body: {
        sectionId: sectionId,
        settingDefinitionId: settingDefinitionId,
        settingOptionId: settingOptionId,
      },
    });
    sectionSettings.value.push(newsectionSetting);

    updateAvailableOption();
  } catch (err) {
    console.error("Failed to add setting option:", err);
  }
};

const deleteHandler = async (id: number) => {
  try {
    await $fetch("/api/schedule/deleteSectionSetting", {
      method: "POST",
      body: {
        id: id,
      },
    });
    sectionSettings.value = (sectionSettings.value as SectionSetting[]).filter(
      (item) => item.id !== id,
    );

    updateAvailableOption();
  } catch (err) {
    console.error("Failed to delete setting option:", err);
  }
};

const getData = async () => {
  try {
    loading.value = true;
    error.value = null;

    const data = await $fetch("/api/schedule/getSettingsByKey", {
      method: "POST",
      body: {
        sectionId: 1,
        key: props.queryKey,
      },
    });

    setting.value = data.setting;
    options.value = data.options;
    sectionSettings.value = data.sectionSettings;

    updateAvailableOption();

    console.log(data);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Ошибка загрузки";
    console.error("Failed to load settings:", err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getData();
});
</script>
<style scoped>
.setting-card {
  margin-left: 30px;
}

.second-text {
  color: #8590a5;
}

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

.add-button {
  width: 34px;
  height: 34px;
  background-color: white;
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
  border: 0;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  margin-right: 15px;
}

.add-button img {
  align-self: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.btn-and-options {
  display: flex;
  flex-direction: row;
}

.white-back {
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
  border-radius: 25px;
}

.option-list {
  position: absolute;
  margin-left: 175px;
  min-width: 110px;
  background-color: white;

  border-radius: 16px;
  box-shadow: 0 12px 40px 4px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(133, 144, 165, 0.2);

  overflow-y: auto;
  z-index: 1;

  /* animation: 0.2s ease-out; */
}

.option {
  width: 100%;
  height: 34px;
  align-items: center;
  display: flex;
  justify-content: center;
}

.option p {
  margin: 0;
}

.option:hover {
  background-color: #e9f3ff;
}
</style>
