<template>
  <div class="dev-menu-row" :class="activeClass" @click="handleClick">
    <component :is="props.icon" class="icon" />
    <p class="header-sm">{{ text }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  icon: string;
  text: string;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const isActive = ref(false);

const activeClass = computed(() => ({
  active: isActive.value
}));

let timeoutId: ReturnType<typeof setTimeout> | null = null;

const handleClick = () => {
  if (timeoutId) clearTimeout(timeoutId);

  isActive.value = true;
  emit("click");

  timeoutId = setTimeout(() => {
    isActive.value = false;
  }, 750);
};
</script>

<style scoped>
.dev-menu-row {
  display: flex;
  flex-direction: row;
  margin-left: 20px;
  margin-bottom: 20px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dev-menu-row.active .icon :deep(path) {
  stroke: #6897fd;
}

.dev-menu-row.active .header-sm {
  color: #000000;
}

.header-sm {
  color: #717e97;
  margin: 0;
  transition: color 0.2s;
}

.icon {
  align-self: center;
  overflow: visible;
  margin: 0;
  padding: 0;
  margin-right: 12px;
}
</style>
