<template>
  <div class="side-bar">
    <div class="side-bar-categories">
      <layout-side-bar-category category="risks" />
      <layout-side-bar-category category="schedule" />
      <layout-side-bar-category category="clients" />
      <layout-side-bar-category category="staff" />
      <layout-side-bar-category category="settings" />
    </div>
    <layout-dev-menu />
  </div>
</template>

<style scoped>
.side-bar {
  display: flex;
  flex-direction: column;
  width: 264px;
  margin-right: 16px;
  margin-left: 5px;
  top: 10px;
  z-index: 1;
  position: sticky;
  height: 100%;
}

.side-bar-categories {
  margin-bottom: 95px;
}
</style>
