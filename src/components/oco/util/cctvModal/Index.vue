<template>
  <a-row style="width: 100%" :gutter="[10, 10]">
    <a-col v-for="v in cctv" :key="v" :xs="cctv.length > 1 ? 12 : 24">
      <Go2rtcVideoPlayer
        v-if="streams[v]"
        :streamUri="streams[v].streamUri"
        :streamName="streams[v].streamName"
        @error="onPlayerError(v, $event)"
      />
      <div v-else style="width:100%;aspect-ratio:16/9;background:#000;display:flex;align-items:center;justify-content:center;color:#888;">
        載入中...
      </div>
    </a-col>
  </a-row>
  <a-checkbox
    v-if="alarm"
    :checked="dontShowOnAlarm"
    @change="onDontShowChanged"
    >暫停更新警報</a-checkbox
  >
</template>
<script src="./main.js"></script>
