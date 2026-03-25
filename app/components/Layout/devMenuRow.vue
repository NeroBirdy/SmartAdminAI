<template>
  <div class="dev-menu-row" :class="{ active: isActive }" @click="handleClick">
    <img class="icon" :src="props.icon" />
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

.dev-menu-row.active .icon {
  filter: saturate(4);
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
  margin-right: 12px;
}
</style>
