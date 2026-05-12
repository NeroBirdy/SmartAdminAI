<template>
  <div class="revert">
    <div class="separator"></div>
    <Transition name="status" mode="out-in">
      <div class="active" v-if="props.status === 'ACTIVE'" key="active">
        <div class="icon-title">
          <div class="revert-btn" @click="toggleConfirm">
            <component class="icon undo" :is="undoIcon" />
            <p class="revert-title main-text-sm">Откатить</p>
          </div>
        </div>
      </div>
      <div class="reverted" v-else key="reverted">
        <div class="icon-title">
          <component class="icon check" :is="checkIcon" />
          <p class="revert-title main-text-sm">Изменения отменены</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import checkIcon from "~/assets/icons/circle_check.svg";
import undoIcon from "~/assets/icons/undo.svg";

import type { LogStatus } from "~~/prisma/generated/prisma/db1/enums";

const props = defineProps<{ logId: number; status: LogStatus }>();

const openConfirm = inject<(logId: number) => void>("openConfirm")!;

function toggleConfirm() {
  openConfirm(props.logId);
}
</script>

<style scoped>
.revert {
  display: flex;
  flex-direction: column;
}

.separator {
  width: 97%;
  height: 0.5px;
  background-color: #cfd3da;
  align-self: center;
  margin: 6px 0;
}

.revert-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 0;
  border-radius: 6px;
  cursor: pointer;
}

.revert-btn:hover .revert-title {
  color: #2067df;
}

.revert-btn:hover .undo {
  stroke: #2067df;
}

.revert-btn:active {
  transform: scale(0.97);
  transition: transform 0.1s ease;
}

.active,
.reverted {
  transform-origin: right center;
}

.active {
  margin-right: 20px;
}
.reverted {
  margin-right: 10px;
}

.icon {
  margin-right: 10px;
}

.revert-title {
  color: #324260;
}

.icon-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  height: 40px;
}

.undo {
  stroke: #4983e7;
}

.check :deep(path) {
  stroke: #9ca4aa;
}

p {
  margin: 0;
}

.status-enter-active,
.status-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.status-enter-from,
.status-leave-to {
  opacity: 0;
  transform: scale(0.7);
}

.status-enter-to,
.status-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
