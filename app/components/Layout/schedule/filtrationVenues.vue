<template>
  <div class="venue-list">
    <div class="header-arrow">
      <h1 class="header-sm">Места</h1>
      <component
        :is="arrow"
        class="arrow"
        :class="{ active: isOpen }"
        @click="isOpen = !isOpen"
      />
    </div>
    <Transition @enter="onEnter" @leave="onLeave">
      <div class="list" v-if="isOpen">
        <div class="checkbox-item" @click="toggleAllVenues">
          <div
            class="checkbox"
            :style="{
              backgroundColor: isAllVenuesSelected ? '#6a758b' : 'transparent',
              borderColor: '#6a758b',
            }"
          >
            <component
              :is="checkImg"
              v-if="isAllVenuesSelected"
              class="check-img"
            />
          </div>
          <p class="cal-md">Все места</p>
        </div>
        <div
          class="checkbox-item"
          v-if="isOpen"
          v-for="venue in venues"
          :key="venue.id"
          @click="toggleVenue(venue.id)"
        >
          <div
            class="checkbox"
            :class="{ checked: selectedVenues.includes(venue.id) }"
          >
            <component
              :is="checkImg"
              v-if="selectedVenues.includes(venue.id)"
              class="check-img"
            />
          </div>
          <p class="cal-md">{{ venue.name }}</p>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script lang="ts" setup>
import checkImg from "~/assets/icons/check_cal.svg";
import arrow from "~/assets/icons/chevron_up.svg";

const { venues, selectedVenues } =
  inject<ReturnType<typeof useSchedule>>("schedule")!;

const isOpen = ref(true);

const toggleVenue = (id: number) => {
  if (selectedVenues.value.includes(id)) {
    selectedVenues.value = selectedVenues.value.filter((g) => g !== id);
  } else {
    selectedVenues.value.push(id);
  }
};

const isAllVenuesSelected = computed(
  () =>
    venues.value.length > 0 &&
    venues.value.every((v) => selectedVenues.value.includes(v.id)),
);

const toggleAllVenues = () => {
  if (isAllVenuesSelected.value) {
    selectedVenues.value = [];
  } else {
    selectedVenues.value = venues.value.map((v) => v.id);
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
.venue-list {
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
  background-color: #2c71e4;
  border-color: #2c71e4;
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
