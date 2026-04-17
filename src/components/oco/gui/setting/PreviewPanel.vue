<template>
  <div class="preview-panel">
    <div class="preview-body">
      <!-- 左側：預覽容器 -->
      <div class="preview-container" ref="previewContainer">
        <div class="info-trigger">
          <a-button size="small" type="default" @click="infoOpen = true">
            資訊面板
          </a-button>
        </div>

        <!-- 縮小版「真實畫面」：上方 Header / 左側選單 / 內容可用區 -->
        <div class="screen-stage">
          <div class="screen-frame" :style="screenFrameOuterStyle">
            <!-- Header（不可用區）- 僅顯示遮罩，不顯示文字標籤 -->
            <div class="screen-frame-inner" :style="screenFrameInnerStyle">
              <div class="sim-header" :style="simHeaderStyle"></div>

              <!-- Body -->
              <div class="sim-body" :style="simBodyStyle">
                <!-- Sidebar（不可用區）- 僅顯示遮罩，不顯示文字標籤 -->
                <div class="sim-sidebar" :style="simSidebarStyle"></div>

                <!-- Main（包含 padding 與可用顯示區） -->
                <div class="sim-main" :style="simMainStyle">
                  <div class="sim-padding" :style="simPaddingStyle">
                    <!-- 可用顯示區（紅色虛線框） -->
                    <div class="viewport-box" :style="contentAreaStyle">
                      <div class="marker-label">iframe 可用顯示區（紅框內可調整）</div>

                      <!-- Iframe Content Box (可拖曳與縮放) -->
                      <vue-draggable-resizable
                        v-if="showDraggable"
                        :w="currentW"
                        :h="currentH"
                        :x="currentX"
                        :y="currentY"
                        :min-width="50"
                        :min-height="50"
                        :parent="false"
                        :active="true"
                        :draggable="true"
                        :resizable="true"
                        class-name="iframe-draggable"
                        @dragging="onDrag"
                        @resizing="onResize"
                        @drag-stop="onDragStop"
                        @resize-stop="onResizeStop"
                      >
                        <div class="preview-content">
                          <iframe
                            v-if="iframeSrc"
                            class="preview-iframe"
                            :src="iframeSrc"
                            frameborder="0"
                            title="OCOGUI iframe 預覽"
                          ></iframe>
                          <div v-else class="preview-empty">
                            <div class="preview-icon">🖼️</div>
                            <div class="preview-text">尚未選擇視圖</div>
                          </div>
                          <div class="preview-ratio">{{ Math.round(currentW) }} × {{ Math.round(currentH) }}</div>
                        </div>
                      </vue-draggable-resizable>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer（可選，不一定有）- 僅顯示遮罩，不顯示文字標籤 -->
              <div v-if="footerHeight > 0" class="sim-footer" :style="simFooterStyle"></div>
            </div>
          </div>
        </div>

      </div>
      
      <a-drawer
        v-model:visible="infoOpen"
        placement="right"
        :width="360"
        title="資訊面板"
      >
        <div class="size-info in-drawer">
          <div class="info-item">
            <div class="info-label">iframe 尺寸</div>
            <div class="info-value">{{ Math.round(currentW) }} × {{ Math.round(currentH) }}</div>
            <div class="info-sub">({{ widthPercentage }}% × {{ heightPercentage }}%)</div>
          </div>

          <div class="info-divider"></div>

          <div class="info-item">
            <div class="info-label">位置 (X, Y)</div>
            <div class="info-value">{{ Math.round(currentX) }} , {{ Math.round(currentY) }}</div>
          </div>

          <div class="info-divider"></div>

          <div class="info-item">
            <div class="info-label">可用空間</div>
            <div class="info-value">{{ availableWidth }} × {{ availableHeight }}</div>
          </div>

          <div class="info-divider"></div>

          <div class="info-item">
            <div class="info-label">實際畫面（用於定位邊界）</div>
            <div class="info-sub">
              視窗：{{ viewportWidth }} × {{ viewportHeight }}<br />
              Header：{{ headerHeight }}px，Sidebar：{{ sidebarWidth }}px，Footer：{{ footerHeight }}px<br />
              Padding：L{{ contentPadding.left }} / R{{ contentPadding.right }} / T{{ contentPadding.top }} / B{{ contentPadding.bottom }}
            </div>
          </div>

          <div class="info-divider"></div>

          <div class="info-item">
            <div class="info-label">介面背景（輔助定位）</div>
            <div class="info-sub">
              <a-button size="small" :loading="isCapturing" @click="captureBackground">
                重新擷取背景
              </a-button>
              <div v-if="backgroundCapturedAt" class="info-sub" style="margin-top: 6px;">
                上次擷取：{{ backgroundCapturedAt }}
              </div>
              <div v-else class="info-sub" style="margin-top: 6px;">
                尚未擷取（將自動擷取一次）
              </div>
            </div>
          </div>

          <div class="info-divider"></div>

          <div class="info-item">
            <div class="info-label">顯示模式</div>
            <div class="info-value text-primary">{{ displayModeText }}</div>
          </div>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { LayoutMeasurer } from '@/utils/layout-measurer';
