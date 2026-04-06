<template>
  <div class="toast">
    <div class="inside-toast">
      <div class="icons">
        <component :is="getIcon()" alt="Иконка уведомеления" />
        <component
          :is="removeIcon"
          @click.stop="handleClose"
          alt="Иконка закрытия"
        />
      </div>
      <h1 class="header-md">{{ title }}</h1>
      <p class="main-text-sm">{{ description }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import sucessIcon from "~/assets/icons/sucess_toast.svg";
import removeIcon from "~/assets/icons/remove.svg";
import warningIcon from "~/assets/icons/warning_toast.svg";
import dangerIcon from "~/assets/icons/danger_toast.svg";

const props = defineProps<{
  toast: any;
  type: "success" | "warning" | "danger";
  title: string;
  description: string;
}>();

const handleClose = () => {
  props.toast.onCloseToast();
};

const getIcon = () => {
  if (props.type == "success") {
    return sucessIcon;
  } else if (props.type == "warning") {
    return warningIcon;
  }
  return dangerIcon;
};
</script>

<style scoped>
.toast {
  display: flex;
  width: 350px;
  min-height: 124px;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 6px 32px 2px rgba(0, 0, 0, 0.08);
}

.inside-toast {
  width: 100%;
  margin-top: 16px;
  margin-bottom: 16px;
  margin-left: 24px;
  margin-right: 20px;
}

.inside-toast h1 {
  margin-top: 16px;
  margin-bottom: 8px;
}

.inside-toast p {
  margin: 0;
}

.icons {
  display: flex;
  justify-content: space-between;
}

.main-text-sm {
  color: #6a758b;
}

.header-md {
  color: #2b3850;
}
</style>
