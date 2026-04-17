import Chart from "@/components//utilities/chartjs";
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  reactive,
  onBeforeUnmount,
  watch,
  nextTick,
} from "vue";
import { Main } from "../styled";
import { useStore } from "vuex";
import { customTooltips } from "@/components/utilities/utilities";
import { useNumformatter } from "@/composable/formatter";
import DoughnutChart from "@/components/utilities/DoughnutChart.vue";
import ChartForm from "@/components/oco/form/chart-setting/Index.vue";
import OverviewCard from "@/components/cards/OverviewCard.vue";
import { SalesOverviewStyleWrap2, ChartContainer, SubContent } from "./style";
import Vue3Autocounter from "vue3-autocounter";
import { Modal, notification } from "ant-design-vue";
import ModalTable from "@/components/oco/util/ModalTable.vue";
import OptimizedApexChart from "@/components/utilities/optimized-apexchart.vue";
import { usePermission } from "@/composable/permission";
import { useColorGenerator } from "@/composable/colors";
import { statisticMethod, paramStatisticMethod } from "@/composable/options.js";
import { usePeriodTime } from "@/composable/period";

import { getItem } from "@/utility/localStorageControl";
import {
  getTenantScopedItem,
  migrateLegacyStorageKeyToTenantScope,
  setTenantScopedItem,
} from "@/utility/tenantContext";
import draggable from "vuedraggable";
import { debounce } from "lodash-es";
import dayjs from "dayjs";
import { GridStack } from "gridstack";
import "gridstack/dist/gridstack.min.css";
export default defineComponent({
  components: {
    Main,
    Chart,
    ChartContainer,
    DoughnutChart,
    SalesOverviewStyleWrap2,
    Vue3Autocounter,
    OverviewCard,
    SubContent,
    ChartForm,
    ModalTable,
    draggable,
    OptimizedApexChart,
  },
  setup() {
    const { state, dispatch } = useStore();
    const loading = computed(() => state.dashboard.loading);
    const isInit = ref(false);
    const { permission } = usePermission();
    const editMode = ref(false); // 編輯模式開關

    // 資料快取和比較邏輯
    const dataCache = ref(new Map());
    const lastUpdateTime = ref(0);
    const CACHE_DURATION = 5000; // 5秒快取
    const UPDATE_DEBOUNCE_TIME = 1500; // 降低更新頻率，避免過度重繪
    const DASHBOARD_REFRESH_INTERVAL_MS = 15000;
    const REALTIME_REFRESH_INTERVAL_MS = 8000;
    const MAX_RETRY_BACKOFF_MS = 60000;
    const BASE_RETRY_BACKOFF_MS = 3000;
    const INVALID_WARN_COOLDOWN_MS = 60000;

    // 即時資料緩衝（append/shift）
    const realTimeBuffers = ref(new Map());
    const MAX_RT_POINTS = 120;

    const getRTBuffer = (chartId, seriesNames = []) => {
      if (!realTimeBuffers.value.has(chartId)) {
        const map = new Map(seriesNames.map(n => [n, []]));
        realTimeBuffers.value.set(chartId, { labels: [], series: map });
      }
      const buf = realTimeBuffers.value.get(chartId);
      // 確保所有序列都存在
      seriesNames.forEach(n => { if (!buf.series.has(n)) buf.series.set(n, []); });
      return buf;
    };

    // GridStack 相關：持久化 x/y/w/h
    const GRID_POS_KEY = "dashboard_grid_positions";
    const gridEl = ref(null);
    const grid = ref(null);
    const gridPositions = ref({});

    const loadGridPos = () => {
      migrateLegacyStorageKeyToTenantScope(GRID_POS_KEY);
      return getTenantScopedItem(GRID_POS_KEY) || {};
    };
    const saveGridPos = (pos) => setTenantScopedItem(GRID_POS_KEY, pos);

    const getGridPos = (id) => {
      const pos = gridPositions.value[id];
      return pos || { x: 0, y: 0, w: 6, h: 6 };
    };

    // 從後端資料建立 layout 映射
    const buildBackendLayoutMap = (charts) => {
      const map = {};
      if (Array.isArray(charts)) {
        charts.forEach((c) => {
          if (c && c.layout && typeof c.layout === 'object') {
            const { x, y, w, h } = c.layout;
            if ([x, y, w, h].every((n) => typeof n === 'number')) {
              map[c.id] = { x, y, w, h };
            }
          }
        });
      }
      return map;
    };

    const initGrid = () => {
      if (!gridEl.value || grid.value) return;
      grid.value = GridStack.init({
        column: 24,
        float: true, // 允許留空
        cellHeight: 30,
        minRow: 1,
        disableOneColumnMode: true,
        margin: 6,
        resizable: { handles: 'all' },
        draggable: { handle: '.drag-btn' }
      }, gridEl.value);

      // 還原既有項目的座標
      gridPositions.value = loadGridPos();

      // 綁定事件保存座標
      const persist = debounce(() => {
        // 將 gridPositions 傳回後端 ContentJson
        dispatch('dashboard/saveLayout', gridPositions.value);
      }, 1000);

      grid.value.on('change', (e, items) => {
        if (!items) return;
        const current = { ...gridPositions.value };
        items.forEach(it => {
          const id = it.el?.getAttribute('data-id');
          if (!id) return;
          current[id] = { x: it.x, y: it.y, w: it.w, h: it.h };
        });
        gridPositions.value = current;
        saveGridPos(current);
        persist();
      });
    };

    // 檢查快取是否有效
    const isCacheValid = (key) => {
      const cached = dataCache.value.get(key);
      return cached && (Date.now() - cached.timestamp < CACHE_DURATION) && cached.data && cached.data.data && Array.isArray(cached.data.data) && cached.data.data.length > 0;
    };

    // 設定快取資料
    const setCacheData = (key, data) => {
      dataCache.value.set(key, {
        data: data,
        timestamp: Date.now()
      });
    };

    // 防抖的資料更新函數
    const consecutiveFailCount = ref(0);
    const nextRetryAtMs = ref(0);
    const lastInvalidWarnAtMs = ref(0);

    const isDashboardDebugEnabled = () => {
      const flag = getItem("debug_dashboard_log");
      return flag === true || flag === "true" || flag === 1 || flag === "1";
    };

    const canRunUpdate = () => {
      if (document.hidden) return false;
      if (isFetching.value) return false;
      if (Date.now() < nextRetryAtMs.value) return false;
      return true;
    };

    const markUpdateSuccess = () => {
      consecutiveFailCount.value = 0;
      nextRetryAtMs.value = 0;
      lastUpdateTime.value = Date.now();
    };

    const markUpdateFailure = () => {
      consecutiveFailCount.value += 1;
      const exp = Math.min(consecutiveFailCount.value - 1, 5);
      const delay = Math.min(BASE_RETRY_BACKOFF_MS * Math.pow(2, exp), MAX_RETRY_BACKOFF_MS);
      nextRetryAtMs.value = Date.now() + delay;
    };

    const debouncedUpdate = debounce(async () => {
      if (!canRunUpdate()) return;
      try {
        isFetching.value = true;
        const cacheKey = 'dashboard_data';

        // 檢查快取
        if (isCacheValid(cacheKey)) {
          if (isDashboardDebugEnabled()) {
            console.debug('使用快取資料，避免重複請求');
          }
          return;
        }
        const res = await dispatch("dashboard/getDashboard");
        
        // 檢查回應數據是否有效
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          if (isDashboardDebugEnabled()) {
            console.debug('儀表板資料更新成功，圖表數量:', res.data.length);
          }
          setCacheData(cacheKey, res);
          markUpdateSuccess();
        } else {
          if (Date.now() - lastInvalidWarnAtMs.value > INVALID_WARN_COOLDOWN_MS && isDashboardDebugEnabled()) {
            console.warn('儀表板資料無效或為空，跳過更新');
            lastInvalidWarnAtMs.value = Date.now();
          }
          markUpdateFailure();
        }
      } catch (err) {
        markUpdateFailure();
        if (isDashboardDebugEnabled()) {
          console.warn('資料更新失敗:', err);
        }
      } finally {
        isFetching.value = false;
      }
    }, UPDATE_DEBOUNCE_TIME);

    onMounted(async () => {
      try {
        const res = await dispatch("dashboard/getDashboard");
        unitOptions.value = res.unit;
        isInit.value = true;

        // 設定初始快取
        setCacheData('dashboard_data', res);
        lastUpdateTime.value = Date.now();

        nextTick(() => initGrid());

        // 使用防抖更新，減少不必要的請求
        resfreshInterval.value = setInterval(() => {
          if (document.hidden) return;
          debouncedUpdate();
        }, DASHBOARD_REFRESH_INTERVAL_MS);

        // 若存在即時卡，啟動 3 秒刷新（直接呼叫，繞過快取）
        if (hasRealtime.value && !rtRefreshInterval.value) {
          rtRefreshInterval.value = setInterval(() => {
            if (document.hidden) return;
            refreshNow();
          }, REALTIME_REFRESH_INTERVAL_MS);
        }
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
        isInit.value = true;
      }
    });

    onBeforeUnmount(() => {
      clearInterval(resfreshInterval.value);
      clearInterval(rtRefreshInterval.value);
      if (grid.value) {
        try {
          grid.value.destroy(false);
        } catch (_err) {
          // ignore GridStack destroy error on unmount
        }
        grid.value = null;
      }
    });

    const resfreshInterval = ref();
    const rtRefreshInterval = ref();
    const isFetching = ref(false);

    const hasRealtime = computed(() =>
      Array.isArray(state.dashboard.data) && state.dashboard.data.some(el => el.timePeriod === 999 && el.chartType === 'line')
    );

    const refreshNow = async () => {
      if (!canRunUpdate()) return;
      try {
        isFetching.value = true;
        await dispatch("dashboard/getDashboard");
        markUpdateSuccess();
      } catch (e) {
        markUpdateFailure();
        if (isDashboardDebugEnabled()) {
          console.warn('Realtime refresh failed:', e);
        }
      } finally {
        isFetching.value = false;
      }
    };

    const chartTypeOptions = ref([
      {
        id: "line",
        name: "折線圖",
      },
      {
        id: "doughnut",
        name: "圓餅圖",
      },
      {
        id: "bar",
        name: "長條圖",
      },
      {
        id: "radialBar",
        name: "儀表盤",
      },
      {
        id: "card",
        name: "卡片",
      },
    ]);
    const paramSummaryOptions = ref(paramStatisticMethod);
    const timePeriodOptions = ref([
      {
        id: 999,
        name: "即時",
      },
      {
        id: 1,
        name: "本日",
      },
      {
        id: 2,
        name: "昨日",
      },
      {
        id: 3,
        name: "本週",
      },
      {
        id: 4,
        name: "上週",
      },
      {
        id: 5,
        name: "本月",
      },
      {
        id: 6,
        name: "上月",
      },
      {
        id: 7,
        name: "今年",
      },
      {
        id: 8,
        name: "去年",
      },
    ]);
    const summaryTypeOptions = ref(statisticMethod);
    const unitOptions = ref([]);

    const fetchLineChart = ({
      data,
      unitText,
      timePeriod,
      params: paramsSetting,
      chartId,
    }) => {
      let allDatas = [];
      let labels = [];
      let options;
      if (data && data[0]) {
        if (timePeriod !== 999) {
          const firstValidSeries = data.find(
            (param) =>
              Array.isArray(param?.detail)
              && Array.isArray(param.detail[0]?.Data)
              && param.detail[0].Data.length > 0
          );
          const labelSource = firstValidSeries?.detail?.[0]?.Data || [];
          labels = labelSource.map((el) =>
            dayjs(el.Time).format("YYYY/MM/DD HH:mm:ss")
          );
          data.forEach((param) => {
            const datas = Array.isArray(param?.detail)
              && Array.isArray(param.detail[0]?.Data)
              ? param.detail[0].Data.map((el) => el.Value)
              : [];
            const tagDatas = {
              label: param.name,
              datas,
              color: paramsSetting.find((el) => el.name === param.name)?.color,
            };
            allDatas.push(tagDatas);
          });
        } else {
          // 即時：使用 append/shift 方式
          const seriesNames = data.map(p => p.name);
          const buffer = getRTBuffer(chartId, seriesNames);
          const ts = dayjs().format("HH:mm:ss");

          // 追加時間點
          buffer.labels.push(ts);
          if (buffer.labels.length > MAX_RT_POINTS) buffer.labels.shift();

          // 依序列追加當前值（使用 summary 作為即時值）
          data.forEach((param) => {
            const arr = buffer.series.get(param.name);
            const val = Number(param.summary ?? 0);
            arr.push(val);
            if (arr.length > MAX_RT_POINTS) arr.shift();
          });

          labels = [...buffer.labels];
          allDatas = seriesNames.map((name) => ({
            label: name,
            datas: [...(buffer.series.get(name) || [])],
            color: paramsSetting.find((el) => el.name === name)?.color,
          }));
        }

        options = {
          plugins: {
            zoom: {
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "xy",
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
          },
          scales: {
            y: {
              title: {
                display: true,
                text: unitText,
              },
            },
          },
        };
      }

      // 使用穩定的顏色生成，避免重複計算
      const datasets = [];
      allDatas.forEach((el, idx) => {
        const stableColors = getStableColors(allDatas.length, []);
        datasets.push({
          label: el.label,
          yAxisID: "y",
          data: el.datas,
          borderColor: el.color || stableColors[idx],
          backgroundColor: el.color || stableColors[idx],
        });
      });

      const colSpan = {
        xs: 24,
        sm: 24,
        lg: 18,
      };
      return {
        colSpan,
        labels,
        datasets,
        options,
      };
    };

    // 快取顏色生成器結果，避免重複計算
    const colorCache = ref(new Map());

    const getStableColors = (length, paramColors) => {
      if (paramColors && paramColors.length > 0) {
        return paramColors;
      }

      const cacheKey = `colors_${length}`;
      if (!colorCache.value.has(cacheKey)) {
        colorCache.value.set(cacheKey, useColorGenerator(length));
      }
      return colorCache.value.get(cacheKey);
    };

    // 穩定的點擊處理函數，避免每次重新創建
    const createPieChartClickHandler = (data, timePeriod, summary) => {
      return (_, element) => {
        if (!element || !element[0]) return;

        const index = element[0].index;
        const detail = data[index].detail.map((el) => ({
          name: timePeriod !== 999 ? el.TagName : el.Name,
          value:
            timePeriod !== 999
              ? el.Summary[
                  summaryTypeOptions.value.find(
                    (type) => type.value === summary
                  )?.value
                ]
              : el.Value,
        }));
        const title = data[index].name;
        dispatch("dashboard/fetchDetail", detail);
        detailModalTitle.value = `${title} 詳情`;

        detailColumns.value = [
          {
            title: "名稱",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "值",
            align: "right",
            dataIndex: "value",
            key: "value",
          },
        ];
        detailModal.value = true;
      };
    };

    const fetchPieChart = ({
      data,
      unitText,
      timePeriod,
      summary,
      params: paramsSetting,
    }) => {
      let labels = [];
      let series = [];
      let colors = [];
      let total = 0;
      if (data && data[0]) {
        labels = data.map((el) => el.name);
        series = data.map((el) => Number(el.summary || 0)); // 確保數字類型一致
        colors = paramsSetting.map((el) => el.color);
        total = series.reduce((a, b) => {
          return a + b;
        }, 0);
      }

      // 使用穩定的顏色和格式化結果
      const stableColors = getStableColors(data?.length || 0, colors);
      const formattedTotal = useNumformatter(total, 0);

      // 使用穩定的主題顏色，避免響應式變化
      const stableBorderColor = "#ffffff"; // 固定使用白色邊框

      // 使用穩定的點擊處理函數
      const stableClickHandler = createPieChartClickHandler(data, timePeriod, summary);

      const colSpan = {
        xs: 24,
        sm: 24,
        lg: 6,
      };
      return {
        colSpan,
        labels,
        unit: unitText,
        datasets: [
          {
            label: 'doughnut-main',
            data: series,
            backgroundColor: stableColors,
            centerText: formattedTotal,
          },
        ],
        options: {
          cutout: "80%", // 視覺上將甜甜圈厚度減半（原 60% → 80%）
          borderWidth: 1, // 減小邊框寬度
          maintainAspectRatio: true,
          responsive: true,
          borderColor: stableBorderColor,
          plugins: {
            legend: {
              display: false,
            },
            labels: {
              display: false,
            },
          },
          animation: {
            animateScale: false, // 關閉動畫，避免重繪
            animateRotate: false,
          },
          onClick: stableClickHandler,
        },
        total,
      };
    };

    const fetchGuageChart = ({
      data,
      unitText,
      limit,
      timePeriod,
      name,
      summary,
      params: paramsSetting,
    }) => {
      const colSpan = {
        xs: 24,
        sm: 24,
        lg: 6,
      };
      let series = 0;
      let percentage = 0;
      if (data[0]) {
        series = data[0].summary;
        percentage = ((series / limit) * 100).toFixed(2);
      }
      return {
        onClick: () => {
          const detail = data[0].detail.map((el) => ({
            name: timePeriod !== 999 ? el.TagName : el.Name,
            value:
              timePeriod !== 999
                ? el.Summary[
                    summaryTypeOptions.value.find(
                      (type) => type.value === summary
                    ).value
                  ]
                : el.Value,
          }));
          dispatch("dashboard/fetchDetail", detail);
          detailModalTitle.value = `${name} 詳情`;

          detailColumns.value = [
            {
              title: "名稱",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "值",
              align: "right",
              dataIndex: "value",
              key: "value",
            },
          ];
          detailModal.value = true;
        },
        source: data,
        unit: unitText,
        colSpan,
        series: [percentage],
        chartOptions: {
          chart: {
            height: 280,
            type: "radialBar",
          },
          colors: paramsSetting[0].color
            ? [paramsSetting[0].color]
            : ["#4BC6B9"],
          plotOptions: {
            radialBar: {
              startAngle: -135,
              endAngle: 135,
              track: {
                background: "#333",
                startAngle: -135,
                endAngle: 135,
              },
              dataLabels: {
                name: {
                  show: false,
                },
                value: {
                  fontSize: "25px",
                  show: true,
                  formatter: function () {
                    return `${series}`;
                  },
                },
              },
            },
          },
          fill: {
            type: "gradient",
            gradient: {
              shade: "dark",
              type: "horizontal",
              gradientToColors: ["#FF8000"],
              stops: [0, 100],
            },
          },
          stroke: {
            lineCap: "butt",
          },
        },
      };
    };

    const fetchBarChart = ({
      data,
      unitText,
      timePeriod,
      summary,
      params: paramsSetting,
    }) => {
      let labels = [];
      let datas = [];
      let colors = [];
      if (data) {
        labels = data.map((el) => el.name);
        datas = data.map((el) => el.summary);
        colors = paramsSetting.map((el) => el.color);
      }

      // 使用穩定的顏色，避免重複生成
      const stableColors = getStableColors(data?.length || 0, colors);
      const backgroundColor = stableColors.length > 0 ? stableColors : ["rgba(255, 128, 0, 0.7)"];
      const borderColor = stableColors.length > 0 ? stableColors : ["rgba(255, 128, 0, 1)"];

      const colSpan = {
        xs: 24,
        sm: 24,
        lg: 12,
      };
      return {
        colSpan,
        labels,
        datasets: [
          {
            label: `(${unitText})`,
            data: datas,
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
          },
        ],
        options: {
          responsive: true,
          height: 300,
          maintainAspectRatio: false,
          scales: {
            y: {
              title: {
                display: true,
                text: unitText,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },

          elements: {
            bar: {
              borderRadius: 4,
            },
          },
          onClick: (_, element) => {
            if (element[0]) {
              const index = element[0].index;
              const detail = data[index].detail.map((el) => ({
                name: timePeriod !== 999 ? el.TagName : el.Name,
                value:
                  timePeriod !== 999
                    ? el.Summary[
                        summaryTypeOptions.value.find(
                          (type) => type.value === summary
                        )?.value
                      ]
                    : el.Value,
              }));
              const title = data[index].name;
              dispatch("dashboard/fetchDetail", detail);
              detailModalTitle.value = `${title} 詳情`;

              detailColumns.value = [
                {
                  title: "名稱",
                  dataIndex: "name",
                  key: "name",
                },
                {
                  title: "值",
                  align: "right",
                  dataIndex: "value",
                  key: "value",
                },
              ];
              detailModal.value = true;
            }
          },
        },
      };
    };

    const fetchText = ({ data, unitText, timePeriod, summary }) => {
      const colSpan = {
        xs: 24,
        sm: 24,
        lg: 6,
      };
      return {
        onClick: (index) => {
          const detail = data[index].detail.map((el) => ({
            name: timePeriod !== 999 ? el.TagName : el.Name,
            value:
              timePeriod !== 999
                ? el.Summary[
                    summaryTypeOptions.value.find(
                      (type) => type.value === summary
                    )?.value
                  ]
                : el.Value,
          }));
          dispatch("dashboard/fetchDetail", detail);
          detailModalTitle.value = `${data[index].name} 詳情`;

          detailColumns.value = [
            {
              title: "名稱",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "值",
              align: "right",
              dataIndex: "value",
              key: "value",
            },
          ];
          detailModal.value = true;
        },
        unit: unitText,
        data: data.length > 0 ? data : [0],
        colSpan,
      };
    };

    const dashboardData = computed(() => {
      const res = state.dashboard.data.map((el) => {
        // 強制修正：名為 "Pie" 的圖表始終使用 doughnut 類型
        let chartType = el.chartType;
        if (el.name === "Pie") {
          chartType = "doughnut";
        }
        
        let chartData;
        if (chartType === "line") {
          chartData = fetchLineChart({ ...el, chartId: el.id });
        }
        if (chartType === "doughnut") {
          chartData = fetchPieChart(el);
        }
        if (chartType === "radialBar") {
          chartData = fetchGuageChart(el);
        }
        if (chartType === "bar") {
          chartData = fetchBarChart(el);
        }
        if (chartType === "card") {
          chartData = fetchText(el);
        }
        return {
          id: el.id,
          name: el.name,
          chartType: chartType, // 使用修正後的 chartType
          limit: el.limit,
          data: chartData,
          unit: el.unit,
          unitText: el.unitText,
          params: el.params,
          timePeriod: el.timePeriod,
          summary: el.summary,
          paramSummary: el.paramSummary,
          periodText: timePeriodOptions.value.find(
            (k) => k.id === el.timePeriod
          ).name,
          // 一併保留後端回傳的 layout，供 GridStack 初始化套用
          layout: el.layout,
        };
      });
      return res;
    });

    // 監聽 dashboardData 變化，渲染/同步 GridStack 項目
    const draggableDashboardData = ref([]);
    const DASHBOARD_ORDER_KEY = "dashboard_chart_order";

    const getStoredChartOrder = () => {
      migrateLegacyStorageKeyToTenantScope(DASHBOARD_ORDER_KEY);
      return getTenantScopedItem(DASHBOARD_ORDER_KEY) || [];
    };
    const saveChartOrder = (order) => setTenantScopedItem(DASHBOARD_ORDER_KEY, order);

    const reorderChartsByStoredOrder = (charts) => {
      const storedOrder = getStoredChartOrder();
      if (storedOrder.length === 0) return charts;
      const orderedCharts = [];
      const chartMap = new Map(charts.map(chart => [chart.id, chart]));
      storedOrder.forEach(id => { if (chartMap.has(id)) { orderedCharts.push(chartMap.get(id)); chartMap.delete(id); } });
      chartMap.forEach(chart => orderedCharts.push(chart));
      return orderedCharts;
    };

    const initDraggableData = () => {
      const charts = dashboardData.value;
      draggableDashboardData.value = reorderChartsByStoredOrder(charts);
      // 以後端 layout 為準，覆寫本機快取，避免不同分頁/裝置不一致
      const local = loadGridPos();
      const backend = buildBackendLayoutMap(draggableDashboardData.value);
      const merged = { ...local, ...backend };
      // 若本機沒有任何快取，直接採用後端
      const current = Object.keys(local).length === 0 ? backend : merged;
      // 確保每個項目都有座標
      draggableDashboardData.value.forEach(c => {
        if (!current[c.id]) current[c.id] = { x: 0, y: 0, w: 6, h: 6 };
      });
      gridPositions.value = current;
      saveGridPos(current);
      nextTick(() => initGrid());
    };

    watch(dashboardData, () => {
      initDraggableData();
    }, { immediate: true });

    const onDragEnd = (evt) => {
      const { newIndex, oldIndex } = evt;
      if (newIndex !== oldIndex) {
        const currentOrder = draggableDashboardData.value.map(chart => chart.id);
        saveChartOrder(currentOrder);
        notification.success({ message: "圖表順序已更新", description: "您的圖表排列已保存，下次開啟時將保持此順序" });
      }
    };

    // 縮放功能（保留原彈窗，與 GridStack 內建縮放並行）
    const CHART_SIZE_KEY = "dashboard_chart_sizes";
    const getStoredChartSizes = () => {
      migrateLegacyStorageKeyToTenantScope(CHART_SIZE_KEY);
      return getTenantScopedItem(CHART_SIZE_KEY) || {};
    };
    const saveChartSizes = (sizes) => setTenantScopedItem(CHART_SIZE_KEY, sizes);

    const getChartStyle = () => ({});

    const getChartHeight = (chartId) => {
      const sizes = getStoredChartSizes();
      const chartSize = sizes[chartId];
      if (chartSize) {
        const calculatedHeight = chartSize.height - 140;
        return Math.max(calculatedHeight, 120);
      }
      const chartData = draggableDashboardData.value.find(chart => chart.id === chartId);
      if (chartData && chartData.chartType === 'doughnut') return 150;
      return 300;
    };

    const resizeModalVisible = ref(false);
    const resizeForm = reactive({ chartId: null, width: 6, height: 300 });
    const openResizeModal = (chart) => {
      const sizes = getStoredChartSizes();
      const currentSize = sizes[chart.id] || { width: getGridPos(chart.id).w, height: getChartHeight(chart.id) };
      resizeForm.chartId = chart.id; resizeForm.width = currentSize.width; resizeForm.height = currentSize.height; resizeModalVisible.value = true;
    };
    const closeResizeModal = () => { resizeModalVisible.value = false; };
    const saveResizeSettings = () => {
      const sizes = getStoredChartSizes();
      sizes[resizeForm.chartId] = { width: resizeForm.width, height: resizeForm.height };
      saveChartSizes(sizes);
      // 同步 GridStack 寬度（w）
      if (grid.value) {
        const el = gridEl.value.querySelector(`[data-id="${resizeForm.chartId}"]`);
        if (el) grid.value.update(el, { w: resizeForm.width });
      }
      nextTick(() => { draggableDashboardData.value = [...draggableDashboardData.value]; });
      closeResizeModal();
      notification.success({ message: "圖表大小已更新", description: "您的圖表尺寸已保存" });
    };
    const resetChartSize = (chartId) => {
      const sizes = getStoredChartSizes();
      delete sizes[chartId];
      saveChartSizes(sizes);
      nextTick(() => { draggableDashboardData.value = [...draggableDashboardData.value]; });
      notification.success({ message: "圖表大小已重置", description: "圖表已恢復預設大小" });
    };

    const chartSettingModal = ref(false);
    const settingFormState = reactive({ id: null, limit: null, chartType: null, name: null, timePeriod: null, paramSummary: null, summary: null, unit: null, params: [] });
    const openAddModal = () => { const obj = { id: null, chartType: "line", name: null, limit: null, paramSummary: "Summation", timePeriod: 1, summary: "Summation", unit: 1, params: [{ name: null, tags: [], groups: [], color: "#000000" }] }; Object.assign(settingFormState, obj); chartSettingModal.value = true;};
    const openEditModal = ({ id, chartType, params, name, limit, timePeriod, unit, paramSummary, summary }) => { const obj = { id, chartType, name, timePeriod, paramSummary, summary, unit, limit, params }; Object.assign(settingFormState, obj); chartSettingModal.value = true; };
    const closeModal = () => { chartSettingModal.value = false; };

    const submitSetting = async (data) => {
      try {
        let title; const unitText = unitOptions.value.find((el) => el.Id === data.unit).Name;
        if (data.id) { await dispatch("dashboard/editChart", { ...data, unitText }); title = "修改成功"; } else { await dispatch("dashboard/addChart", { ...data, unitText }); title = "新增成功"; }
        chartSettingModal.value = false;
        notification.success({ message: title });
      } catch (err) { Modal.error({ title: "發生錯誤", content: err.message }); }
    };

    const deleteChart = async (id) => {
      Modal.confirm({ title: "確認刪除?", okText: "確認", cancelText: "取消", onOk: async () => { try { await dispatch("dashboard/deleteChart", id); notification.success({ message: "刪除成功" }); } catch (err) { Modal.error({ title: "發生錯誤", content: err.message }); } } });
    };

    const detailModal = ref(false);
    const detailModalTitle = ref("");
    const detailColumns = ref([]);
    const detailTableData = computed(() => state.dashboard.detailTableData);
    const filterDetailTable = (e) => { dispatch("dashboard/filterDetailTable", e.target.value); };
    const closeDetailModal = () => { detailModal.value = false; };

    return {
      permission, loading, isInit, customTooltips, chartTypeOptions, timePeriodOptions, summaryTypeOptions, paramSummaryOptions, unitOptions,
      dashboardData, draggableDashboardData, onDragEnd, getChartStyle, getChartHeight,
      resizeModalVisible, resizeForm, openResizeModal, closeResizeModal, saveResizeSettings, resetChartSize,
      chartSettingModal, settingFormState, openAddModal, openEditModal, closeModal, submitSetting, deleteChart,
      detailModal, detailModalTitle, detailColumns, detailTableData, filterDetailTable, closeDetailModal, usePeriodTime, editMode,
      gridEl, getGridPos
    };
  },
});
