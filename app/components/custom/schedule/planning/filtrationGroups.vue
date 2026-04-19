<template>
  <div class="group-list">
    <div class="header-arrow">
      <h1 class="header-sm">Группы</h1>
      <component
        :is="arrow"
        class="arrow"
        :class="activeClass"
        @click="isOpen = !isOpen"
      />
    </div>
    <Transition @enter="onEnter" @leave="onLeave">
      <div class="list" v-if="isOpen">
        <div class="checkbox-item" @click="toggleAllGroups">
          <div class="checkbox" :style="allGroupCheckBoxStyle">
            <component
              :is="checkImg"
              v-if="isAllGroupsSelected"
              class="check-img"
            />
          </div>
          <p class="cal-md">Все группы</p>
        </div>

        <div
          class="checkbox-item"
          v-if="isOpen"
          v-for="group in groups"
          :key="group.id"
          @click="toggleGroup(group.id)"
        >
          <div class="checkbox" :style="groupCheckBoxStyle(group)">
            <component
              :is="checkImg"
              v-if="selectedGroups.includes(group.id)"
              class="check-img"
            />
          </div>
          <p class="cal-md">{{ group.name }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import checkImg from "~/assets/icons/check_cal.svg";
import arrow from "~/assets/icons/chevron_up.svg";

const { groups, selectedGroups } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const isOpen = ref(true);

const activeClass = computed(() => ({
  active: isOpen.value,
}));

const allGroupCheckBoxStyle = computed(() => ({
  backgroundColor: isAllGroupsSelected.value ? "#6a758b" : "transparent",
  borderColor: "#6a758b",
}));

const groupCheckBoxStyle = (group: { id: number; color: string }) => ({
  backgroundColor: selectedGroups.value.includes(group.id)
    ? group.color
    : "transparent",
  borderColor: group.color,
});

const toggleGroup = (id: number) => {
  if (selectedGroups.value.includes(id)) {
    selectedGroups.value = selectedGroups.value.filter((g) => g !== id);
  } else {
    selectedGroups.value.push(id);
  }
};

const isAllGroupsSelected = computed(
  () =>
    groups.value.length > 0 &&
    groups.value.every((g) => selectedGroups.value.includes(g.id)),
);

const toggleAllGroups = () => {
  if (isAllGroupsSelected.value) {
    selectedGroups.value = [];
  } else {
    selectedGroups.value = groups.value.map((g) => g.id);
  }
};

const onEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.overflow = "hidden";
  element.style.height = "0";
  element.style.opacity = "0";
  element.offsetHeight;
  element.style.transition = "height 0.4s ease, opacity 0.4s ease";
  element.style.height = element.scrollHeight + "px";
  element.style.opacity = "1";
};

const onLeave = (el: Element) => {
  const element = el as HTMLElement;
  element.style.overflow = "hidden";
  element.style.height = element.scrollHeight + "px";
  element.offsetHeight;
  element.style.transition = "height 0.4s ease, opacity 0.4s ease";
  element.style.height = "0";
  element.style.opacity = "0";
};
</script>

<style scoped>
.group-list {
  display: flex;
  flex-direction: column;
}

.header-arrow {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.checkbox {
  width: 12px;
  height: 12px;
  margin-right: 10px;
  border: 2px solid #d0d5dd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
}

.checkbox.checked {
  background-color: #3a8aef;
  border-color: #3a8aef;
}

.check-img :deep(path) {
  stroke: white !important;
}

.arrow :deep(path) {
  stroke: #6a758b;
}

.arrow.active {
  transform: rotate(180deg);
}

p,
h1 {
  margin: 0;
}
</style>
