<template>
  <div class="display">
    <div class="inside-display">
      <custom-logs-modal-log-display-field
        v-for="item in display"
        :key="item.title"
        :display="item"
      />
      <custom-logs-modal-log-revert
        v-if="revertFor.includes(type)"
        :status="status"
        :log-id="logId"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {
  ChangeType,
  LogStatus,
} from "~~/prisma/generated/prisma/db1/enums";

const props = defineProps<{
  display: { title: string; text: string }[];
  logId: number;
  type: ChangeType;
  status: LogStatus;
}>();

const revertFor = [
  "DATE_CHANGE",
  "VENUE_CHANGE",
  "INSTRUCTOR_CHANGE",
  "LESSON_CREATE",
  "LESSON_CANCELLATION",
  "ASSIGNED_TO_GROUP",
  "LOG_ROLLBACK",
];
</script>

<style scoped>
.display {
  display: flex;
  flex-direction: column;
  width: 95%;
  align-self: center;
  background-color: #e4e7eb;
  border-radius: 8px;
  margin-bottom: 5px;
}

.inside-display {
  display: flex;
  flex-direction: column;
  margin: 7px 5px;
}
</style>
