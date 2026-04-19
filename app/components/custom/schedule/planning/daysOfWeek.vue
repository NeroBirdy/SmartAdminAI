<template>
  <div class="days-of-week">
    <div
      class="day-of-week cal-md"
      v-for="value in daysOfWeek"
      :key="value"
      :class="getDayClasses(value)"
    >
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const getDayClasses = (value: string) => ({
  weekend: value === "сб" || value === "вс",
});

const daysOfWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
</script>

<style scoped>
.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding-bottom: 5px;
}

.day-of-week {
  text-align: center;
  color: #9da4b1;
  text-transform: uppercase;
}

.day-of-week.weekend {
  color: #eb754c;
}
</style>
