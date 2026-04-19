<template>
  <div class="main">
    <LayoutHeader>Расписание</LayoutHeader>
    <div class="content">
      <div class="center">
        <slot />
      </div>
    </div>
  </div>
</template>
<style scoped>
.center {
  width: 100%;
}
</style>
