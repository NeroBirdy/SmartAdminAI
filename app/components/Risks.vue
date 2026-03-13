<template>
  <Loading v-if="loading" />
  <div v-else>
    <div class="frame">
      <h1 class="frame-header header-md">
        Рекомендации (Growth opportunities)
      </h1>
      <div class="inside-frame">
        <div
          class="frame second-frame"
          v-for="item in recommendations"
          :key="item.id"
        >
          <div class="blue-dot"></div>
          <div class="texts">
            <div class="second-frame-title header-sm">{{ item.title }}</div>
            <div class="second-frame-text main-text-sm">{{ item.text }}</div>
          </div>
          <div class="btn-block">
            <button
              v-if="!item.done"
              class="done-btn header-sm"
              @click="changeDoneState(item)"
            >
              Выполнено
            </button>
            <button
              v-else
              :style="{ 'background-image': checkImg }"
              class="done-btn-pushed"
              @click="changeDoneState(item)"
            >
              <img
                src="../assets/icons/check.svg"
                alt="Check image"
                class="check-img"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="frame">
      <h1 class="frame-header header-md">Риски (Risks)</h1>
      <div class="inside-frame">
        <div
          class="frame second-frame"
          v-for="(item, index) in risks"
          :key="index"
        >
          <div class="red-dot"></div>
          <div class="texts">
            <div class="second-frame-title header-sm">{{ item.title }}</div>
            <div class="second-frame-text main-text-sm">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
const recommendations = ref();
const risks = ref();
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await $fetch("/api/risks");

    recommendations.value = response.recommendations || [];
    risks.value = response.risks || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
});

const changeDoneState = async (item) => {
  try {
    const response = await $fetch("/api/changeDoneState", {
      method: "POST",
      body: { id: item.id, done: !item.done },
    });

    item.done = !item.done;
  } catch (error) {
    console.error("Ошибка:", error.status, error.statusMessage);
  }
};
</script>
<style scoped>
.frame {
  margin-top: 10px;
}

.inside-frame {
  padding-bottom: 10px;
}

.second-frame {
  margin: auto;
  width: 96%;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
}

.main-text-sm {
  color: #6a758b;
}

.second-frame {
  min-height: 78px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

.second-frame .texts {
  margin: auto;
  margin-left: 0;
}

.frame-header {
  margin: 0;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 24px;
}

.blue-dot {
  min-width: 8px;
  height: 8px;
  background-color: #2c71e4;
  border-radius: 50%;
  margin-left: 16px;
  margin-right: 16px;
}

.red-dot {
  min-width: 8px;
  height: 8px;
  background-color: #e6521f;
  border-radius: 50%;
  margin-left: 16px;
  margin-right: 16px;
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
  color: #ffffff;
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
