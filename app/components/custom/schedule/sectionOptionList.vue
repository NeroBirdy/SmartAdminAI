<template>
  <TransitionGroup name="tag" tag="div" class="tags-wrapper">
    <div
      class="setting-description"
      :class="whiteBackClass"
      v-for="option in sectionSettings"
      :key="option.id"
    >
      <p class="header-sm">{{ option.option_name }}</p>
      <component
        class="remove-img"
        :is="removeImg"
        @click.stop="deleteHandler(option.id)"
      />
    </div>
  </TransitionGroup>
</template>
<script lang="ts" setup>
import { deleteSectionSetting } from "~/api/schedule/deleteSectionSetting";
import removeImg from "~/assets/icons/remove.svg";

type Setting = {
  id: number;
  key: string;
  maxValues: number;
  name: string;
  settingTypeId: number;
};

type SectionSetting = { id: number; option_name: string; option_key: string };

const whiteBackClass = computed(() => ({
  "white-back": availableToAddMore || props.sectionSettings.length > 1,
}));

const props = defineProps<{
  setting: Setting;
  sectionSettings: SectionSetting[];
}>();

const emit = defineEmits<{
  delete: [id: number];
}>();

const availableToAddMore = computed(
  () => props.setting.maxValues > props.sectionSettings.length,
);

const deleteHandler = async (id: number) => {
  try {
    await deleteSectionSetting(id);
    emit("delete", id);
  } catch (err) {
    console.error("Failed to delete setting option:", err);
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

.white-back {
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
  border-radius: 25px;
}

.remove-img {
  overflow: visible;
}

.tag-enter-active,
.tag-leave-active {
  transition: all 0.25s ease;
}

.tag-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.tag-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.tag-move {
  transition: transform 0.25s ease;
}

.tag-leave-active {
  position: absolute;
}

.tags-wrapper {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
</style>
