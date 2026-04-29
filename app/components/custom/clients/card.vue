<template>
  <div class="frame second-frame-skills">
    <div class="second-frame-title">
      <component class="sparkle" :is="sparklesImg" />
      <div class="right">
        <div class="title-texts">
          <h1 class="header-sm">{{ header.title }}</h1>
          <p class="description main-text-sm">
            {{ header.description }}
          </p>
        </div>
      </div>
    </div>
    <div v-if="help.exist" class="second-frame-content">
      <ui-help :title="help.title!" :text="help.text!" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import sparklesImg from "~/assets/icons/sparkles.svg";

defineProps<{
  header: {
    title: string;
    description: string;
  };
  help: {
    exist: boolean;
    title?: string;
    text?: string;
  };
}>();
</script>

<style scoped>
.frame {
  margin-top: 10px;
}

.inside-frame {
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  padding-left: 30px;
  margin-bottom: 10px;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
}

.main-text-sm {
  color: #6a758b;
}

.right {
  display: flex;
  justify-content: space-between;
  width: 97%;
}

.frame-header {
  margin: 0;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 24px;
}

.second-frame-skills {
  margin-top: 0 !important;
  min-height: 78px;
  margin-right: 30px;
  margin-bottom: 12px;
}

.second-frame-title {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sparkle {
  overflow: visible;
  align-self: center;
  padding: 0 16px;
}

.title-texts {
  display: flex;
  flex-direction: column;
}

.title-texts p {
  margin: 0;
}

.title-texts h1 {
  margin-bottom: 0;
}

.second-text {
  color: #8590a5;
}
</style>
