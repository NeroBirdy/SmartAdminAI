<template>
    <div class="frame">
        <h1 class="frame-header header-md">
            Рекомендации (Growth opportunities)
        </h1>
        <div class="inside-frame">
            <div class="frame second-frame" v-for="(item) in recommendations" :key="index">
                <div class="blue-dot"></div>
                <div class="texts">
                    <div class="second-frame-title header-sm">{{ item.title }}</div>
                    <div class="second-frame-text main-text-sm"> {{ item.text }}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="frame">
        <h1 class="frame-header header-md">
            Риски (Risks)
        </h1>
        <div class="inside-frame">
            <div class="frame second-frame" v-for="(item, index) in risks" :key="index">
                <div class="red-dot"></div>
                <div class="texts">
                    <div class="second-frame-title header-sm">{{ item.title }}</div>
                    <div class="second-frame-text main-text-sm"> {{ item.text }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
const { data, pending, error } = await useFetch('/api/risks');
console.log(data.value.test);

const recommendations = computed(() => data.value?.recommendations || [])
const risks = computed(() => data.value?.risks || [])
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
    color: #6A758B;
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
    width: 8px;
    height: 8px;
    background-color: #2C71E4;
    border-radius: 50%;
    margin-left: 16px;
    margin-right: 16px;
}

.red-dot {
    width: 8px;
    height: 8px;
    background-color: #E6521F;
    border-radius: 50%;
    margin-left: 16px;
    margin-right: 16px;
}
</style>