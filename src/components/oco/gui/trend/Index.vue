<template>
  <ChartContainer>
    <div class="ninjadash-chart-container">
      <Chart
        id="trendChart"
        type="line"
        className="lineChart"
        :height="500"
        :labels="labels"
        :datasets="datasets"
        :options="options"
      />
    </div>
  </ChartContainer>
</template>
<script src="./main.js"></script>
