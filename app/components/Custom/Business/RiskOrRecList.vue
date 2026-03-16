<template>
  <div class="frame">
    <h1 class="frame-header header-md">
      {{ title }}
    </h1>
    <div class="inside-frame">
      <div
        class="frame second-frame"
        v-for="item in items"
        :key="item.id"
      >
    <CustomBusinessRiskOrRecRow 
    :item="item"
    :type="type"
    />
    </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
type RisksOrRec = {
  id: number;
  title: string;
  text: string;
  done?: boolean;
};

defineProps<{
  type: string;
  title: string;
  items: RisksOrRec[];
}>();
</script>

<style scoped>
.frame {
  margin-top: 10px;
}

.inside-frame {
  padding-bottom: 10px;
}

.frame-header {
  margin: 0;
  padding-left: 30px;
  padding-top: 20px;
  padding-bottom: 24px;
}

.second-frame {
  margin: auto;
  width: 96%;
  min-height: 78px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}
</style>
