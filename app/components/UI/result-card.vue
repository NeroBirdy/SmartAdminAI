<template>
  <div class="frame second-frame-results">
    <div class="inside-frame">
      <div class="second-frame-up">
        <p class="second-frame-text main-text-md">{{ title }}</p>
        <component class="second-frame-img" :is="ellipsisImg" />
      </div>
      <h1 class="second-frame-header-text header-2xl">{{ text }}</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ellipsisImg from "~/assets/icons/ellipsis.svg";

defineProps<{
title: string,
text: string
}>();
</script>

<style scoped>
.frame {
  margin-top: 10px;
}

.second-frame-results {
  width: 348px;
  height: 110px;
  margin-right: 15px;
}

.inside-frame {
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  padding-left: 30px;
  margin-bottom: 10px;
}

.second-frame-up {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.second-frame-img {
  margin-right: 20px;
  overflow: visible;
  align-self: center;
}

.second-frame-header-text {
  margin: 0;
}
</style>