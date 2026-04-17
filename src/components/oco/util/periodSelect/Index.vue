<template>
  <a-space style="margin-top: 0.5rem">
    <a-button v-if="!noToday" type="primary" ghost @click="setDate(1)"
      >今日</a-button
    >
    <a-button type="primary" ghost @click="setDate(2)">昨日</a-button>
    <a-button type="primary" ghost @click="setDate(3)">本週</a-button>
    <a-button type="primary" ghost @click="setDate(4)">上週</a-button>
    <a-button type="primary" ghost @click="setDate(5)">本月</a-button>
    <a-button type="primary" ghost @click="setDate(6)">上月</a-button>
    <a-button type="primary" ghost @click="setDate(7)">今年</a-button>
    <a-button type="primary" ghost @click="setDate(8)">去年</a-button>
  </a-space>
</template>
<script setup>
import { usePeriodTime } from "@/composable/period";
import { defineEmits, defineProps } from "vue";
defineProps({
  noToday: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["setDate"]);
const setDate = (code) => {
  const { startTime, endTime } = usePeriodTime(code);
  emit("setDate", { startTime, endTime });
};
</script>
