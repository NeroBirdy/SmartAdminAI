<template>
  <div class="frame second-frame-setting">
    <div class="second-frame-title">
      <div class="title-texts">
        <div class="header-icon">
          <h1 class="header-sm">График работы организации</h1>
          <CustomSettingsIcon
            :scheduleExist="scheduleExist"
            @click="orgScheduleOpen = true"
          />
        </div>
        <p class="description main-text-sm">
          Основа для генерации вашего расписания
        </p>
      </div>
    </div>
    <CustomSettingsModalWithOverlay
      :isModalOpen="orgScheduleOpen"
      type="organisation"
      :openId="1"
      @close="
        (id: number, type: 'save' | 'delete' | 'null', success: boolean) =>
          closeHandler(type, success)
      "
    />
  </div>
</template>

<script lang="ts" setup>
import { getOrganisationSchedule } from "~/api/settings/getOrganisationSchedule";

const response = await getOrganisationSchedule(1);

const scheduleExist = ref(response.scheduleExist);

const orgScheduleOpen = ref(false);

const closeHandler = (type: "save" | "delete" | "null", success: boolean) => {
  if (success) {
    if (type === "save") {
      scheduleExist.value = true;
    }
    if (type === "delete") {
      scheduleExist.value = false;
    }
  }
  orgScheduleOpen.value = false;
};
</script>

<style scoped>
.second-frame-setting {
  margin-top: 20px !important;
  min-height: 78px;
  margin-right: 30px;
}

.second-frame-title {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 32px;
}

.header-icon {
  display: flex;
  flex-direction: row;
}

.icon {
  padding-left: 8px;
  cursor: pointer;
}

.title-texts {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}

.title-texts p {
  margin: 0;
}

.title-texts h1 {
  margin: 0;
}

.header-sm {
  color: #324260;
  padding-bottom: 3px;
}

.main-text-sm {
  color: #6a758b;
}

.setting-description {
  display: flex;
  flex-direction: row;
  padding-left: 5px;
  align-items: center;
  margin-bottom: 10px;
}

.setting-description p {
  margin: 0;
}
</style>
