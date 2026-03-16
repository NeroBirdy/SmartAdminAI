<template>
  <div class="btn-block">
    <button
      v-if="!item.done"
      class="done-btn header-sm"
      @click="changeDoneState(item)"
    >
      Выполнено
    </button>
    <button v-else class="done-btn-pushed" @click="changeDoneState(item)">
      <img
        src="../../assets/icons/check.svg"
        alt="Check image"
        class="check-img"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  item: Recommendation;
}>();

type Recommendation = {
  id: number;
  title: string;
  text: string;
  done: boolean;
};

const changeDoneState = async (item: Recommendation) => {
  try {
    await $fetch("/api/changeDoneState", {
      method: "POST",
      body: { id: item.id, done: !item.done },
    });

    item.done = !item.done;
  } catch (error) {
    console.error("Ошибка:", error);
  }
};
</script>

<style scoped>
.header-sm {
  color: #324260;
  padding-bottom: 3px;
}

.btn-block {
  min-width: 200px;
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.done-btn {
  min-width: 130px;
  height: 40px;
  border-radius: 16px;
  background-color: #2c71e4;
  color: #ffffff !important;
  margin-right: 20px;
}

.done-btn-pushed {
  min-width: 40px;
  min-height: 40px;
  background-color: #e9f3ff;
  border-radius: 16px;
  padding: 8px;
  margin-right: 20px;
}
</style>
