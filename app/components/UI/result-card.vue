<template>
  <div class="frame second-frame-results">
    <div class="inside-frame">
      <div class="second-frame-up">
        <p class="second-frame-text main-text-md">{{ title }}</p>
        <img
          class="second-frame-img"
          src="../../assets/icons/ellipsis.svg"
          alt=""
        />
      </div>
      <h1 class="second-frame-header-text header-2xl">{{ text }}</h1>
    </div>
  </div>
</template>

<script lang="ts" setup>

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
}

.second-frame-header-text {
  margin: 0;
}
</style>