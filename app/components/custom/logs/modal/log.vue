<template>
  <div class="frame log">
    <div class="inside-frame">
      <custom-logs-modal-log-title
        :log="log"
        :isOpen="isOpen"
        @open="isOpen = !isOpen"
      />
      <Transition name="slide-down"
        ><div class="content" v-if="isOpen">
          <custom-logs-modal-display
            v-if="log.display.length"
            :display="log.display"
            :log-id="log.id"
            :type="log.changeType"
            :status="log.status"
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
import type {
  ChangeType,
  LogStatus,
} from "~~/prisma/generated/prisma/db1/enums";

type DisplayField = { title: string; text: string };
type ChangeField = {
  title: string;
  oldValue: string | null;
  newValue: string | null;
};

type Log = {
  id: number;
  status: LogStatus;
  changeType: ChangeType;
  employee: { firstName: string; lastName: string } | null;
  display: DisplayField[];
  changes: ChangeField[];
  createdAt: string;
};

const props = defineProps<{ log: Log }>();

const isOpen = ref(false);
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
