<template>
  <div class="frame">
    <h1 class="frame-header header-md">Графики занятости</h1>
    <div class="inside-frame">
      <custom-settings-organisation-schedule />
      <custom-settings-employee-settings />
      <custom-settings-venue-settings />
    </div>
  </div>

</template>

<style scoped>
.frame {
  margin-top: 10px;
}

.inside-frame {
  display: flex;
  flex-direction: column;
  padding-bottom: 24px;
  padding-left: 30px;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
}

.main-text-sm {
  color: #6a758b;
}

.frame-header {
  margin: 0;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 6px;
}

.setting {
  display: flex;
  flex-direction: column;
}

.second-text {
  margin-top: 18px;
  color: #8590a5;
}

input {
  width: 380px;
  height: 48px;
  border: 0;
  padding: 0;
  padding-left: 20px;
  border-radius: 10px;
  background-color: #f8f8f8;
  outline: none;
  color: #2b3850;
}
</style>
