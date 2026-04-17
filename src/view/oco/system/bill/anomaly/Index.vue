<template>
  <div>
    <h3 style="margin-bottom: 12px">服務異常總覽</h3>
    <a-row :gutter="[12, 12]" style="margin-bottom: 12px">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card size="small" title="總服務數">
          <h3 style="margin: 0">{{ stats.total }}</h3>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card size="small" title="中斷">
          <h3 style="margin: 0; color: #cf1322">{{ stats.disconnected }}</h3>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card size="small" title="延遲">
          <h3 style="margin: 0; color: #d48806">{{ stats.stale }}</h3>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card size="small" title="正常">
          <h3 style="margin: 0; color: #389e0d">{{ stats.fresh }}</h3>
        </a-card>
      </a-col>
    </a-row>

    <a-row justify="space-between" style="margin-bottom: 12px">
      <a-col>
        <a-space>
          <a-button type="primary" :loading="loading" @click="reloadStatus">
            立即刷新
          </a-button>
          <a-tag color="blue">每 60 秒自動刷新</a-tag>
        </a-space>
      </a-col>
    </a-row>

    <a-alert
      v-if="errorText"
      :message="errorText"
      type="error"
      show-icon
      closable
      style="margin-bottom: 12px"
      @close="errorText = ''"
    />

    <a-table
      :columns="columns"
      :data-source="dataSource"
      :loading="loading"
      :pagination="false"
      row-key="serviceCode"
      size="middle"
      style="margin-bottom: 20px"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'level'">
          <a-tag :color="getStatusColor(record.level)">
            {{ getStatusText(record.level) }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'ageSeconds'">
          {{ Number(record.ageSeconds || 0).toFixed(2) }}
        </template>
      </template>
    </a-table>

    <a-divider style="margin: 16px 0" />
    <h3 style="margin-bottom: 12px">告警通知降噪參數（管理員）</h3>
    <a-row :gutter="[12, 12]" style="margin-bottom: 12px">
      <a-col :xs="24" :sm="12" :md="6">
        <div style="margin-bottom: 4px">中斷通知冷卻(分)</div>
        <a-input-number
          v-model:value="notifyDisconnectedCooldownMinutes"
          :min="1"
          :max="10080"
          style="width: 100%"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div style="margin-bottom: 4px">延遲通知冷卻(分)</div>
        <a-input-number
          v-model:value="notifyStaleCooldownMinutes"
          :min="1"
          :max="10080"
          style="width: 100%"
        />
      </a-col>
      <a-col :xs="24" :sm="24" :md="12">
        <a-space style="width: 100%; justify-content: flex-end">
          <a-button :loading="notifySettingLoading" @click="loadNotifySettings">
            重新讀取
          </a-button>
          <a-button
            type="primary"
            :loading="notifySettingLoading"
            @click="saveNotifySettings"
          >
            儲存並即時生效
          </a-button>
        </a-space>
      </a-col>
    </a-row>

    <a-divider style="margin: 16px 0" />
    <h3 style="margin-bottom: 12px">電表長時間無變動異常</h3>
    <a-row :gutter="[12, 12]" style="margin-bottom: 12px">
      <a-col :xs="24" :sm="12" :md="6">
        <div style="margin-bottom: 4px">延遲門檻(分)</div>
        <a-input-number
          v-model:value="staleAfterMinutes"
          :min="1"
          :max="1440"
          style="width: 100%"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div style="margin-bottom: 4px">中斷門檻(分)</div>
        <a-input-number
          v-model:value="disconnectedAfterMinutes"
          :min="1"
          :max="10080"
          style="width: 100%"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <div style="margin-bottom: 4px">歷史視窗(時)</div>
        <a-input-number
          v-model:value="historyWindowHours"
          :min="1"
          :max="168"
          style="width: 100%"
        />
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-space style="width: 100%; justify-content: flex-end">
          <a-button type="primary" @click="reloadStatus">套用門檻</a-button>
          <a-button @click="exportMeterAnomalyCsv">匯出 CSV</a-button>
        </a-space>
      </a-col>
    </a-row>

    <a-row :gutter="[12, 12]" style="margin-bottom: 12px">
      <a-col :xs="24" :sm="12" :md="8">
        <a-select v-model:value="statusFilter" style="width: 100%">
          <a-select-option value="all">全部狀態</a-select-option>
          <a-select-option value="disconnected">中斷</a-select-option>
          <a-select-option value="stale">延遲</a-select-option>
          <a-select-option value="fresh">正常</a-select-option>
        </a-select>
      </a-col>
      <a-col :xs="24" :sm="12" :md="16">
        <a-input
          v-model:value="keyword"
          placeholder="輸入電表名稱 / 區域ID / 最後值篩選"
          allow-clear
        />
      </a-col>
    </a-row>

    <a-row :gutter="[12, 12]" style="margin-bottom: 12px">
      <a-col :xs="24" :sm="12" :md="6">
        <a-card size="small" title="總電表數">
          <h3 style="margin: 0">{{ meterStats.total }}</h3>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card size="small" title="中斷">
          <h3 style="margin: 0; color: #cf1322">{{ meterStats.disconnected }}</h3>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card size="small" title="延遲">
          <h3 style="margin: 0; color: #d48806">{{ meterStats.stale }}</h3>
        </a-card>
      </a-col>
      <a-col :xs="24" :sm="12" :md="6">
        <a-card size="small" title="正常">
          <h3 style="margin: 0; color: #389e0d">{{ meterStats.fresh }}</h3>
        </a-card>
      </a-col>
    </a-row>

    <a-table
      :columns="meterColumns"
      :data-source="meterDataSource"
      :loading="loading"
      :pagination="{ pageSize: 10, showSizeChanger: false }"
      row-key="meterId"
      size="middle"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'freshnessState'">
          <a-tag :color="getStatusColor(record.freshnessState)">
            {{ getStatusText(record.freshnessState) }}
          </a-tag>
        </template>
        <template v-else-if="column.key === 'dataAgeMinutes'">
          {{ Number(record.dataAgeMinutes || 0).toFixed(2) }}
        </template>
        <template v-else-if="column.key === 'unchangedMinutes'">
          {{ Number(record.unchangedMinutes || 0).toFixed(2) }}
          <a-tag v-if="record.isLowerBoundByWindow" color="processing">視窗下限</a-tag>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";
import { DataService } from "@/config/dataService/dataService";

const store = useStore();
const timerRef = ref(null);
const errorText = ref("");
const staleAfterMinutes = ref(60);
const disconnectedAfterMinutes = ref(120);
const historyWindowHours = ref(24);
const notifyDisconnectedCooldownMinutes = ref(3);
const notifyStaleCooldownMinutes = ref(10);
const notifySettingLoading = ref(false);
const statusFilter = ref("all");
const keyword = ref("");

const columns = [
  {
    title: "服務",
    dataIndex: "serviceName",
    key: "serviceName",
    width: 160,
  },
  {
    title: "狀態",
    dataIndex: "level",
    key: "level",
    width: 140,
  },
  {
    title: "最後資料時間",
    dataIndex: "lastReceivedTime",
    key: "lastReceivedTime",
    width: 220,
  },
  {
    title: "資料延遲秒數",
    dataIndex: "ageSeconds",
    key: "ageSeconds",
    width: 140,
  },
  {
    title: "判定門檻(秒)",
    dataIndex: "thresholdSeconds",
    key: "thresholdSeconds",
    width: 120,
  },
  {
    title: "說明",
    dataIndex: "message",
    key: "message",
  },
];

const meterColumns = [
  {
    title: "電表名稱",
    dataIndex: "meterName",
    key: "meterName",
    width: 180,
  },
  {
    title: "區域",
    dataIndex: "regionId",
    key: "regionId",
    width: 120,
  },
  {
    title: "狀態",
    dataIndex: "freshnessState",
    key: "freshnessState",
    width: 120,
  },
  {
    title: "最後值",
    dataIndex: "lastValue",
    key: "lastValue",
    width: 160,
  },
  {
    title: "最後值時間",
    dataIndex: "lastValueTimeText",
    key: "lastValueTimeText",
    width: 220,
  },
  {
    title: "資料延遲(分)",
    dataIndex: "dataAgeMinutes",
    key: "dataAgeMinutes",
    width: 130,
  },
  {
    title: "連續無變動(分)",
    dataIndex: "unchangedMinutes",
    key: "unchangedMinutes",
    width: 150,
  },
  {
    title: "說明",
    dataIndex: "message",
    key: "message",
  },
];

const loading = computed(() => store.state.bill.loading);
const dataSource = computed(() => store.state.bill.anomalyList || []);
const meterDataSource = computed(() => {
  const all = store.state.bill.meterAnomalyList || [];
  return all.filter((item) => {
    const statusMatched =
      statusFilter.value === "all" ||
      (statusFilter.value === "disconnected" && item.isDisconnected) ||
      (statusFilter.value === "stale" && item.isStale) ||
      (statusFilter.value === "fresh" && item.isFresh);

    const text = keyword.value.trim().toLowerCase();
    const keywordMatched =
      text.length === 0 ||
      (item.meterName || "").toLowerCase().includes(text) ||
      (item.regionId || "").toString().toLowerCase().includes(text) ||
      (item.lastValue || "").toString().toLowerCase().includes(text);

    return statusMatched && keywordMatched;
  });
});
const stats = computed(
  () =>
    store.state.bill.anomalyStats || {
      total: 0,
      disconnected: 0,
      stale: 0,
      fresh: 0,
    }
);
const meterStats = computed(
  () =>
    store.state.bill.meterAnomalyStats || {
      total: 0,
      disconnected: 0,
      stale: 0,
      fresh: 0,
    }
);

const getStatusColor = (level) => {
  if (level === "Disconnected" || level === "disconnected") return "red";
  if (level === "Stale" || level === "stale") return "orange";
  return "green";
};

const getStatusText = (level) => {
  if (level === "Disconnected" || level === "disconnected") return "中斷";
  if (level === "Stale" || level === "stale") return "延遲";
  return "正常";
};

const reloadStatus = async () => {
  try {
    errorText.value = "";
    await Promise.all([
      store.dispatch("bill/fetchAnomalyStatus"),
      store.dispatch("bill/fetchMeterAnomalyStatus", {
        staleAfterMinutes: Number(staleAfterMinutes.value) || 60,
        disconnectedAfterMinutes: Number(disconnectedAfterMinutes.value) || 120,
        historyWindowHours: Number(historyWindowHours.value) || 24,
      }),
    ]);
  } catch (error) {
    errorText.value = error?.message || "取得資料異常狀態失敗";
  }
};

const loadNotifySettings = async () => {
  try {
    notifySettingLoading.value = true;
    const res = await DataService.get("/api/System/GetMeterAnomalyNotifySettings");
    const detail = res?.data?.Detail || {};
    notifyDisconnectedCooldownMinutes.value =
      Number(detail.MeterAnomalyDisconnectedCooldownMinutes) || 3;
    notifyStaleCooldownMinutes.value =
      Number(detail.MeterAnomalyStaleCooldownMinutes) || 10;
  } catch (error) {
    message.error(error?.message || "讀取通知降噪參數失敗");
  } finally {
    notifySettingLoading.value = false;
  }
};

const saveNotifySettings = async () => {
  const disconnected = Number(notifyDisconnectedCooldownMinutes.value);
  const stale = Number(notifyStaleCooldownMinutes.value);
  if (!Number.isFinite(disconnected) || disconnected <= 0) {
    message.warning("中斷通知冷卻分鐘數需大於 0");
    return;
  }
  if (!Number.isFinite(stale) || stale <= 0) {
    message.warning("延遲通知冷卻分鐘數需大於 0");
    return;
  }

  try {
    notifySettingLoading.value = true;
    const res = await DataService.post("/api/System/UpdateMeterAnomalyNotifySettings", {
      MeterAnomalyDisconnectedCooldownMinutes: disconnected,
      MeterAnomalyStaleCooldownMinutes: stale,
    });
    const detail = res?.data?.Detail || {};
    notifyDisconnectedCooldownMinutes.value =
      Number(detail.MeterAnomalyDisconnectedCooldownMinutes) || disconnected;
    notifyStaleCooldownMinutes.value =
      Number(detail.MeterAnomalyStaleCooldownMinutes) || stale;
    message.success("通知降噪參數已更新並即時生效");
  } catch (error) {
    message.error(error?.message || "更新通知降噪參數失敗");
  } finally {
    notifySettingLoading.value = false;
  }
};

const exportMeterAnomalyCsv = () => {
  const headers = [
    "MeterId",
    "MeterName",
    "RegionId",
    "FreshnessState",
    "LastValue",
    "LastValueTime",
    "DataAgeMinutes",
    "UnchangedMinutes",
    "Message",
  ];

  const rows = meterDataSource.value.map((item) => [
    item.meterId || "",
    item.meterName || "",
    item.regionId || "",
    item.freshnessState || "",
    item.lastValue || "",
    item.lastValueTimeText || "",
    Number(item.dataAgeMinutes || 0).toFixed(2),
    Number(item.unchangedMinutes || 0).toFixed(2),
    item.message || "",
  ]);

  const csvText = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvText], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  link.setAttribute("download", `meter-anomaly-${ts}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

onMounted(async () => {
  await loadNotifySettings();
  await reloadStatus();
  timerRef.value = setInterval(async () => {
    await reloadStatus();
  }, 60 * 1000);
});

onBeforeUnmount(() => {
  if (timerRef.value) {
    clearInterval(timerRef.value);
    timerRef.value = null;
  }
});
</script>
