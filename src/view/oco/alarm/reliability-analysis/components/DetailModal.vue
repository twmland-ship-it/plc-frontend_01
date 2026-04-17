<template>
  <a-modal
    :visible="modal"
    :title="title"
    @cancel="closeModal"
    :footer="null"
    width="800px"
    :z-index="9999"
    :mask-closable="false"
  >
    <div v-if="detailData">
      <!-- 可靠度圓餅圖 + 公式 -->
      <div class="reliability-top">
        <div class="reliability-chart">
          <DoughnutChart
            :id="chartId"
            :height="220"
            :labels="pieLabels"
            :datasets="pieDatasets"
            :options="pieOptions"
            className="reliability-doughnut"
          />
        </div>

        <div class="reliability-info">
          <h4>可靠度計算</h4>
          <a-alert :message="formulaResultText" type="success" show-icon />
          <div class="reliability-counts">
            <div><strong>故障次數</strong>：{{ safeErrorCount }}</div>
            <div><strong>運轉次數</strong>：{{ safeStatusCount }}</div>
            <div><strong>運轉時間</strong>：{{ oprTimeText }}</div>
          </div>
        </div>
      </div>

      <!-- 故障時間列表 -->
      <div style="margin-bottom: 1.5rem">
        <h4>故障時間 (共 {{ detailData.ErrorCount }} 次)</h4>
        <div v-if="(detailData.ErrorTimeTextList || []).length === 0" class="no-data">
          無故障記錄
        </div>
        <div v-else>
          <a-list
            :data-source="detailData.ErrorTimeTextList"
            size="small"
            bordered
            :pagination="errorListPagination"
          >
            <template #renderItem="{ item, index }">
              <a-list-item>
                <span style="color: #ff4d4f;">
                  {{ (errorListPage - 1) * errorListPageSize + index + 1 }}. {{ item }}
                </span>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>

      <!-- 運轉時間列表 -->
      <div>
        <h4>運轉時間 (共 {{ detailData.StatusCount }} 次)</h4>
        <div v-if="(detailData.StatusTimeTextList || []).length === 0" class="no-data">
          無運轉記錄
        </div>
        <div v-else>
          <a-list
            :data-source="detailData.StatusTimeTextList"
            size="small"
            bordered
            :pagination="statusListPagination"
          >
            <template #renderItem="{ item, index }">
              <a-list-item>
                <span style="color: #52c41a;">
                  {{ (statusListPage - 1) * statusListPageSize + index + 1 }}. {{ item }}
                </span>
              </a-list-item>
            </template>
          </a-list>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script>
import { defineComponent, computed, ref, watch } from "vue";
import DoughnutChart from "@/components/utilities/DoughnutChart.vue";

export default defineComponent({
  name: "DetailModal",
  components: { DoughnutChart },
  props: {
    modal: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    closeModal: {
      type: Function,
      required: true,
    },
    detailData: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const safeErrorCount = computed(() => Number(props.detailData?.ErrorCount ?? 0));
    const safeStatusCount = computed(() => Number(props.detailData?.StatusCount ?? 0));

    // 明細清單分頁（故障/運轉各一組）
    const errorListPage = ref(1);
    const errorListPageSize = ref(50);
    const statusListPage = ref(1);
    const statusListPageSize = ref(50);

    watch(
      () => props.detailData,
      () => {
        // 每次切換明細都回到第一頁，避免沿用上一筆的頁數造成「看不到資料」
        errorListPage.value = 1;
        statusListPage.value = 1;
      }
    );

    const reliabilityPercent = computed(() => {
      const e = safeErrorCount.value;
      const s = safeStatusCount.value;
      const denom = s + e;
      if (!Number.isFinite(denom) || denom <= 0) return 100;
      const p = (1 - e / denom) * 100;
      return Math.min(100, Math.max(0, p));
    });

    const reliabilityText = computed(() => `${reliabilityPercent.value.toFixed(2)} %`);

    const formulaResultText = computed(() => {
      // 優先用 main.js 傳進來的文字（若有），否則用這裡統一組裝，確保與圓餅圖一致
      if (props.detailData?.FormulaResultText) return props.detailData.FormulaResultText;
      const e = safeErrorCount.value;
      const s = safeStatusCount.value;
      return `可靠度 = ((1 - (${e} / (${s} + ${e}))) * 100) % = ${reliabilityText.value}`;
    });

    const oprTimeText = computed(() => {
      // main.js 已先算好 OprTimeText，這裡容錯：沒有就自己從 OprSeconds 算
      if (props.detailData?.OprTimeText) return props.detailData.OprTimeText;
      const sec = Number(props.detailData?.OprSeconds ?? 0);
      if (!Number.isFinite(sec) || sec <= 0) return "00:00:00";
      const total = Math.floor(sec);
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    });

    const pieLabels = computed(() => ["可靠度", "其餘"]);

    const pieDatasets = computed(() => {
      const ok = Number(reliabilityPercent.value.toFixed(2));
      const rest = Number((100 - ok).toFixed(2));
      return [
        {
          data: [ok, rest],
          backgroundColor: ["#409EFF", "#FF4D4F"], // 藍 / 紅
          borderColor: "#ffffff",
          borderWidth: 2,
          hoverOffset: 4,
          centerText: `${ok.toFixed(2)}%`,
          centerTextLabel: "可靠度",
        },
      ];
    });

    const pieOptions = computed(() => ({
      cutout: "70%",
      // 注意：本專案 chartjs.vue 的 tooltip 預設走 external 且 enabled=false，
      // 這裡不強制開啟 tooltip，避免破壞全域行為。
    }));

    const chartId = computed(() => {
      const raw = String(props.detailData?.UniqueKey ?? props.detailData?.Description ?? props.title ?? "reliability");
      const safe = raw.replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 64);
      return `reliability-detail-${safe}`;
    });

    const errorListPagination = computed(() => ({
      current: errorListPage.value,
      pageSize: errorListPageSize.value,
      total: (props.detailData?.ErrorTimeTextList || []).length,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["50", "100"],
      onChange: (page) => {
        errorListPage.value = page;
      },
      onShowSizeChange: (_current, size) => {
        errorListPageSize.value = size;
        errorListPage.value = 1;
      },
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 筆，共 ${total} 筆`,
    }));

    const statusListPagination = computed(() => ({
      current: statusListPage.value,
      pageSize: statusListPageSize.value,
      total: (props.detailData?.StatusTimeTextList || []).length,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ["50", "100"],
      onChange: (page) => {
        statusListPage.value = page;
      },
      onShowSizeChange: (_current, size) => {
        statusListPageSize.value = size;
        statusListPage.value = 1;
      },
      showTotal: (total, range) => `第 ${range[0]}-${range[1]} 筆，共 ${total} 筆`,
    }));

    return {
      chartId,
      pieLabels,
      pieDatasets,
      pieOptions,
      formulaResultText,
      safeErrorCount,
      safeStatusCount,
      oprTimeText,
      errorListPagination,
      statusListPagination,
      errorListPage,
      errorListPageSize,
      statusListPage,
      statusListPageSize,
    };
  },
});
</script>

<style scoped>
.no-data {
  text-align: center;
  color: #999;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
}

h4 {
  margin-bottom: 0.5rem;
  color: #333;
}

.reliability-top {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 1.5rem;
}

.reliability-chart {
  width: 260px;
  flex: 0 0 260px;
}

.reliability-info {
  flex: 1;
  min-width: 0;
}

.reliability-counts {
  margin-top: 10px;
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  color: #666;
  font-size: 12px;
}
</style>
