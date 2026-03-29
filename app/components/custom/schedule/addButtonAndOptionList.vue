<template>
  <Transition name="option">
    <div class="add-button-wrapper" v-if="availableToAddMore">
      <button class="add-button" @click.stop="toggleList(listId)">
        <component class="add-button-img" :is="plusImg" />
      </button>
      <div class="option-list" v-if="isOpen(props.listId)">
        <div
          class="option"
          v-for="option in availableOptions"
          :key="option.id"
          @click.stop="addHandler(1, setting.id, option.id)"
        >
          <p class="header-sm">{{ option.name }}</p>
        </div>
      </div>
    </div>
  </Transition>
</template>
<script lang="ts" setup>
import plusImg from "~/assets/icons/plus.svg";

type Option = {
  id: number;
  key: string;
  name: string;
  settingDefinitionId: number;
};

type Setting = {
  id: number;
  key: string;
  maxValues: number;
  name: string;
  settingTypeId: number;
};

type SectionSetting = { id: number; option_name: string; option_key: string };

const props = defineProps<{
  listId: string;
  setting: Setting;
  options: Option[];
  sectionSettings: SectionSetting[];
}>();

const emit = defineEmits<{
  add: [sectionSetting: SectionSetting];
}>();

const { toggleList, isOpen, closeList } = useOptionList();

const availableToAddMore = computed(
  () => props.setting.maxValues > props.sectionSettings.length,
);

const availableOptions = computed(() => {
  const selectedKeys = new Set(
    (props.sectionSettings as SectionSetting[]).map((s) => s.option_key),
  );

  return (props.options as Option[]).filter(
    (opt) => !selectedKeys.has(opt.key),
  );
});

const addHandler = async (
  sectionId: number,
  settingDefinitionId: number,
  settingOptionId: number,
) => {
  try {
    const newSectionSetting = await $fetch("/api/schedule/addSectionSetting", {
      method: "POST",
      body: {
        sectionId: sectionId,
        settingDefinitionId: settingDefinitionId,
        settingOptionId: settingOptionId,
      },
    });

    emit("add", newSectionSetting);

    closeList();
  } catch (err) {
    console.error("Failed to add setting option:", err);
  }
};
</script>
<style scoped>
.add-button-wrapper {
  position: relative;
  width: 49px;
  flex-shrink: 0;
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
  align-items: center;
  margin-right: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition:
    transform 0.1s ease,
    box-shadow 0.1s ease;
}

.add-button:active {
  transform: scale(0.85);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.add-button img {
  align-self: center;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.add-button-img {
  overflow: visible;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
}

.option-list {
  position: absolute;
  top: calc(100% + 6px);
  white-space: nowrap;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 12px 40px 4px rgba(0, 0, 0, 0.12);
  border: 1px solid rgba(133, 144, 165, 0.2);
  z-index: 1000;
  animation: optionListAppear 0.3s ease;
}

.option {
  height: 34px;
  align-items: center;
  display: flex;
  cursor: pointer;
  padding: 0 15px;
  border-radius: 8px;
  text-align: left;
}

@keyframes optionListAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-6px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.option p {
  margin: 0;
}

.option:hover {
  background-color: #e9f3ff;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
}

.option-enter-active,
.option-leave-active {
  transition: all 0.2s ease;
}

.option-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.option-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

.option-move {
  transition: transform 0.25s ease;
}

.option-leave-active {
  position: absolute;
}
</style>
