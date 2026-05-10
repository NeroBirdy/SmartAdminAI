<template>
  <div class="frame log">
    <div class="inside-frame">
      <div class="log-title">
        <div class="left">
          <div class="ellips-wrapper">
            <div class="ellips"></div>
          </div>
          <p class="employee header-sm">{{ getTitle() }}</p>
        </div>
        <div class="right">
          <p class="date main-text-sm">{{ getDate() }}</p>
          <component
            :is="arrow"
            class="arrow"
            :class="arrowStyle"
            @click.stop="isOpen = !isOpen"
          />
        </div>
      </div>
      <Transition name="slide-down"
        ><div class="content" v-if="isOpen">
          <custom-logs-modal-display
            v-if="log.display.length"
            :display="log.display"
          />
          <custom-logs-modal-changes
            v-if="log.changes.length"
            :changes="log.changes"
          /></div
      ></Transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { JsonValue } from "@prisma/client/runtime/client";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ru } from "date-fns/locale";
import arrow from "~/assets/icons/chevron_down.svg";
import type { ChangeType } from "~~/prisma/generated/prisma/db1/enums";
type DisplayField = { title: string; text: string };
type ChangeField = {
  title: string;
  oldValue: string | null;
  newValue: string | null;
};

type Log = {
  id: number;
  changeType: ChangeType;
  employee: { firstName: string; lastName: string } | null;
  display: DisplayField[];
  changes: ChangeField[];
  createdAt: string;
};

const props = defineProps<{ log: Log }>();

const isOpen = ref(false);

const arrowStyle = computed(() => ({
  open: isOpen.value,
}));

function getTitle() {
  if (props.log.employee) {
    return props.log.employee.firstName + " " + props.log.employee.lastName;
  }
  return "ИИ Ассистент";
}

function getDate() {
  const date = format(props.log.createdAt, "dd MMM yyyy, HH:mm", {
    locale: ru,
  });
  return date;
}
</script>

<style scoped>
.log {
  width: 90%;
  display: flex;
  flex-direction: column;
  align-self: center;
  margin-bottom: 10px;
}

.inside-frame {
  padding: 5px;
}

.log-title {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  min-height: 40px;
}

.right,
.left {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ellips-wrapper {
  padding-left: 10px;
  padding-right: 15px;
}

.ellips {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: #4983e7;
}

.arrow {
  transition: transform 0.3s ease;
  cursor: pointer;
  margin-right: 5px;
  margin-left: 5px;
}

.arrow.open {
  transform: rotate(180deg);
}

.arrow :deep(path) {
  stroke: #4983e7;
}

.content {
  display: flex;
  flex-direction: column;
}

.employee {
  color: #2b3850;
}

.date {
  font-size: 12.5px;
  color: #222222;
}

p {
  margin: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
