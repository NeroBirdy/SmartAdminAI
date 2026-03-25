<template>
  <div class="dev-menu" v-if="isDevMenuOpen">
    <h1 class="header-sm header-dev-menu">Режим разработчика</h1>
    <div class="dev-menu-list" v-if="activeSection">
      <layout-dev-menu-row
        v-for="(row, index) in activeSection.rows"
        :key="index"
        :icon="row.icon"
        :text="row.text"
        @click="row.onClick"
      />
    </div>
    <p v-else class="header-sm">Нет инструментов на этой странице</p>
  </div>
</template>

<script lang="ts" setup>
import Alert from "~/assets/icons/triangle_alert.svg";
import Refresh from "~/assets/icons/refresh_ccw.svg";

type MenuSection = {
  title: string;
  rows: { icon: string; text: string; onClick?: () => void }[];
};

const { getData } = useRisks();
const { isDevMenuOpen } = useDevMenu();

const items: MenuSection[] = [
  {
    title: "risks",
    rows: [
      {
        icon: Refresh,
        text: "Обновить запрос принудительно",
        onClick: async () => {
          await getData();
        },
      },
      {
        icon: Alert,
        text: "Отобразить ошибку",
        onClick: () => {
          showCustomToast(
            "danger",
            "Что‑то пошло не так",
            "Не удалось выполнить операцию. Попробуйте позже или обратитесь в поддержку.",
          );
        },
      },
    ],
  },
];

const route = useRoute();

const activeSection = computed(() => {
  return items.find((section) => section.title === route.name);
});
</script>
<style scoped>
.dev-menu {
  background-color: white;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.header-dev-menu {
  align-self: self-start;
  color: #2c71e4;
  margin-left: 20px;
  margin-bottom: 12px;
}
</style>
