<template>
  <div class="frame second-frame-results">
    <div class="inside-frame">
      <Transition name="fade" mode="out-in">
        <div class="loader-wrapper" v-if="isLoading" key="loader">
          <ui-loader />
        </div>
        <div v-else key="content">
          <div class="second-frame-up">
            <p class="second-frame-text main-text-sm">{{ title }}</p>
            <component
              class="second-frame-img"
              :is="ellipsisImg"
              @click="isModalOpen = true"
            />
          </div>
          <h1 class="second-frame-header-text header-2xl">{{ count }}</h1>
        </div>
      </Transition>
    </div>
  </div>
  <CustomLogsModalWithOverlay
    :isModalOpen="isModalOpen"
    :type="type"
    @close="isModalOpen = false"
  />
</template>

<script lang="ts" setup>
import { getCount } from "~/api/logs/getCount";
import ellipsisImg from "~/assets/icons/ellipsis.svg";
import type { ChangeType } from "~~/prisma/generated/prisma/db1/enums";

const props = defineProps<{
  title: string;
  type: ChangeType;
}>();

const isLoading = ref(true);
const isModalOpen = ref(false);
const count = ref(0);

onMounted(async () => {
  count.value = await getCount(props.type);
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});
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
  height: 100%;
}

.loader-wrapper {
  display: flex;
  margin: auto;
  padding-right: 30px;
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

.second-frame-text {
  margin-top: 19px;
  margin-bottom: 11px;
  color: #8590a5;
}

.second-frame-header-text {
  margin: 0;
  color: #2b3850;
}

.fade-enter-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
}
</style>
