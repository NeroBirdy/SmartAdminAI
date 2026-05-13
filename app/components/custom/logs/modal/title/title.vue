<template>
  <div class="title-texts">
    <div class="header-icon">
      <h1 class="header-md">{{ title }}</h1>
      <component class="icon" :is="closeIcon" @click.stop="emit('close')" />
    </div>
    <div class="btns">
      <custom-logs-modal-title-filter-title
        class="filter-title-category"
        type="category"
      />
      <custom-logs-modal-title-filter-title
        class="filter-title-date"
        type="date"
      />
    </div>
  </div>
  <Transition name="fade">
    <custom-logs-modal-title-filter-categories v-if="categoryFilterOpen" />
  </Transition>
  <Transition name="fade">
    <custom-logs-modal-title-filter-date v-if="dateFilterOpen" />
  </Transition>
</template>

<script lang="ts" setup>
import closeIcon from "~/assets/icons/x.svg";

const props = defineProps<{ title: string }>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { categoryFilterOpen, dateFilterOpen } = useLogsFilters();
</script>

<style scoped>
.title-texts {
  z-index: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 28px;
  padding-bottom: 0;
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

.btns {
  display: flex;
  flex-direction: row;
}

.fade-enter-active {
  transition: all 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
