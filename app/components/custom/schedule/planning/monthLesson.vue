<template>
  <div class="lesson" :class="isCurrentMonthClass">
    <div class="inside-lesson" :class="expandedClass">
      <div class="text">
        <p class="name second-text">{{ lesson.group.name }}</p>
        <Transition name="fade">
          <p class="time second-text" v-if="isExpanded">
            {{ lessonTime() }}
          </p>
        </Transition>
      </div>
      <div class="ellips-wrapper">
        <div class="ellips" :style="ellipsStyle"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
type Lesson = {
  id: string;
  startTime: string;
  endTime: string;
  group: {
    id: number;
    name: string;
  };
  venue: {
    id: number;
    name: string;
  };
  color: string;
};
const { lesson, isExpanded, isCurrentMonth } = defineProps<{
  lesson: Lesson;
  isExpanded: boolean;
  isCurrentMonth: boolean;
}>();

const expandedClass = computed(() => ({
  expanded: isExpanded,
}));

const isCurrentMonthClass = computed(() => ({
  'notCurrentMonth': !isCurrentMonth,
}));

const ellipsStyle = computed(() => ({
  backgroundColor: lesson.color,
}));

const lessonTime = () => {
  return `${lesson.startTime} - ${lesson.endTime}`;
};
</script>

<style scoped>
.notCurrentMonth {
  background-color: #dedfe2 !important;
}

.lesson {
  width: 90%;
  background-color: rgb(240, 237, 237);
  border-radius: 7px;
  margin-top: 5px;
}

.inside-lesson {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  min-height: 30px;

  transition: min-height 0.3s ease;
}

.inside-lesson.expanded {
  min-height: 45px;
}

.text {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.ellips {
  height: 7px;
  width: 20px;
  border-radius: 5px;
  margin-right: 10px;
}

.lesson h1,
p {
  margin: 0;
  padding: 0;
}

.header-sm {
  font-size: 13px;
}

.time {
  color: rgb(49, 49, 49);
  font-size: 13px;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    max-height 0.3s ease;
  max-height: 20px;
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
