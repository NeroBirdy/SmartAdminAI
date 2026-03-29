<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      :d="enabled ? 'M15 15C16.6569 15 18 13.6569 18 12C18 10.3431 16.6569 9 15 9C13.3431 9 12 10.3431 12 12C12 13.6569 13.3431 15 15 15Z' : 'M9 15C10.6569 15 12 13.6569 12 12C12 10.3431 10.6569 9 9 9C7.34315 9 6 10.3431 6 12C6 13.6569 7.34315 15 9 15Z'"
      :fill="enabled ? '#4B9F47' : '#B4BCC5'"
      style="transition: fill 0.2s ease"
    />
    <path
      d="M15 5H9C5.13401 5 2 8.13401 2 12C2 15.866 5.13401 19 9 19H15C18.866 19 22 15.866 22 12C22 8.13401 18.866 5 15 5Z"
      :fill="enabled ? '#4B9F47' : '#B4BCC5'"
      style="transition: fill 0.2s ease"
    />
    <circle
      :cx="enabled ? 15 : 9"
      cy="12"
      r="4"
      fill="white"
      style="transition: cx 0.2s ease"
    />
  </svg>
</template>

<script lang="ts" setup>
defineProps<{ enabled?: boolean }>();
</script>