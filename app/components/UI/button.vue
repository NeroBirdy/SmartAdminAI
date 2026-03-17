<template>
  <button>
    <slot />
  </button>
</template>

<script lang="ts" setup></script>

<style scoped>
button {
  min-width: 130px;
  min-height: 40px;
  border-radius: 16px;
  background-color: #2c71e4;
  color: #ffffff !important;
  appearance: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
}
</style>
