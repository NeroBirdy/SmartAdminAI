<template>
  <svg width="42" height="24" viewBox="0 0 42 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      width="42"
      height="24"
      rx="12"
      :fill="enabled ? '#4B9F47' : '#B4BCC5'"
      style="transition: fill 0.2s ease"
    />
    <circle
      :cx="enabled ? 30 : 12"
      cy="12"
      r="8"
      fill="white"
      style="transition: cx 0.2s ease"
    />
  </svg>
</template>

<script lang="ts" setup>
defineProps<{ enabled?: boolean }>();
</script>