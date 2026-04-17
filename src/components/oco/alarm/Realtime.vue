<template>
  <RealTime :class="{ 'realtime-expanded': expanded }">
    <sdModal
      v-if="CCTVModal"
      :visible="CCTVModal"
      :onCancel="closeCCTVModal"
      :width="500"
      class="cctv-modal"
      :wrapClassName="'cctv-modal-wrap'"
      :rootClassName="'cctv-modal-root'"
    >
      <!-- 與下方「暫停更新」共用同一個 pause 狀態，確保在攝影機視窗勾選也會同步 -->
      <cctvStream
        :cctv="currCCTV"
        :alarm="true"
        :dontShowOnAlarm="pause"
        @changeAlarmSetting="onPauseChanged"
      ></cctvStream>
    </sdModal>
    <a-collapse
      :activeKey="collapsed"
      type="card"
      accordion
      @change="changePanel"
    >
      <a-collapse-panel key="1" class="custom-tab" :show-arrow="false">
        <template #header>
          <div class="custom-header">
            <span>警報</span>
            <a-button
              v-permission="{ permission: 'update', module: 'alarm-realtime' }"
              size="small"
              class="header-action-btn"
              type="link"
              @click.stop="checkAlarm"
            >
              確認全部
            </a-button>
            <a-button size="small" class="header-action-btn" type="link" @click.stop="toggleExpand">
              {{ expanded ? '縮回' : '展開' }}
            </a-button>
          </div>
        </template>
        <a-checkbox :checked="pause" @change="onPauseChanged"
          >暫停更新</a-checkbox
        >
        <a-table
          :data-source="tableData"
          :columns="columns"
          :pagination="false"
          :scroll="tableScroll"
          :row-class-name="getRowClassName"
          row-key="Id"
        />
      </a-collapse-panel>
    </a-collapse>
  </RealTime>
</template>
<script src="./index.js"></script>

<style>
/***** CCTV Modal position overrides for alarm page *****/
.cctv-modal.ant-modal, .cctv-modal-wrap .ant-modal {
  top: 80px !important;
  left: 12px !important;
  margin: 0 !important;
}

/* 螢幕高度較小時，避免往下移後超出可視範圍 */
@media (max-height: 700px) {
  .cctv-modal.ant-modal, .cctv-modal-wrap .ant-modal {
    top: 24px !important;
  }
}

/* Expanded mode: increase inner table height only, do not overlay or cover sidebar */
.realtime-expanded { /* keep normal flow; just a marker class */ }
.custom-header { display: inline-flex; align-items: center; gap: 8px; color: #fff; }
.custom-header .header-action-btn { padding: 0 8px; border: 0; background: transparent; color: #fff; }
.custom-header .header-action-btn:hover, .custom-header .header-action-btn:focus { color: #fff; opacity: 0.85; }
.realtime-expanded .ant-table-body { min-height: 600px; }

</style>

