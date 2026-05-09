<template>
  <div class="change-field">
    <p class="change-title header-sm">{{ change.title }}</p>
    <div class="old-and-new">
      <div class="old-wrapper" v-if="change.oldValue">
        <p class="old main-text-sm">
          {{ change.oldValue }}
        </p>
      </div>
      <component
        :is="arrowRight"
        class="arrow-right"
        v-if="change.oldValue && change.newValue"
      />
      <div class="new-wrapper" v-if="change.newValue">
        <p class="new main-text-sm">
          {{ change.newValue }}
        </p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import arrowRight from "~/assets/icons/arrow_right.svg";

defineProps<{
  change: { title: string; oldValue: string | null; newValue: string | null };
}>();
</script>

<style scoped>
.change-field {
  display: flex;
  flex-direction: row;
  align-self: center;
  width: 95%;
  padding-bottom: 5px;
}

.change-title {
  min-width: 60px;
  margin-right: 10px;
  color: #2b3850;
  margin-top: 2px;
}

.old-and-new {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.old-wrapper {
  background-color: #dee2e6;
  color: #324260;
  border-radius: 10px;
}

.new-wrapper {
  background-color: #e9f3ff;
  color: #2067df;
  border-radius: 10px;
}

.old,
.new {
  margin: 5px;
}

p {
  margin: 0;
}

.arrow-right {
  scale: 0.5;
}
</style>
