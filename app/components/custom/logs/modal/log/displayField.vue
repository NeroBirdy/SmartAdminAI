<template>
  <div class="display-field">
    <div class="icon-title">
      <component class="icon" :is="getIcon()" />
      <p class="display-title header-sm">{{ display.title }}</p>
    </div>
    <p class="display-text main-text-sm">{{ display.text }}</p>
  </div>
</template>
<script lang="ts" setup>
import lessonIcon from "~/assets/icons/book.svg";
import groupIcon from "~/assets/icons/users.svg";
import dateIcon from "~/assets/icons/calendar.svg";
import clientIcon from "~/assets/icons/user.svg";

const props = defineProps<{ display: { title: string; text: string } }>();

const titleIcon: Record<string, string> = {
  Занятие: lessonIcon,
  Группа: groupIcon,
  Дата: dateIcon,
  Клиент: clientIcon,
};

function getIcon() {
  return titleIcon[props.display.title];
}
</script>

<style scoped>
.display-field {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-self: center;
  align-items: center;
  width: 100%;
  padding-top: 2.5px;
  padding-bottom: 2.5px;
}

.icon-title {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.icon {
  stroke: #9ca4aa;
  margin-right: 10px;
  margin-left: 5px;
}

.display-text {
  margin-right: 10px;
}

.header-sm,
.main-text-sm {
  color: #324260;
}

p {
  margin: 0;
}
</style>
