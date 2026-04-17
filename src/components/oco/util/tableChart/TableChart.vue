<template>
  <ChartContainer>
    <a-card v-if="type === 'line'">
      <div
        class="ninjadash-chart-container"
        style="display: block; height: 300px; width: 100%"
      >
        <Chart
          type="line"
          :id="id"
          :height="300"
          :labels="labels"
          className="line"
          :datasets="datasets"
          :options="options"
        />
      </div>
    </a-card>
    <a-card v-if="type === 'bar'">
      <div
        class="ninjadash-chart-container"
        style="display: block; height: 300px; width: 100%"
      >
        <Chart
          type="bar"
          :height="300"
          :id="id"
          :labels="labels"
          className="bar"
          :datasets="datasets"
          :options="options"
          style="margin: 50px 0"
        />
      </div>
    </a-card>
    <a-card v-if="type === 'pie'">
      <div
        class="ninjadash-chart-container"
        style="display: block; height: 300px; width: 100%"
      >
        <Chart
          type="pie"
          :height="300"
          :id="id"
          :labels="labels"
          className="pie"
          :datasets="datasets"
          :options="options"
        />
      </div>
    </a-card>
  </ChartContainer>
</template>
<script setup>
import { defineProps } from "vue";
import Chart from "@/components/utilities/chartjs";
import { ChartContainer } from "./style";
defineProps({
  type: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    default: "chart",
  },
  labels: {
    type: Array,
    required: true,
  },
  datasets: {
    type: Array,
    required: true,
  },
  options: {
    type: Object,
    required: true,
  },
});
</script>
