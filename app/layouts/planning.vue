<template>
  <div class="main">
    <LayoutHeader>Расписание</LayoutHeader>
    <div class="content">
      <LayoutScheduleSideBar />
      <div class="center">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>

const schedule = useSchedule();
provide("schedule", schedule);
</script>
