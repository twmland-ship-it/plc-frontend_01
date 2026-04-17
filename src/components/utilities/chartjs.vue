<template>
  <canvas :class="className" :id="id" :style="canvasStyle" :height="height"></canvas>
</template>
<script>
import {
  Chart,
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
} from "chart.js";
import VueTypes from "vue-types";
import {
  defineComponent,
  onBeforeUnmount,
  onMounted,
  toRefs,
  nextTick,
  watch,
  ref,
  computed,
  markRaw,
} from "vue";
import { customTooltips } from "../utilities/utilities";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  SubTitle,
  zoomPlugin
);

export default defineComponent({
  name: "ChartJs",
  props: {
    type: VueTypes.string.def("line"),
    className: VueTypes.string.isRequired.def("bar"),
    id: VueTypes.string.isRequired.def("bar"),
    style: VueTypes.object.def({ marginBottom: "20px" }),
    labels: VueTypes.arrayOf(VueTypes.string).def([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]),
    height: VueTypes.oneOfType([String, Number]).def(479),
    scales: VueTypes.object.def({
      y: {
        beginAtZero: true,
        grid: {
          color: "#485e9029",
          borderDash: [3, 3],
          zeroLineColor: "#485e9029",
          zeroLineWidth: 1,
        },
        ticks: {
          beginAtZero: true,
          fontSize: 14,
          fontFamily: "Jost",
          color: "#8C90A4",
          max: 80,
          stepStartValue: 5,
          stepSize: 20,
          padding: 10,
          callback(label) {
            return `${label}k`;
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: false,
          zeroLineWidth: 0,
          color: "transparent",
          z: 1,
        },
        ticks: {
          beginAtZero: true,
          fontSize: 14,
          fontFamily: "Jost",
          color: "#8C90A4",
        },
      },
    }),
    datasets: VueTypes.arrayOf(VueTypes.object).def([
      {
        data: [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30],
        backgroundColor: "#001737",
        barPercentage: 0.6,
        label: "Profit",
      },
      {
        data: [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20],
        backgroundColor: "#1ce1ac",
        barPercentage: 0.6,
        label: "Lose",
      },
    ]),
    layout: VueTypes.object.def({}),
    legend: VueTypes.object.def({
      display: false,
      labels: {
        display: false,
        position: "center",
      },
    }),
    elements: VueTypes.object.def({
      line: {
        tension: 0.6,
        borderCapStyle: "round",
        borderJoinStyle: "round",
        capBezierPoints: true,
      },
      point: {
        radius: 0,
        z: 5,
      },
    }),
    options: VueTypes.object.def({}),
    tooltip: VueTypes.object.def({
      callbacks: {
        label(t) {
          const dstLabel = t.dataset.label;
          const { formattedValue } = t;
          return `${dstLabel}:  ${formattedValue} `;
        },
        labelColor(t) {
          return {
            backgroundColor: t.dataset.hoverBackgroundColor,
            borderColor: "transparent",
          };
        },
      },
    }),
  },
  setup(props) {
    const {
      type,
      datasets,
      options,
      labels,
      id,
      tooltip,
      scales,
      elements,
      legend,
      layout,
      height,
    } = toRefs(props);

    const chart = ref(null);
    const lastDataHash = ref('');
    const isInitialized = ref(false);
    const lastOptionsHash = ref('');

    // 產生專用的圓餅圖中心繪製插件
    const createCenterDoughnutPlugin = () => ({
      id: 'centerDoughnut',
      afterDatasetsDraw(chart) {
        try {
          if (chart.config.type !== 'doughnut') return;
          const meta = chart.getDatasetMeta(0);
          const firstArc = meta && meta.data && meta.data[0];
          if (!firstArc) return;

          const { x: centerX, y: centerY, innerRadius, outerRadius } = firstArc;
          const ctx = chart.ctx;

          // 讀取第一個資料集的中心顯示文字
          const ds0 = chart.data?.datasets?.[0] || {};
          const centerText = ds0.centerText ?? '';
          const centerTextLabel = ds0.centerTextLabel ?? '';

          // 動態計算所需白圈半徑與字體大小，避免被環遮住
          const baseFont = 28; // 基準字體大小
          const minFont = 12;  // 最小字體
          const padding = 8;   // 文字左右留白
          const minRing = 6;   // 最小保留環厚度（px）

          // 先用基準字體量測文字寬度
          ctx.save();
          ctx.font = `bold ${baseFont}px Jost, sans-serif`;
          const textWidth = centerText ? ctx.measureText(centerText).width : 0;
          const baseHole = Math.max((innerRadius || 0) - 2, 10);
          const requiredHole = Math.ceil(textWidth / 2 + padding);
          // 允許擴大白圈，但需保留最少的環厚度
          const maxHole = Math.max(0, (outerRadius || baseHole) - minRing);
          const holeRadius = Math.min(Math.max(baseHole, requiredHole), maxHole);

          // 計算實際可用寬度，若仍不足則縮小字體
          const availableWidth = Math.max(0, holeRadius * 2 - padding * 2);
          let fontSize = baseFont;
          if (centerText && textWidth > availableWidth) {
            const scale = availableWidth / Math.max(textWidth, 1);
            fontSize = Math.max(minFont, Math.floor(baseFont * scale));
          }

          // 畫中心白圈（即使 cutout 失效也能維持視覺上的圓心）
          ctx.beginPath();
          ctx.arc(centerX, centerY, holeRadius, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();

          // 畫主要數字
          if (centerText) {
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = `bold ${fontSize}px Jost, sans-serif`;
            ctx.fillText(centerText, centerX, centerY);
          }

          // 畫副標籤（如有）
          if (centerTextLabel) {
            ctx.fillStyle = '#666666';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.font = '12px Jost, sans-serif';
            // 與主數字避免重疊，固定位移（可依需求微調）
            ctx.fillText(centerTextLabel, centerX, centerY + Math.floor(fontSize/2) + 6);
          }
          ctx.restore();
        } catch (e) {
          // 忽略插件繪製錯誤，避免影響主流程
        }
      },
    });

    // 折線/長條通用覆蓋層：平均線與最新值徽標
    const createOverlayPlugin = () => ({
      id: 'overlay',
      afterDatasetsDraw(chart) {
        try {
          const t = chart.config.type;
          if (t !== 'line' && t !== 'bar') return;
          const overlay = chart.options?.plugins?.overlay || {};
          const showAvg = overlay.showAverageLine;
          const showLast = overlay.showLatestValue;
          if (!showAvg && !showLast) return;

          const ctx = chart.ctx;
          const area = chart.chartArea;
          const yScale = chart.scales?.y || Object.values(chart.scales).find(s => s.axis === 'y');
          if (!area || !yScale) return;

          // 畫平均線（取第一個資料集作為代表）
          if (showAvg && chart.data?.datasets?.[0]?.data?.length) {
            const vals = (chart.data.datasets[0].data || []).map(v => Number(v)).filter(v => Number.isFinite(v));
            if (vals.length) {
              const avg = vals.reduce((a,b)=>a+b,0) / vals.length;
              const y = yScale.getPixelForValue(avg);
              ctx.save();
              ctx.strokeStyle = overlay.averageLineColor || '#A0AEC0';
              ctx.lineWidth = overlay.averageLineWidth || 1;
              ctx.setLineDash([4, 4]);
              ctx.beginPath();
              ctx.moveTo(area.left, y);
              ctx.lineTo(area.right, y);
              ctx.stroke();
              // 標註文字
              ctx.fillStyle = overlay.averageTextColor || '#4A5568';
              ctx.font = '12px Jost, sans-serif';
              const unit = chart.options?.scales?.y?.title?.text || '';
              ctx.fillText(`AVG ${avg.toFixed(2)}${unit ? ' ' + unit : ''}`, area.left + 6, y - 6);
              ctx.restore();
            }
          }

          // 繪製每個資料集的最新值徽標
          if (showLast && Array.isArray(chart.data?.datasets)) {
            chart.data.datasets.forEach((ds, i) => {
              const meta = chart.getDatasetMeta(i);
              const points = meta?.data;
              if (!points || !points.length) return;
              const last = points[points.length - 1];
              const val = ds.data?.[ds.data.length - 1];
              if (!last || typeof last.x !== 'number' || typeof last.y !== 'number' || !Number.isFinite(Number(val))) return;

              const x = last.x + 8;
              const y = last.y - 8;
              const text = String(Number(val).toFixed(2));
              const bg = (ds.borderColor || ds.backgroundColor || '#3182CE');

              ctx.save();
              ctx.font = '12px Jost, sans-serif';
              const paddingX = 6;
              const textW = ctx.measureText(text).width;
              const w = textW + paddingX * 2;
              const h = 18;

              // 背景（圓角矩形）
              const r = 6;
              const drawRoundRect = (x0, y0, width, height, radius) => {
                const rr = Math.min(radius, width/2, height/2);
                ctx.beginPath();
                ctx.moveTo(x0 + rr, y0);
                ctx.arcTo(x0 + width, y0, x0 + width, y0 + height, rr);
                ctx.arcTo(x0 + width, y0 + height, x0, y0 + height, rr);
                ctx.arcTo(x0, y0 + height, x0, y0, rr);
                ctx.arcTo(x0, y0, x0 + width, y0, rr);
                ctx.closePath();
              };

              ctx.globalAlpha = 0.9;
              ctx.fillStyle = '#ffffff';
              drawRoundRect(x, y - h / 2, w, h, r);
              ctx.fill();
              ctx.lineWidth = 1;
              ctx.strokeStyle = bg;
              ctx.stroke();

              // 文字
              ctx.fillStyle = '#1A202C';
              ctx.textAlign = 'left';
              ctx.textBaseline = 'middle';
              ctx.fillText(text, x + paddingX, y);
              ctx.restore();
            });
          }
        } catch (e) {
          // 忽略覆蓋層繪製錯誤
        }
      },
    });

    // 轉為非響應式的純物件，避免 Chart.js 與 Vue Proxy 互相影響
    const toPlain = (val) => {
      try {
        return JSON.parse(JSON.stringify(val));
      } catch (_) {
        return val;
      }
    };

    // 計算 canvas 樣式，確保高度正確響應
    const canvasStyle = computed(() => {
      const heightValue = height.value;
      if (typeof heightValue === 'number') {
        return {
          height: `${heightValue}px`,
          width: '100%'
        };
      } else if (typeof heightValue === 'string') {
        return {
          height: heightValue,
          width: '100%'
        };
      }
      return { width: '100%' };
    });

    // 計算資料雜湊值，用於比較資料是否真正變化
    const getDataHash = () => {
      return JSON.stringify({
        labels: labels.value,
        datasets: datasets.value?.map(d => ({
          data: d.data,
          label: d.label,
          backgroundColor: d.backgroundColor,
          borderColor: d.borderColor,
          borderWidth: d.borderWidth,
          centerText: d.centerText,
          centerTextLabel: d.centerTextLabel
        })),
        options: options.value
      });
    };

    // 產生 options 類設定的雜湊，用來判斷是否真的需要重建
    const getOptionsHash = () => {
      return JSON.stringify({
        type: type.value,
        options: options.value,
        scales: scales.value,
        elements: elements.value,
        legend: legend.value,
      });
    };

    // 檢查資料是否有變化
    const hasDataChanged = () => {
      const currentHash = getDataHash();
      if (currentHash !== lastDataHash.value) {
        lastDataHash.value = currentHash;
        return true;
      }
      return false;
    };

    // 保留 placeholder（已改為直接替換 datasets）

    // 初始化圖表（只執行一次）
    const initChart = () => {
      if (isInitialized.value) return;

      nextTick(() => {
        const chartElement = document.getElementById(`${id.value}`);
        if (!chartElement || chart.value) return;

        // 檢查 Canvas 元素是否存在且有效
        if (!chartElement.getContext) {
          console.warn(`Canvas element for chart ${id.value} is not valid`);
          return;
        }

        try {
          const initialLabels = Array.isArray(labels.value) ? toPlain(labels.value) : [];
          const initialDatasets = Array.isArray(datasets.value) ? toPlain(datasets.value) : [];
          const externalOptions = options.value ? toPlain(options.value) : {};

          chart.value = markRaw(new Chart(chartElement, {
            type: type.value,
            data: {
              labels: initialLabels,
              datasets: initialDatasets,
            },
            options: {
              responsive: true,
              maintainAspectRatio: externalOptions?.maintainAspectRatio ?? false,
              animation: { duration: 0, easing: 'linear' },
              layout,
              hover: {
                mode: "index",
                intersect: false,
              },
              plugins: {
                legend: legend.value,
                tooltip: {
                  yAlign: "bottom",
                  mode: "index",
                  intersect: false,
                  backgroundColor: "#ffffff",
                  boxShadow: "0 8px 5px #ADB5D915",
                  position: "average",
                  titleColor: "#ADB5D9",
                  color: "#ADB5D9",
                  titleFontSize: 12,
                  titleSpacing: 10,
                  bodyColor: "#404040",
                  bodyFontSize: 11,
                  bodyFontStyle: "normal",
                  bodyFontFamily: "'Jost', sans-serif",
                  borderColor: "#F1F2F6",
                  usePointStyle: true,
                  borderWidth: 1,
                  bodySpacing: 10,
                  padding: {
                    x: 10,
                    y: 8,
                  },
                  z: 999999,
                  enabled: false,
                  external: customTooltips,
                  ...toPlain(tooltip.value),
                },
              },
              elements: elements.value,
              scales: scales.value,
              // 若為 doughnut，確保 cutout 一直存在（避免成為實心圓）
              cutout: type.value === 'doughnut' ? (externalOptions?.cutout ?? '60%') : undefined,
              ...externalOptions,
            },
            // 掛入中心繪製插件與通用覆蓋層插件
            plugins: [createCenterDoughnutPlugin(), createOverlayPlugin()],
          }));

          isInitialized.value = true;
          lastDataHash.value = getDataHash();
          lastOptionsHash.value = getOptionsHash();
          console.log(`Chart ${id.value} initialized successfully`);
        } catch (error) {
          console.error(`Failed to initialize chart ${id.value}:`, error);
          isInitialized.value = false;
        }
      });
    };

    // 平滑更新圖表資料
    const updateChart = () => {
      if (!chart.value || !hasDataChanged()) return;

      try {
        // 畫布若失效（DOM 被替換/銷毀），則直接重建
        const canvas = chart.value.canvas;
        if (!canvas || typeof canvas.getContext !== 'function') {
          console.warn(`Chart ${id.value} canvas invalid during update, reinitializing...`);
          if (typeof chart.value.stop === 'function') chart.value.stop();
          chart.value.destroy();
          chart.value = null;
          isInitialized.value = false;
          initChart();
          return;
        }

        if (!datasets.value || datasets.value.length === 0) {
          console.warn('Chart datasets are empty, skipping update');
          return;
        }

        const hasValidData = datasets.value.some(dataset => 
          dataset.data && Array.isArray(dataset.data) && dataset.data.length > 0
        );
        if (!hasValidData) {
          console.warn('Chart has no valid data, skipping update');
          return;
        }

        // 就地同步 labels（使用純陣列）
        const newLabels = Array.isArray(labels.value) ? toPlain(labels.value) : [];
        chart.value.data.labels.length = 0;
        chart.value.data.labels.push(...newLabels);

        // 直接以純物件替換 datasets，避免 Proxy 殘留
        chart.value.data.datasets = Array.isArray(datasets.value) ? toPlain(datasets.value) : [];

        // doughnut 類型更新時維持 cutout
        if (type.value === 'doughnut') {
          const externalOptions = options.value ? toPlain(options.value) : {};
          chart.value.options.cutout = externalOptions?.cutout ?? (chart.value.options.cutout || '60%');
        }

        // 啟用無動畫更新，避免 Animator 殘留影響
        chart.value.update('none');
      } catch (error) {
        console.warn('Chart update failed:', error);
        if (chart.value) {
          if (typeof chart.value.stop === 'function') {
            chart.value.stop();
          }
          chart.value.destroy();
          chart.value = null;
          isInitialized.value = false;
          initChart();
        }
      }
    };

    onMounted(() => {
      initChart();
    });

    watch([datasets, labels], () => {
      if (isInitialized.value && chart.value) {
        if (chart.value.canvas && chart.value.canvas.getContext) {
          updateChart();
        } else {
          console.warn(`Chart ${id.value} canvas is no longer valid, reinitializing...`);
          if (chart.value) {
            if (typeof chart.value.stop === 'function') {
              chart.value.stop();
            }
            chart.value.destroy();
            chart.value = null;
          }
          isInitialized.value = false;
          initChart();
        }
      }
    }, { deep: true });

    watch([options, scales, elements, legend], () => {
      const current = getOptionsHash();
      if (current === lastOptionsHash.value) return; // 無實質變化，不重建
      lastOptionsHash.value = current;
      if (chart.value) {
        if (typeof chart.value.stop === 'function') {
          chart.value.stop();
        }
        chart.value.destroy();
        chart.value = null;
      }
      isInitialized.value = false;
      initChart();
    }, { deep: true });

    watch(height, (newHeight, oldHeight) => {
      console.log(`Chart height changed from ${oldHeight} to ${newHeight}`);
      if (chart.value && isInitialized.value) {
        nextTick(() => {
          try {
            console.log('Triggering chart resize...');
            const canvas = chart.value.canvas;
            if (canvas && canvas.parentNode) {
              chart.value.resize();
            } else {
              console.warn('Canvas element not found, reinitializing chart...');
              if (chart.value) {
                if (typeof chart.value.stop === 'function') {
                  chart.value.stop();
                }
                chart.value.destroy();
                chart.value = null;
              }
              isInitialized.value = false;
              initChart();
            }
          } catch (error) {
            console.warn('Chart resize failed:', error);
            if (chart.value) {
              if (typeof chart.value.stop === 'function') {
                chart.value.stop();
              }
              chart.value.destroy();
              chart.value = null;
              isInitialized.value = false;
              initChart();
            }
          }
        });
      }
    });

    onBeforeUnmount(() => {
      if (chart.value) {
        if (typeof chart.value.stop === 'function') {
          chart.value.stop();
        }
        chart.value.destroy();
        chart.value = null;
      }
    });

    return {
      canvasStyle,
    };
  },
});
</script>
