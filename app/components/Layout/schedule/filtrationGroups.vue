<template>
  <div class="group-list">
    <div class="header-arrow">
      <h1 class="header-sm">Группы</h1>
      <component
        :is="arrow"
        class="arrow"
        :class="{ active: isOpen }"
        @click="isOpen = !isOpen"
      />
    </div>
    <Transition @enter="onEnter" @leave="onLeave">
      <div class="list" v-if="isOpen">
        <div
          class="checkbox-item"
          v-if="isOpen"
          v-for="group in groups"
          :key="group.id"
          @click="toggleGroup(group.id)"
        >
          <div
            class="checkbox"
            :style="{
              backgroundColor: selectedGroups.includes(group.id)
                ? getGroupColor(group.id)
                : 'transparent',
              borderColor: getGroupColor(group.id),
            }"
          >
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

const { groups, venues, selectedGroups, getGroupColor } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const isOpen = ref(true);

const toggleGroup = (id: number) => {
  if (selectedGroups.value.includes(id)) {
    selectedGroups.value = selectedGroups.value.filter((g) => g !== id);
  } else {
    selectedGroups.value.push(id);
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

p, h1{
  margin: 0;
}
</style>
