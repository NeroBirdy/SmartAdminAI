<template>
  <div class="days-of-week">
    <div class="day-of-week cal-md" v-for="value in daysOfWeek" :key="value">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const daysOfWeek = ["пн", "вт", "ср", "чт", "пт", "сб", "вс"];
</script>

<style scoped>
.days-of-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding-top: 5px;
}

.day-of-week {
  text-align: center;
  color: #9da4b1;
  text-transform: uppercase;
  pointer-events: none;
}
</style>
