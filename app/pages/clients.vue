<template>
  <div class="title">
    <div class="title-left">
      <component
        v-if="currentCategory"
        class="title-toggle"
        :is="currentCategory.enable ? toggleRight : toggleLeft"
        @click.stop="
          updateCategory(currentCategory.id, !currentCategory.enable)
        "
      />
      <h1 class="header-lg title-text">Сопровождение клиентов</h1>
    </div>
  </div>
  <PageClients />
</template>
<script lang="ts" setup>
import toggleLeft from "~/assets/icons/toggle_off.svg";
import toggleRight from "~/assets/icons/toggle_on.svg";

const CATEGORY_ID = 2;

const { categories, updateCategory } = useSideBarCategories();

type Category = {
  id: number;
  enable: boolean;
};

const currentCategory = computed<Category | undefined>(() =>
  categories.value?.find((c: Category) => c.id === CATEGORY_ID),
);
</script>
