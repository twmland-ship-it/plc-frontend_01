# 技術限制約束 (Technical Constraints)

> **版本**：2.2.36
> **最後更新**：2025-09-28
> **適用範圍**：所有開發人員、第三方協作者、系統維護者

## 📋 目錄

- [UI/UX 限制](#uiux-限制)
- [技術架構限制](#技術架構限制)
- [效能限制](#效能限制)
- [安全限制](#安全限制)
- [相依性限制](#相依性限制)
- [瀏覽器限制](#瀏覽器限制)
- [資料處理限制](#資料處理限制)
- [部署限制](#部署限制)
- [測試限制](#測試限制)
- [違規處理](#違規處理)

## 🎨 UI/UX 限制

### 🚫 嚴格禁止事項

#### 視覺設計鎖定
```css
/* ❌ 禁止修改的項目 */
:root {
  /* 色彩系統 - 完全鎖定 */
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;

  /* 字型系統 - 完全鎖定 */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-base: 14px;
  --line-height-base: 1.5715;

  /* 間距系統 - 完全鎖定 */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;

  /* 圓角系統 - 完全鎖定 */
  --border-radius-base: 6px;
  --border-radius-sm: 4px;
  --border-radius-lg: 8px;
}
```

#### 版面配置鎖定
- **網格系統**：禁止修改 24 欄網格系統
- **響應式斷點**：禁止修改 xs/sm/md/lg/xl 斷點
- **元件間距**：禁止修改元件間的標準間距
- **頁面邊距**：禁止修改頁面容器的邊距設定

#### 互動設計鎖定
- **動畫時長**：禁止修改標準動畫時長 (0.3s)
- **緩動函數**：禁止修改 ease-in-out 緩動
- **懸停效果**：禁止修改按鈕懸停狀態
- **焦點樣式**：禁止修改表單元素焦點樣式

### ✅ 允許的例外情況

#### 圖表特殊調整
```javascript
// ✅ 允許：Doughnut 圖表厚度調整
const chartOptions = {
  cutout: '80%', // 允許調整厚度
  plugins: {
    centerDoughnut: {
      display: true,
      // 允許中心文字與白圈調整
    }
  }
}
```

#### 資料驅動的樣式
```vue
<!-- ✅ 允許：根據資料狀態改變樣式 -->
<div :class="{
  'status-normal': status === 'normal',
  'status-warning': status === 'warning',
  'status-error': status === 'error'
}">
```

### 📝 UI/UX 變更申請流程

1. **書面申請**：向專案負責人提交書面申請
2. **業務理由**：說明變更的業務必要性
3. **影響評估**：評估對整體設計系統的影響
4. **審核批准**：等待專案負責人書面批准
5. **實施記錄**：記錄變更內容和理由

## 🏗️ 技術架構限制

### 框架版本鎖定

#### Vue.js 生態系統
```json
{
  "vue": "^3.3.0",           // 不可降級到 Vue 2
  "vue-router": "^4.2.0",    // 必須使用 Vue Router 4
  "vuex": "^4.1.0"           // 必須使用 Vuex 4
}
```

#### 禁止的架構變更
- **❌ 禁止**：引入 Pinia 替代 Vuex
- **❌ 禁止**：使用 Vue 2 Composition API
- **❌ 禁止**：混用 Options API 和 Composition API
- **❌ 禁止**：引入其他狀態管理庫

### 圖表庫限制

#### Chart.js 使用約束
```javascript
// ✅ 正確：Chart.js 實例管理
let chartInstance = null

onMounted(() => {
  // 只在 onMounted 中初始化
  chartInstance = new Chart(ctx, config)
})

// ❌ 禁止：在 watchEffect 中重複建立
watchEffect(() => {
  // 禁止在這裡建立 Chart 實例
  new Chart(ctx, config) // ❌
})

// ✅ 正確：更新圖表
const updateChart = () => {
  if (chartInstance) {
    chartInstance.data = toPlain(newData)
    chartInstance.update('none') // 必須停用動畫
  }
}

// ✅ 正確：銷毀圖表
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.stop()    // 必須先停止
    chartInstance.destroy() // 再銷毀
  }
})
```

#### 圖表效能約束
```javascript
// ✅ 強制要求：關閉所有動畫
const chartOptions = {
  animation: false,           // 全域動畫關閉
  animations: {
    colors: false,
    x: false,
    y: false
  },
  transitions: {
    active: {
      animation: {
        duration: 0           // 互動動畫關閉
      }
    }
  }
}
```

## ⚡ 效能限制

### 記憶體使用限制

#### 圖表記憶體管理
```javascript
// ✅ 強制要求：防止記憶體洩漏
class ChartManager {
  constructor() {
    this.charts = new Map()
  }

  createChart(id, config) {
    // 銷毀舊圖表
    this.destroyChart(id)

    const chart = new Chart(ctx, config)
    this.charts.set(id, chart)
    return chart
  }

  destroyChart(id) {
    const chart = this.charts.get(id)
    if (chart) {
      chart.stop()
      chart.destroy()
      this.charts.delete(id)
    }
  }

  destroyAll() {
    this.charts.forEach(chart => {
      chart.stop()
      chart.destroy()
    })
    this.charts.clear()
  }
}
```

#### 資料處理限制
```javascript
// ✅ 強制要求：大資料集分頁處理
const MAX_CHART_POINTS = 1000 // 圖表最大資料點數
const MAX_TABLE_ROWS = 100    // 表格最大顯示行數

// ❌ 禁止：一次性載入大量資料
const loadAllData = async () => {
  // 禁止載入超過限制的資料量
}

// ✅ 正確：分頁載入
const loadDataByPage = async (page, size = 100) => {
  if (size > MAX_TABLE_ROWS) {
    throw new Error(`Page size cannot exceed ${MAX_TABLE_ROWS}`)
  }
  // 分頁載入邏輯
}
```

### CPU 使用限制

#### 計算密集操作約束
```javascript
// ✅ 強制要求：使用 Web Worker 處理大量計算
const processLargeDataset = async (data) => {
  if (data.length > 10000) {
    // 必須使用 Web Worker
    return new Promise((resolve) => {
      const worker = new Worker('/workers/data-processor.js')
      worker.postMessage(data)
      worker.onmessage = (e) => {
        resolve(e.data)
        worker.terminate()
      }
    })
  }
  // 小資料集可直接處理
  return processData(data)
}

// ❌ 禁止：主執行緒阻塞操作
const heavyCalculation = (data) => {
  // 禁止在主執行緒進行大量計算
  for (let i = 0; i < 1000000; i++) {
    // 大量計算邏輯
  }
}
```

## 🔒 安全限制

### 資料安全約束

#### 敏感資訊處理
```javascript
// ❌ 嚴格禁止：硬編碼敏感資訊
const API_KEY = 'sk-1234567890abcdef' // ❌
const DATABASE_URL = 'mongodb://user:pass@host' // ❌

// ✅ 強制要求：使用環境變數
const API_KEY = process.env.VUE_APP_API_KEY
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL

// ✅ 強制要求：輸入驗證
const sanitizeInput = (input) => {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}
```

#### API 安全約束
```javascript
// ✅ 強制要求：請求超時設定
const apiClient = axios.create({
  timeout: 30000,           // 30 秒超時
  withCredentials: true,    // 包含認證資訊
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// ✅ 強制要求：錯誤處理
apiClient.interceptors.response.use(
  response => response,
  error => {
    // 不可洩漏詳細錯誤資訊到前端
    console.error('API Error:', error)
    return Promise.reject(new Error('請求失敗，請稍後再試'))
  }
)
```

## 📦 相依性限制

### 套件管理約束

#### 禁止的套件類型
```json
{
  // ❌ 禁止：實驗性套件
  "experimental-package": "*",

  // ❌ 禁止：未維護套件 (超過 1 年無更新)
  "abandoned-package": "*",

  // ❌ 禁止：安全漏洞套件
  "vulnerable-package": "*",

  // ❌ 禁止：重複功能套件
  "moment": "*"  // 已有 dayjs
}
```

#### 新增套件審核流程
1. **必要性評估**：確認現有套件無法滿足需求
2. **安全性檢查**：檢查套件安全漏洞
3. **維護狀態**：確認套件活躍維護
4. **授權相容**：確認授權與專案相容
5. **大小影響**：評估對打包大小的影響

### 版本鎖定策略
```json
{
  // ✅ 核心套件：鎖定主版本
  "vue": "3.3.4",
  "vue-router": "4.2.4",

  // ✅ 工具套件：允許次版本更新
  "lodash-es": "^4.17.21",
  "dayjs": "^1.11.9",

  // ✅ 開發工具：允許修訂版本更新
  "eslint": "~8.44.0",
  "prettier": "~2.8.8"
}
```

## 🌐 瀏覽器限制

### 相容性約束

#### 不支援的瀏覽器
```javascript
// ❌ 明確不支援
const UNSUPPORTED_BROWSERS = [
  'Internet Explorer',      // 所有版本
  'Chrome < 90',           // 舊版 Chrome
  'Firefox < 88',          // 舊版 Firefox
  'Safari < 14',           // 舊版 Safari
  'Edge < 90'              // 舊版 Edge
]

// ✅ 瀏覽器檢測與警告
const detectUnsupportedBrowser = () => {
  const userAgent = navigator.userAgent
  if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    alert('不支援 Internet Explorer，請使用現代瀏覽器')
    return false
  }
  return true
}
```

#### 功能降級策略
```javascript
// ✅ 漸進式增強
const features = {
  webgl: !!window.WebGLRenderingContext,
  webworker: !!window.Worker,
  websocket: !!window.WebSocket,
  localstorage: !!window.localStorage
}

// 根據功能可用性調整行為
if (!features.webgl) {
  // 降級到 Canvas 2D 渲染
}

if (!features.webworker) {
  // 降級到主執行緒處理
}
```

## 📊 資料處理限制

### 資料量限制

#### 圖表資料約束
```javascript
// ✅ 強制限制
const CHART_LIMITS = {
  MAX_DATA_POINTS: 1000,    // 最大資料點數
  MAX_SERIES: 10,           // 最大數據系列數
  MAX_CATEGORIES: 50,       // 最大分類數
  UPDATE_INTERVAL: 1000     // 最小更新間隔 (ms)
}

// ✅ 資料驗證
const validateChartData = (data) => {
  if (data.datasets.length > CHART_LIMITS.MAX_SERIES) {
    throw new Error(`數據系列數不可超過 ${CHART_LIMITS.MAX_SERIES}`)
  }

  data.datasets.forEach(dataset => {
    if (dataset.data.length > CHART_LIMITS.MAX_DATA_POINTS) {
      throw new Error(`資料點數不可超過 ${CHART_LIMITS.MAX_DATA_POINTS}`)
    }
  })
}
```

#### 表格資料約束
```javascript
// ✅ 分頁強制要求
const TABLE_LIMITS = {
  MAX_PAGE_SIZE: 100,       // 最大每頁筆數
  DEFAULT_PAGE_SIZE: 20,    // 預設每頁筆數
  MAX_TOTAL_ROWS: 10000     // 最大總筆數
}

// ❌ 禁止：無限滾動載入大量資料
// ✅ 正確：分頁載入
```

### 即時資料約束

#### WebSocket 連線限制
```javascript
// ✅ 連線管理
class WebSocketManager {
  constructor() {
    this.connections = new Map()
    this.maxConnections = 5  // 最大連線數
  }

  connect(url, options = {}) {
    if (this.connections.size >= this.maxConnections) {
      throw new Error('超過最大連線數限制')
    }

    const ws = new WebSocket(url)
    this.connections.set(url, ws)

    // 強制設定心跳檢測
    this.setupHeartbeat(ws, options.heartbeatInterval || 30000)

    return ws
  }

  setupHeartbeat(ws, interval) {
    const heartbeat = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'ping' }))
      } else {
        clearInterval(heartbeat)
      }
    }, interval)
  }
}
```

## 🚀 部署限制

### 建置約束

#### 打包大小限制
```javascript
// webpack.config.js
module.exports = {
  performance: {
    maxAssetSize: 2000000,    // 2MB 單檔案限制
    maxEntrypointSize: 5000000, // 5MB 入口點限制
    hints: 'error'            // 超過限制時報錯
  }
}
```

#### 環境變數約束
```bash
# ✅ 必要環境變數
VUE_APP_API_BASE_URL=        # API 基礎 URL
VUE_APP_GOOGLE_MAPS_API_KEY= # Google Maps API 金鑰
VUE_APP_VERSION=             # 應用程式版本

# ❌ 禁止：在環境變數中存放敏感資訊
VUE_APP_DATABASE_PASSWORD=   # ❌ 禁止
VUE_APP_SECRET_KEY=          # ❌ 禁止
```

### 伺服器約束

#### 靜態資源服務
```nginx
# nginx.conf 必要設定
server {
    # 強制 HTTPS
    listen 443 ssl http2;

    # 安全標頭
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";

    # 快取策略
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支援
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🧪 測試限制

### 測試覆蓋率要求

#### 強制覆蓋率標準
```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,      // 分支覆蓋率 ≥ 80%
      functions: 80,     // 函數覆蓋率 ≥ 80%
      lines: 80,         // 行覆蓋率 ≥ 80%
      statements: 80     // 語句覆蓋率 ≥ 80%
    },
    // 核心模組要求更高覆蓋率
    './src/core/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
}
```

#### 測試類型要求
```javascript
// ✅ 必要測試類型
describe('Component Tests', () => {
  // 單元測試：必須
  it('should render correctly', () => {})

  // 整合測試：核心功能必須
  it('should integrate with API', () => {})

  // 快照測試：UI 元件必須
  it('should match snapshot', () => {})
})

// ❌ 禁止：跳過測試
it.skip('should test something', () => {}) // ❌

// ❌ 禁止：空測試
it('should test something', () => {}) // ❌
```

## ⚠️ 違規處理

### 違規等級分類

#### 嚴重違規 (Level 1)
- 修改 UI/UX 設計系統
- 引入安全漏洞
- 破壞效能要求
- 違反架構約束

**處理方式**：立即回退，強制修正

#### 一般違規 (Level 2)
- 未遵循程式碼規範
- 測試覆蓋率不足
- 文檔未同步更新

**處理方式**：要求修正後合併

#### 輕微違規 (Level 3)
- 命名不規範
- 註解不完整
- 格式問題

**處理方式**：提醒改進

### 違規檢測機制

#### 自動化檢測
```yaml
# .github/workflows/constraints-check.yml
name: Constraints Check
on: [push, pull_request]

jobs:
  check-constraints:
    runs-on: ubuntu-latest
    steps:
      - name: Check UI/UX Changes
        run: |
          # 檢測 CSS 變更
          git diff --name-only | grep -E '\.(css|scss|less)$' | xargs grep -l 'color\|font\|margin\|padding' && exit 1 || true

      - name: Check Performance
        run: |
          npm run build
          npm run analyze
          # 檢查打包大小

      - name: Security Scan
        run: |
          npm audit --audit-level high
```

#### 人工審查清單
- [ ] UI/UX 變更是否經過批准
- [ ] 新增套件是否必要
- [ ] 效能影響是否可接受
- [ ] 安全風險是否已評估
- [ ] 測試覆蓋率是否達標

---

> **重要提醒**：這些限制是為了確保系統穩定性、安全性和可維護性。所有開發人員都必須嚴格遵守，任何例外情況都需要經過正式審批流程。

**維護者**：OCO 開發團隊
**聯絡方式**：support@ococomtw.com
**緊急聯絡**：在發現嚴重違規時，請立即聯絡專案負責人

