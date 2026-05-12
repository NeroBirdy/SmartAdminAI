<template>
  <div class="title-texts">
    <div class="header-icon">
      <h1 class="header-md">{{ title }}</h1>
      <component class="icon" :is="closeIcon" @click.stop="emit('close')" />
    </div>
    <custom-logs-modal-title-filter-categories />
  </div>
</template>

<script lang="ts" setup>
import closeIcon from "~/assets/icons/x.svg";

const props = defineProps<{ title: string }>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
.title-texts {
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 28px;
  padding-bottom: 15px;
}

.title-texts p {
  margin: 0;
}

.title-texts h1 {
  margin: 0;
}

.header-icon {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.icon {
  cursor: pointer;
}

.header-md {
  color: #2b3850;
  padding-bottom: 3px;
}
</style>
