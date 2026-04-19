<template>
  <div class="lesson">
    <div class="inside-lesson">
      <div class="ellips-text">
        <div class="text">
          <p class="name second-text">{{ lesson.group.name }}</p>
          <p class="time second-text">
            {{ lessonTime() }}
          </p>
        </div>
        <div class="ellips-wrapper">
          <div class="ellips" :style="ellipsStyle"></div>
        </div>
      </div>
      <p class="venue second-text">
        {{ getVenueName(lesson.venue.name) }}
      </p>
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

const { lesson } = defineProps<{ lesson: Lesson }>();

const ellipsStyle = computed(() => ({
  backgroundColor: lesson.color,
}));

const lessonTime = () => {
  return `${lesson.startTime} - ${lesson.endTime}`;
};

const getVenueName = (name: string) => {
  const words = name.split(" ");
    const letters = words
    .filter((w) => isNaN(Number(w)))
    .map((w) => w.charAt(0).toUpperCase());
  const number = words.find((w) => !isNaN(Number(w)));

  return number ? `${letters.join("/")} ${number}` : letters.join("/");
};
</script>

<style scoped>
.lesson {
  width: 90%;
  background-color: rgb(240, 237, 237);
  border-radius: 7px;
  margin-top: 5px;
}

.inside-lesson {
  display: flex;
  flex-direction: column;
  min-height: 45px;
  padding: 5px 10px;
}

.ellips-wrapper {
  padding-top: 5px;
}

.ellips-text {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.text {
  display: flex;
  flex-direction: column;
}

.name {
  word-break: break-word;
  white-space: normal;
}

.ellips {
  height: 7px;
  width: 20px;
  border-radius: 5px;
}

.lesson h1,
p {
  margin: 0;
  padding: 0;
}

.header-sm {
  font-size: 13px;
}

.time,
.venue {
  color: rgb(49, 49, 49);
  font-size: 13px;
}
</style>
