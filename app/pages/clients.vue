<template>
  <div class="title">
    <div class="title-left">
      <ui-page-toggle
        v-if="currentCategory"
        :enabled="currentCategory?.enable"
        class="title-toggle"
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