import { SizeCalculator } from '@/utils/size-calculator';
import { normalizeOcoguiViewerUrl } from '@/utils/ocogui';
import html2canvas from 'html2canvas';
import VueDraggableResizable from 'vue-draggable-resizable-vue3';
// 需引入樣式
import 'vue-draggable-resizable-vue3/src/style.less';

export default defineComponent({
  name: 'PreviewPanel',
  components: {
    VueDraggableResizable
  },
  props: {
    url: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      required: true
    },
    designResolution: {
      type: Object,
      default: () => ({ width: 1920, height: 1080 })
    }
  },
  emits: ['update-config'],
  setup(props, { emit }) {
    const previewContainer = ref(null);
    const measurements = ref(null);
    const measurer = ref(null);
    const calculator = new SizeCalculator();
    const previewBox = ref({ width: 0, height: 0 });
    const backgroundDataUrl = ref('');
    const backgroundCapturedAt = ref('');
    const isCapturing = ref(false);
    const infoOpen = ref(false);
    const isAlive = ref(true);

    // 拖曳相關狀態
    const showDraggable = ref(true);
    const currentX = ref(0);
    const currentY = ref(0);
    const currentW = ref(100);
    const currentH = ref(100);
    
    // 防止循環更新的標記
    const isUpdatingFromDrag = ref(false);
    const lastExternalConfig = ref({ marginLeft: 0, marginTop: 0 });

    // 測量佈局
    const measureLayout = () => {
      if (!measurer.value) {
        measurer.value = new LayoutMeasurer();
      }
      const measured = measurer.value.measure();
      measurements.value = measured;

      // 量測預覽容器實際尺寸，避免縮放比例寫死導致「上面留很大空白」
      const el = previewContainer.value;
      if (el && el.getBoundingClientRect) {
        const rect = el.getBoundingClientRect();
        previewBox.value = {
          width: Math.max(0, rect.width),
          height: Math.max(0, rect.height),
        };
      }
      
      // 重新計算初始位置（首次載入時強制刷新）
      initPosition(true);
    };

    // 計算可用空間 (Viewport)
    const availableSpace = computed(() => {
      if (!measurements.value) return { width: 1920, height: 1080 };
      return calculator.calculateAvailableSpace(measurements.value);
    });

    const availableWidth = computed(() => Math.round(availableSpace.value.width));
    const availableHeight = computed(() => Math.round(availableSpace.value.height));

    const maxX = computed(() => Math.max(0, availableWidth.value - currentW.value));
    const maxY = computed(() => Math.max(0, availableHeight.value - currentH.value));

    // 計算預覽縮放比例
    const viewportWidth = computed(() => Math.round(measurements.value?.viewport?.width || 1920));
    const viewportHeight = computed(() => Math.round(measurements.value?.viewport?.height || 1080));
    const sidebarWidth = computed(() => Math.round(measurements.value?.sidebar?.width || 280));
    const headerHeight = computed(() => Math.round(measurements.value?.header?.height || 65));
    const footerHeight = computed(() => Math.round(measurements.value?.footer?.height || 0));
    const contentPadding = computed(() => measurements.value?.contentPadding || { top: 0, right: 0, bottom: 0, left: 0 });

    const screenScale = computed(() => {
      const containerW = Math.max(1, previewBox.value.width || 780);
      const containerH = Math.max(1, previewBox.value.height || 520);
      const vw = viewportWidth.value || 1920;
      const vh = viewportHeight.value || 1080;
      
      // 計算寬度和高度的縮放比例，取較小值以確保完整顯示（不被截斷）
      const scaleW = containerW / vw;
      const scaleH = containerH / vh;
      return Math.min(scaleW, scaleH);
    });

    const labelScale = computed(() => {
      const s = screenScale.value || 1;
      // 反向縮放：讓文字/標籤在縮小預覽中仍保持可讀
      return String(Math.min(3, Math.max(1, 1 / s)));
    });

    // 初始化位置與尺寸
    const initPosition = (forceRefresh = false) => {
      // 根據 config 初始化
      const avW = availableWidth.value || 1600;
      const avH = availableHeight.value || 900;
      
      // 1. 寬高 - 優先使用用戶儲存的 iframeWidth/iframeHeight
      let w, h;
      
      if (props.config.iframeWidth && props.config.iframeHeight) {
        // 使用用戶調整後儲存的尺寸
        w = props.config.iframeWidth;
        h = props.config.iframeHeight;
      } else {
        // 根據設計解析度和模式計算（並把高度模式/數值即時反映在預覽框）
        const designW = Number(props.designResolution.width) || 1920;
        const designH = Number(props.designResolution.height) || 1080;
        const designRatio = designW / designH;

        // 高度模式：px / vh(以可用高度為基準) / auto(=可用高度)
        const heightMode = props.config.iframeHeightMode || 'px';
        const heightValRaw = props.config.iframeHeightValue;
        const heightVal = Number.isFinite(Number(heightValRaw)) ? Number(heightValRaw) : 800;

        let desiredH = avH;
        if (heightMode === 'vh') {
          desiredH = (avH * Math.max(0, Math.min(100, heightVal))) / 100;
        } else if (heightMode === 'px') {
          desiredH = heightVal;
        } else {
          // auto
          desiredH = avH;
        }
        desiredH = Math.max(50, Math.min(avH, desiredH));

        const fit = props.config.iframeFit || 'contain-center';
        if (fit === 'stretch') {
          w = avW;
          h = desiredH;
        } else {
          // contain-center / none：保持比例，用「高度模式」驅動尺寸，必要時再夾住寬度
          h = desiredH;
          w = h * designRatio;
          if (w > avW) {
            const scale = avW / w;
            w = avW;
            h = h * scale;
          }
        }
      }
      
      // 確保尺寸不超過可用空間
      w = Math.min(w, avW);
      h = Math.min(h, avH);

      // 2. 位置 - 優先使用儲存的絕對位置
      let x, y;
      
      if (props.config.iframeX !== null && props.config.iframeX !== undefined &&
          props.config.iframeY !== null && props.config.iframeY !== undefined) {
        // 使用儲存的絕對位置
        x = props.config.iframeX;
        y = props.config.iframeY;
      } else {
        // 預設置中
        x = (avW - w) / 2;
        y = (avH - h) / 2;
        
        // 加上 margin 偏移（向後相容）
        const marginLeft = props.config.marginLeft || 0;
        const marginTop = props.config.marginTop || 0;
        x += marginLeft;
        y += marginTop;
      }

      // 3) 夾住範圍（避免一開始就跑出可用區）
      const maxXVal = Math.max(0, avW - w);
      const maxYVal = Math.max(0, avH - h);
      x = Math.max(0, Math.min(maxXVal, x));
      y = Math.max(0, Math.min(maxYVal, y));
      
      currentW.value = w;
      currentH.value = h;
      currentX.value = x;
      currentY.value = y;
      
      // 只在首次載入或強制刷新時重建元件
      if (forceRefresh) {
        showDraggable.value = false;
        nextTick(() => {
          showDraggable.value = true;
        });
      }
    };

    // 拖曳事件 - vue-draggable-resizable-vue3 傳入的是元件物件 (this)
    // 物件包含 left, top, width, height 等屬性
    const onDrag = (data) => {
      // data 是元件物件，包含 left, top 屬性
      const x = data?.left;
      const y = data?.top;
      
      if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) return;
      
      currentX.value = Math.max(0, Math.min(maxX.value, x));
      currentY.value = Math.max(0, Math.min(maxY.value, y));
      // 即時更新 - 拖曳中也同步到顯示設定
      updateConfig();
    };

    const onResize = (data) => {
      // data 是元件物件，包含 left, top, width, height 屬性
      const x = data?.left;
      const y = data?.top;
      const w = data?.width;
      const h = data?.height;
      
      if (typeof w !== 'number' || typeof h !== 'number' || isNaN(w) || isNaN(h)) return;
      
      const nextW = Math.max(50, Math.min(availableWidth.value, w));
      const nextH = Math.max(50, Math.min(availableHeight.value, h));
      const nextX = Math.max(0, Math.min(availableWidth.value - nextW, x || 0));
      const nextY = Math.max(0, Math.min(availableHeight.value - nextH, y || 0));

      currentW.value = nextW;
      currentH.value = nextH;
      currentX.value = nextX;
      currentY.value = nextY;
      // 即時更新 - 調整大小時也同步到顯示設定
      updateConfig();
    };

    const onDragStop = (data) => {
      // data 是元件物件
      const x = data?.left;
      const y = data?.top;
      
      if (typeof x !== 'number' || typeof y !== 'number' || isNaN(x) || isNaN(y)) return;
      
      currentX.value = Math.max(0, Math.min(maxX.value, x));
      currentY.value = Math.max(0, Math.min(maxY.value, y));
      updateConfig();
    };

    const onResizeStop = (data) => {
      // data 是元件物件
      const x = data?.left;
      const y = data?.top;
      const w = data?.width;
      const h = data?.height;
      
      if (typeof w !== 'number' || typeof h !== 'number' || isNaN(w) || isNaN(h)) return;
      
      currentX.value = Math.max(0, Math.min(maxX.value, x || 0));
      currentY.value = Math.max(0, Math.min(maxY.value, y || 0));
      currentW.value = Math.max(50, w);
      currentH.value = Math.max(50, h);
      updateConfig();
    };
    
    // 更新設定回 Index.vue
    const updateConfig = () => {
      // 設置標記，防止 watch 觸發循環更新
      isUpdatingFromDrag.value = true;
      
      // 儲存絕對位置（相對於可用區左上角）和尺寸
      const iframeX = Math.round(currentX.value);
      const iframeY = Math.round(currentY.value);
      const iframeWidth = Math.round(currentW.value);
      const iframeHeight = Math.round(currentH.value);
      
      // 同時計算相對於置中的偏移（向後相容）
      const centerX = (availableWidth.value - currentW.value) / 2;
      const centerY = (availableHeight.value - currentH.value) / 2;
      const marginLeft = Math.round(currentX.value - centerX);
      const marginTop = Math.round(currentY.value - centerY);
      
      // 設計時的可用空間（用於計算縮放比例）
      const designAvailableWidth = availableWidth.value;
      const designAvailableHeight = availableHeight.value;
      
      // 記錄當前發送的配置
      lastExternalConfig.value = { marginLeft, marginTop, iframeWidth, iframeHeight, iframeX, iframeY, designAvailableWidth, designAvailableHeight };
      
      emit('update-config', {
        marginLeft,
        marginTop,
        iframeWidth,
        iframeHeight,
        iframeX,  // 絕對位置 X
        iframeY,  // 絕對位置 Y
        designAvailableWidth,  // 設計時的可用寬度
        designAvailableHeight, // 設計時的可用高度
      });
      
      // 延遲重置標記
      nextTick(() => {
        isUpdatingFromDrag.value = false;
      });
    };

    // 外層用「縮放後尺寸」來做置中（避免視覺上偏上/偏下）
    const screenFrameOuterStyle = computed(() => {
      const vw = viewportWidth.value || 1920;
      const vh = viewportHeight.value || 1080;
      const scale = screenScale.value;
      
      // 計算縮放後的實際尺寸
      const scaledW = Math.round(vw * scale);
      const scaledH = Math.round(vh * scale);
      
      return {
        width: `${scaledW}px`,
        height: `${scaledH}px`,
        // 給 CSS pseudo-element 用：模糊背景（cover）
        '--bgImage': backgroundDataUrl.value ? `url(${backgroundDataUrl.value})` : 'none',
      };
    });

    // 內層維持真實尺寸，再用 transform scale 縮小（並塞入背景圖）
    const screenFrameInnerStyle = computed(() => {
      const base = {
        width: `${viewportWidth.value}px`,
        height: `${viewportHeight.value}px`,
        // 左上貼齊：避免因置中造成「上方空白」
        transform: `scale(${screenScale.value})`,
        transformOrigin: 'top left',
        // 反向縮放文字/標籤用
        '--labelScale': labelScale.value,
        position: 'absolute',
        top: '0',
        left: '0',
      };
      if (!backgroundDataUrl.value) return base;
      return {
        ...base,
        backgroundImage: `url(${backgroundDataUrl.value})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      };
    });

    const simHeaderStyle = computed(() => ({
      height: `${headerHeight.value}px`,
    }));

    const simFooterStyle = computed(() => ({
      height: `${footerHeight.value}px`,
    }));

    const simBodyStyle = computed(() => ({
      height: `${Math.max(0, viewportHeight.value - headerHeight.value - footerHeight.value)}px`,
    }));

    const simSidebarStyle = computed(() => ({
      width: `${sidebarWidth.value}px`,
    }));

    // simMain 的寬度 = 視窗寬度 - Sidebar 寬度（不扣 padding，因為 padding 會在 simPadding 處理）
    // 高度 = simBody 的高度（100%）
    const simMainStyle = computed(() => ({
      width: `${Math.max(0, viewportWidth.value - sidebarWidth.value)}px`,
      height: '100%',
      flexShrink: 0,
    }));

    const simPaddingStyle = computed(() => ({
      padding: `${contentPadding.value.top}px ${contentPadding.value.right}px ${contentPadding.value.bottom}px ${contentPadding.value.left}px`,
    }));

    // 紅框（可用顯示區）的尺寸 = availableWidth x availableHeight
    // 這個值應該等於 simMain 內部扣除 padding 後的空間
    const contentAreaStyle = computed(() => ({
      width: `${availableWidth.value}px`,
      height: `${availableHeight.value}px`,
      border: '2px dashed #ff4d4f',
      position: 'relative',
      // 這裡一定要透明，否則會把「實際網頁截圖背景」整個蓋掉，看起來像一大片空白
      background: 'rgba(255, 255, 255, 0.08)',
      overflow: 'hidden', // 清楚顯示邊界：拖曳/縮放不允許超出
      boxSizing: 'border-box',
    }));

    const widthPercentage = computed(() => {
      if (availableWidth.value === 0) return 0;
      return Math.round((currentW.value / availableWidth.value) * 100);
    });

    const heightPercentage = computed(() => {
      if (availableHeight.value === 0) return 0;
      return Math.round((currentH.value / availableHeight.value) * 100);
    });
    
    const displayModeText = computed(() => {
       return props.config.iframeFit || '自訂';
    });

    const buildIframeSrc = (rawUrl, fit) => {
      if (!rawUrl) return '';
      try {
        const normalized = normalizeOcoguiViewerUrl(rawUrl, window.location.origin);
        const u = new URL(normalized.url || rawUrl, window.location.href);
        if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
          u.hostname = window.location.hostname;
        }

        // 嵌入預覽專用：避免 OCOGUI 的 Service Worker/快取讓預覽一直吃到舊版 bundle
        // OCOGUI main.ts 內建 cacheClear=1 會自動 unregister SW + 清 caches
        u.searchParams.set("cacheClear", "1");

        const h = u.hash || "";
        if (h.startsWith("#/view")) {
          const parts = h.split("?", 2);
          const hashPath = parts[0];
          const hashQuery = parts.length > 1 ? parts[1] : "";
          const params = new URLSearchParams(hashQuery);
          params.set("embedFit", fit || "contain-center");
          // 提示這是嵌入預覽：供 OCOGUI（若有）做額外行為（例如隱藏工具列）
          params.set("embedPreview", "1");
          u.hash = `${hashPath}?${params.toString()}`;
        } else {
          u.searchParams.set("embedFit", fit || "contain-center");
          u.searchParams.set("embedPreview", "1");
        }
        return u.toString();
      } catch (_) {
        return rawUrl;
      }
    };

    const iframeSrc = computed(() => buildIframeSrc(props.url, props.config.iframeFit));

    // 監聽外部配置變化 (當使用者手動輸入數值時)
    watch(() => props.config, (newConfig) => {
      // 如果是拖曳觸發的更新，跳過
      if (isUpdatingFromDrag.value) return;
      
      // 檢查是否是外部變更（非拖曳產生的）
      const configMarginLeft = newConfig.marginLeft || 0;
      const configMarginTop = newConfig.marginTop || 0;
      const configIframeWidth = newConfig.iframeWidth || null;
      const configIframeHeight = newConfig.iframeHeight || null;
      const configIframeX = newConfig.iframeX; // 可以是 null
      const configIframeY = newConfig.iframeY; // 可以是 null
      
      // 只有當值與上次發送的不同時才更新（表示是使用者從左側輸入框修改的）
      const lastConfig = lastExternalConfig.value;
      if (configMarginLeft !== lastConfig.marginLeft || 
          configMarginTop !== lastConfig.marginTop ||
          configIframeWidth !== lastConfig.iframeWidth ||
          configIframeHeight !== lastConfig.iframeHeight ||
          configIframeX !== lastConfig.iframeX ||
          configIframeY !== lastConfig.iframeY) {
        lastExternalConfig.value = { 
          marginLeft: configMarginLeft, 
          marginTop: configMarginTop,
          iframeWidth: configIframeWidth,
          iframeHeight: configIframeHeight,
          iframeX: configIframeX,
          iframeY: configIframeY
        };
        initPosition();
      }
    }, { deep: true });
    
    // 監聽設計解析度變化
    watch(() => props.designResolution, () => {
      if (!isUpdatingFromDrag.value) {
        initPosition();
      }
    }, { deep: true });

    const captureBackground = async () => {
      // 抓整個 plc-frontend layout（Ant Modal 會 portal 到 body，不會被納入這個節點的截圖）
      const target =
        document.querySelector('.ant-layout.layout') ||
        document.querySelector('.ninjadash-main-layout') ||
        document.body;

      if (!target) return;

      try {
        isCapturing.value = true;

        // 避免截圖把當前的調整面板也畫進去：把 preview-panel 暫時隱藏
        /** @type {HTMLElement|null} */
        const panel = document.querySelector('.preview-panel');
        const prevVisibility = panel?.style.visibility;
        if (panel) panel.style.visibility = 'hidden';

        /** @type {HTMLElement} */
        const targetEl = target;
        const canvas = await html2canvas(targetEl, {
          backgroundColor: null,
          useCORS: true,
          allowTaint: true,
          logging: false,
          // 避免過大：視覺用途 1x 就好
          scale: 1,
        });

        if (panel) panel.style.visibility = prevVisibility || '';

        backgroundDataUrl.value = canvas.toDataURL('image/png');
        backgroundCapturedAt.value = new Date().toLocaleString('zh-TW', { hour12: false });
      } catch (e) {
        console.error('captureBackground failed:', e);
      } finally {
        isCapturing.value = false;
      }
    };

    onMounted(() => {
      isAlive.value = true;
      measureLayout();
      if (measurer.value) {
        measurer.value.onLayoutChange(() => {
          if (!isAlive.value) return;
          measureLayout();
        });
      }
      // 自動擷取一次，讓使用者立刻看到「真實介面」背景
      setTimeout(() => {
        if (!isAlive.value) return;
        captureBackground();
      }, 0);
    });

    onUnmounted(() => {
      isAlive.value = false;
      if (measurer.value) measurer.value.dispose();
    });

    return {
      previewContainer,
      screenFrameOuterStyle,
      screenFrameInnerStyle,
      simHeaderStyle,
      simBodyStyle,
      simSidebarStyle,
      simMainStyle,
      simPaddingStyle,
      simFooterStyle,
      contentAreaStyle,
      showDraggable,
      currentX,
      currentY,
      currentW,
      currentH,
      availableWidth,
      availableHeight,
      viewportWidth,
      viewportHeight,
      sidebarWidth,
      headerHeight,
      footerHeight,
      contentPadding,
      widthPercentage,
      heightPercentage,
      displayModeText,
      iframeSrc,
      onDrag,
      onResize,
      onDragStop,
      onResizeStop,
      captureBackground,
      isCapturing,
      backgroundCapturedAt,
      infoOpen,
    };
  }
});
</script>

<style scoped>
.preview-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.preview-body {
  display: flex;
  flex: 1;
  height: 100%;
  overflow: hidden;
}

.preview-container {
  flex: 1;
  position: relative;
  background: #f5f7fa;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  justify-content: stretch;
}

.info-trigger {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 30;
}

.screen-stage {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
}

.screen-frame {
  background: #fff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
}

/* 用「模糊 cover 背景」把剩餘空間填滿，避免使用者覺得右側被資訊面板擋住/或看到空白 */
.screen-frame::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: var(--bgImage);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(14px);
  transform: scale(1.06);
  opacity: 0.55;
  pointer-events: none;
}

.screen-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(245, 247, 250, 0.55);
  pointer-events: none;
}

.screen-frame-inner {
  /* 位置由 inline style 控制（50%/50% + translate） */
  z-index: 1;
}

.sim-header,
.sim-footer {
  background: transparent;
  border-bottom: 1px solid rgba(0,0,0,0.08);
  position: relative;
}

.sim-footer {
  border-top: 1px solid rgba(0,0,0,0.08);
  border-bottom: none;
}

.sim-body {
  display: flex;
  width: 100%;
}

.sim-sidebar {
  background: transparent;
  border-right: 1px solid rgba(0,0,0,0.08);
  position: relative;
}

.sim-main {
  background: transparent;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.sim-padding {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

/* 淡淡遮罩提示不可用區，但保留「實際網頁截圖」可見 */
.sim-header::after,
.sim-footer::after,
.sim-sidebar::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.03);
  pointer-events: none;
}

/* .sim-label 已移除 - 不再顯示固定區域的文字標籤 */

/* 覆寫 vue-draggable-resizable 樣式 */
:deep(.iframe-draggable) {
  background: #fff;
  border: 1px solid #d9d9d9;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* 確保在紅色框框之上 */
  z-index: 10; 
}

:deep(.vdr-handle) {
  background-color: #1890ff; /* 藍色控制點 */
  border: 1px solid #fff;
  width: 10px !important;
  height: 10px !important;
  border-radius: 50%;
}

.viewport-box {
  /* 覆寫：預覽會被 scale 縮小，控制點會變得很難點；用反向縮放把可點範圍撐回來 */
}

::deep(.vdr-handle) {
  width: 18px !important;
  height: 18px !important;
  transform: scale(var(--labelScale, 1));
  transform-origin: center center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
}

.marker-label {
  position: absolute;
  top: 8px;
  left: 8px;
  color: #ff4d4f;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  background: rgba(255, 255, 255, 0.8);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(255, 77, 79, 0.35);
  transform: scale(var(--labelScale, 1));
  transform-origin: top left;
}

.preview-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

.preview-content {
  text-align: center;
  color: #8c8c8c;
}

.preview-empty {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none; /* 防止文字選取干擾拖曳 */
}

.preview-iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
  background: #fff;
  pointer-events: none; /* 預設不可互動，避免拖曳/縮放時被 iframe 吃掉滑鼠事件 */
}

.preview-icon {
  font-size: 48px;
  margin-bottom: 8px;
  opacity: 0.5;
}

.preview-text {
  font-size: 14px;
  margin-bottom: 4px;
  font-weight: 500;
  color: #595959;
}

.preview-ratio {
  font-size: 12px;
  color: #bfbfbf;
  position: absolute;
  right: 8px;
  bottom: 6px;
  background: rgba(255, 255, 255, 0.85);
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  pointer-events: none;
  transform: scale(var(--labelScale, 1));
  transform-origin: bottom right;
}

.size-info {
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.size-info.in-drawer {
  padding: 0;
  background: transparent;
}

.info-header {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.info-item {
  margin-bottom: 16px;
}

.info-label {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  font-family: monospace;
  letter-spacing: 0.5px;
}

.info-sub {
  font-size: 12px;
  color: #1890ff;
  margin-top: 2px;
}

.info-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 16px 0;
}

.text-primary {
  color: #1890ff;
}

/* 最終覆寫（避免舊規則/typo 造成控制點太小或不生效） */
::deep(.vdr-handle) {
  width: 22px !important;
  height: 22px !important;
  transform: scale(var(--labelScale, 1));
  transform-origin: center center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.28);
}
</style>
