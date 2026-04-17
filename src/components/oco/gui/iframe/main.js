import { defineComponent, computed, ref, onMounted, onUnmounted } from "vue";
import { useStore } from "vuex";
import {
  getDefaultOcoguiServerUrl,
  normalizeOcoguiViewerUrl,
} from "@/utils/ocogui";
import { LayoutMeasurer } from "@/utils/layout-measurer";
import { SizeCalculator } from "@/utils/size-calculator";
import { announceToScreenReader } from "@/utils/accessibility";
import ErrorBoundary from "./ErrorBoundary.vue";

export default defineComponent({
  components: {
    ErrorBoundary
  },
  setup() {
    const { state } = useStore();

    // 以 component 自身的容器尺寸作為「真實可用空間」來源
    const wrapperEl = ref(null);
    const wrapperSize = ref({ width: 0, height: 0 });
    let wrapperResizeObs = null;

    const measureWrapper = () => {
      try {
        const el = wrapperEl.value;
        if (!el || typeof el.getBoundingClientRect !== 'function') return;
        const r = el.getBoundingClientRect();
        const w = Number(r?.width) || 0;
        const h = Number(r?.height) || 0;
        if (w > 0 && h > 0) {
          wrapperSize.value = { width: w, height: h };
        }
      } catch {
        // ignore
      }
    };

    // 解析儲存的設定
    const config = computed(() => {
      const defaults = {
        embedMode: "iframe",
        url: null,
        serverUrl: getDefaultOcoguiServerUrl(),
        iframeFit: "stretch",
        iframeHeightMode: "auto",
        iframeHeightValue: 800,
        // 設計時的可用空間（用於計算縮放比例）
        designAvailableWidth: null,
        designAvailableHeight: null,
        // iframe 絕對位置和尺寸（設計器拖曳設定的）
        iframeX: null,
        iframeY: null,
        iframeWidth: null,
        iframeHeight: null,
      };

      const raw = state.gui.guiDetail?.DataContentJson || null;
      if (!raw) return defaults;

      try {
        const parsed = JSON.parse(raw);
        const iframe = parsed.iframe || {};
        
        const normalizedViewer = normalizeOcoguiViewerUrl(
          parsed.url || parsed.ocoguiViewUrl || defaults.url,
          parsed.serverUrl || defaults.serverUrl
        );

        return {
          ...defaults,
          embedMode: "iframe",
          url: normalizedViewer.url || defaults.url,
          serverUrl: normalizedViewer.serverUrl || defaults.serverUrl,
          iframeFit: parsed.iframeFit || iframe.fit || defaults.iframeFit,
          iframeHeightMode: parsed.iframeHeightMode || iframe.heightMode || defaults.iframeHeightMode,
          iframeHeightValue: parsed.iframeHeightValue || iframe.heightValue || defaults.iframeHeightValue,
          // 設計時的可用空間
          designAvailableWidth: iframe.designAvailableWidth || null,
          designAvailableHeight: iframe.designAvailableHeight || null,
          // iframe 絕對位置和尺寸
          iframeX: iframe.iframeX ?? null,
          iframeY: iframe.iframeY ?? null,
          iframeWidth: iframe.iframeWidth ?? null,
          iframeHeight: iframe.iframeHeight ?? null,
        };
      } catch {
        const normalizedViewer = normalizeOcoguiViewerUrl(raw, defaults.serverUrl);
        return {
          ...defaults,
          url: normalizedViewer.url || raw,
          serverUrl: normalizedViewer.serverUrl || defaults.serverUrl,
        };
      }
    });

    // 佈局測量
    const layoutMeasurer = new LayoutMeasurer();
    const _sizeCalculator = new SizeCalculator();
    const measurements = ref(null);

    // 內網優化：localhost/127.0.0.1 改寫成目前主機名稱
    const link = computed(() => {
      const raw = config.value.url;
      const fit = config.value.iframeFit;
      // console.log('[iframe] config.value.url:', raw);
      // console.log('[iframe] full config:', JSON.stringify(config.value));
      if (!raw) return null;
      try {
        const u = new URL(raw, window.location.href);
        if (u.hostname === "localhost" || u.hostname === "127.0.0.1") {
          u.hostname = window.location.hostname;
        }
        // 🎯 根據 plc-frontend 的縮放模式，決定傳給 OCOGUI 的 embedFit
        // - stretch: plc-frontend 計算 iframe 填滿可用空間，OCOGUI 填滿 iframe → 傳 stretch
        // - contain-center: plc-frontend 計算 iframe 填滿可用空間，OCOGUI 等比置中 → 傳 contain-center
        // - none: plc-frontend 保持設計尺寸，OCOGUI 保持原尺寸 → 傳 none
        let ocoguiEmbedFit = "stretch";
        if (fit === "contain-center") {
          ocoguiEmbedFit = "contain-center";
        } else if (fit === "none") {
          ocoguiEmbedFit = "none";
        }
        
        const h = u.hash || "";
        if (h.startsWith("#/view")) {
          const parts = h.split("?", 2);
          const hashPath = parts[0];
          const hashQuery = parts.length > 1 ? parts[1] : "";
          const params = new URLSearchParams(hashQuery);
          params.set("embedFit", ocoguiEmbedFit);
          u.hash = `${hashPath}?${params.toString()}`;
        } else {
          u.searchParams.set("embedFit", ocoguiEmbedFit);
        }
        const result = u.toString();
        // console.log('[iframe] computed link:', result, 'embedFit:', ocoguiEmbedFit);
        return result;
      } catch (e) {
        console.error('[iframe] URL parse error:', e);
        return raw;
      }
    });

    // 同源時，移除 iframe 內頁預設外距
    const ifr = ref(null);
    const loadError = ref(false);
    const errorMessage = ref('');

    const resetMargins = () => {
      try {
        const d = ifr.value?.contentDocument || ifr.value?.contentWindow?.document;
        if (!d) return;
        if (d.documentElement) {
          d.documentElement.style.margin = "0";
          d.documentElement.style.padding = "0";
        }
        if (d.body) {
          d.body.style.margin = "0";
          d.body.style.padding = "0";
        }
      } catch (_) {
        // 跨網域時無法存取
      }
    };

    const handleIframeError = (event) => {
      loadError.value = true;
      errorMessage.value = '載入失敗，請檢查網址和網路連線';
      console.error('Iframe load error:', event);
      announceToScreenReader('iframe 內容載入失敗', 'assertive');
    };

    const retryLoad = () => {
      loadError.value = false;
      errorMessage.value = '';
      if (ifr.value) {
        ifr.value.src = link.value;
      }
      announceToScreenReader('正在重新載入 iframe 內容', 'polite');
    };

    // 生命週期
    onMounted(() => {
      measurements.value = layoutMeasurer.measure();
      measureWrapper();
      setTimeout(measureWrapper, 0);

      if (typeof ResizeObserver !== 'undefined') {
        try {
          wrapperResizeObs = new ResizeObserver(() => {
            measureWrapper();
          });
          if (wrapperEl.value) wrapperResizeObs.observe(wrapperEl.value);
        } catch {
          window.addEventListener('resize', measureWrapper);
        }
      } else {
        window.addEventListener('resize', measureWrapper);
      }

      layoutMeasurer.onLayoutChange((newMeasurements) => {
        measurements.value = newMeasurements;
        measureWrapper();
      });
    });

    onUnmounted(() => {
      layoutMeasurer.dispose();
      try {
        if (wrapperResizeObs) wrapperResizeObs.disconnect();
      } catch (_e) {
        // ignore
      }
      wrapperResizeObs = null;
      try {
        window.removeEventListener('resize', measureWrapper);
      } catch (_e) {
        // ignore
      }
    });

    // ============================================================
    // 🎯 核心邏輯：設計器設定的位置大小 → 實際顯示
    // 
    // 設計器設定的是「iframe 在可用區內的絕對位置和大小」
    // 例如：iframeX=0, iframeY=0, iframeWidth=1424, iframeHeight=692
    // 
    // 實際顯示時，需要根據「當前可用空間」與「設計時可用空間」的比例
    // 來縮放 iframe 的位置和大小，保持相對位置一致。
    // ============================================================

    // 取得當前可用空間（延伸到視窗底部，不扣除 footer/警報按鈕）
    const currentAvailableSpace = computed(() => {
      // 優先使用 wrapper 量測的尺寸
      const hasWrapper = wrapperSize.value?.width > 0 && wrapperSize.value?.height > 0;
      if (hasWrapper) {
        return {
          width: wrapperSize.value.width,
          height: wrapperSize.value.height,
        };
      }
      
      // fallback：使用視窗尺寸減去 header 和 sidebar
      if (measurements.value) {
        const viewportW = measurements.value.viewport?.width || window.innerWidth;
        const viewportH = measurements.value.viewport?.height || window.innerHeight;
        const sidebarW = measurements.value.sidebar?.width || 0;
        const headerH = measurements.value.header?.height || 65;
        const paddingL = measurements.value.contentPadding?.left || 0;
        const paddingR = measurements.value.contentPadding?.right || 0;
        
        // 不扣除 footer 高度，讓 iframe 延伸到底部
        return {
          width: Math.max(0, viewportW - sidebarW - paddingL - paddingR),
          height: Math.max(0, viewportH - headerH),
        };
      }
      
      return { width: 1920, height: 1080 };
    });

    // 計算縮放比例（用於非 stretch 模式）
    const _scaleRatio = computed(() => {
      const cfg = config.value;
      const currentW = currentAvailableSpace.value.width;
      const currentH = currentAvailableSpace.value.height;
      
      // 如果沒有設計時的可用空間，使用 1:1
      const designW = cfg.designAvailableWidth || currentW;
      const designH = cfg.designAvailableHeight || currentH;
      
      // 計算縮放比例（等比例縮放，取較小值避免超出）
      const scaleX = currentW / designW;
      const scaleY = currentH / designH;
      
      // 根據顯示模式決定縮放策略
      if (cfg.iframeFit === "stretch") {
        // 拉伸：分別縮放 X 和 Y
        return { x: scaleX, y: scaleY };
      }
      
      // contain-center 或 none：等比例縮放
      const scale = Math.min(scaleX, scaleY);
      return { x: scale, y: scale };
    });

    // wrapper 樣式：填滿可用空間（延伸到視窗底部）
    const wrapperStyle = computed(() => {
      // 計算 header 高度
      const headerH = measurements.value?.header?.height || 65;
      
      // 使用視窗高度減去 header 高度，讓 iframe 延伸到底部
      // 不扣除「警報/展開」按鈕的高度，因為它是浮動在上層的
      const fullHeight = window.innerHeight - headerH;
      
      return {
        width: '100%',
        height: `${fullHeight}px`,
        minHeight: `${fullHeight}px`,
      };
    });

    // canvas outer 樣式：填滿 wrapper
    const canvasOuterStyle = computed(() => {
      return {
        width: '100%',
        height: '100%',
        position: 'relative',
      };
    });

    // canvas inner 樣式：不需要額外縮放
    const canvasScaledInnerStyle = computed(() => {
      return {
        width: '100%',
        height: '100%',
        position: 'relative',
      };
    });

    // iframe 樣式：使用設計器設定的位置和大小，並根據可用空間比例縮放
    const iframeStyle = computed(() => {
      const cfg = config.value;
      const currentW = currentAvailableSpace.value.width;
      const currentH = currentAvailableSpace.value.height;
      
      // console.log('[iframe] iframeStyle - currentW:', currentW, 'currentH:', currentH);
      // console.log('[iframe] iframeStyle - cfg.iframeFit:', cfg.iframeFit);
      
      // 🎯 使用設計器設定的尺寸位置，但根據可用空間比例縮放
      // stretch/contain-center/none 只影響 OCOGUI 內部內容的縮放
      if (cfg.iframeWidth && cfg.iframeHeight) {
        const designX = cfg.iframeX ?? 0;
        const designY = cfg.iframeY ?? 0;
        const designW = cfg.iframeWidth;
        const designH = cfg.iframeHeight;
        
        // 取得設計時的可用空間（用於計算縮放比例）
        const designAvailW = cfg.designAvailableWidth || currentW;
        const designAvailH = cfg.designAvailableHeight || currentH;
        
        // 計算縮放比例
        const scaleX = currentW / designAvailW;
        const scaleY = currentH / designAvailH;
        
        // 根據比例縮放位置和尺寸
        const actualX = designX * scaleX;
        const actualY = designY * scaleY;
        const actualW = designW * scaleX;
        const actualH = designH * scaleY;
        
        // console.log('[iframe] Design settings - x:', designX, 'y:', designY, 'w:', designW, 'h:', designH);
        // console.log('[iframe] Design available - w:', designAvailW, 'h:', designAvailH);
        // console.log('[iframe] Scale - x:', scaleX.toFixed(3), 'y:', scaleY.toFixed(3));
        // console.log('[iframe] Actual position - x:', Math.round(actualX), 'y:', Math.round(actualY), 'w:', Math.round(actualW), 'h:', Math.round(actualH));
        
        // 保護：若量測異常導致尺寸為 0，回退為滿版避免白屏
        if (actualW <= 1 || actualH <= 1 || currentW <= 1 || currentH <= 1) {
          return {
            position: "absolute",
            left: "0",
            top: "0",
            width: "100%",
            height: "100%",
            display: "block",
            border: "none",
          };
        }

        return {
          position: "absolute",
          left: `${Math.round(actualX)}px`,
          top: `${Math.round(actualY)}px`,
          width: `${Math.round(actualW)}px`,
          height: `${Math.round(actualH)}px`,
          display: "block",
          border: "none",
        };
      }
      
      // 沒有設計器設定，使用預設的滿版顯示
      // console.log('[iframe] iframeStyle - no design settings, using 100%');
      return {
        position: "absolute",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        display: "block",
        border: "none",
      };
    });

    // 不再需要這個
    const iframeCssHeight = computed(() => "100%");

    return {
      wrapperEl,
      link,
      ifr,
      resetMargins,
      iframeCssHeight,
      iframeStyle,
      wrapperStyle,
      canvasOuterStyle,
      canvasScaledInnerStyle,
      loadError,
      errorMessage,
      handleIframeError,
      retryLoad,
    };
  },
});
