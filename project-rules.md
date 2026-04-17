# PLC Frontend 開發規則

> **版本**：2.2.36
> **最後更新**：2025-09-28
> **適用範圍**：所有開發人員、維護人員、第三方協作者

## 📋 目錄

- [基本原則](#基本原則)
- [技術規範](#技術規範)
- [程式碼規範](#程式碼規範)
- [元件開發規則](#元件開發規則)
- [圖表開發規則](#圖表開發規則)
- [API 開發規則](#api-開發規則)
- [測試規範](#測試規範)
- [版本控制規範](#版本控制規範)
- [部署規範](#部署規範)
- [安全規範](#安全規範)
- [效能規範](#效能規範)
- [文檔規範](#文檔規範)

## 🎯 基本原則

### 1. 開發理念
- **用戶體驗優先**：所有功能設計以用戶體驗為核心
- **穩定性第一**：確保系統穩定運行，避免破壞性變更
- **效能導向**：優化載入速度和運行效能
- **可維護性**：編寫清晰、可讀、可維護的程式碼
- **安全性**：遵循安全最佳實踐

### 2. 協作原則
- **程式碼審查**：所有程式碼變更必須經過審查
- **文檔同步**：程式碼變更必須同步更新相關文檔
- **測試覆蓋**：新功能必須包含相應測試
- **向後相容**：避免破壞現有功能的變更

## 🔧 技術規範

### 1. 核心技術棧
```javascript
// 必須使用的技術版本
{
  "node": "18.16.1",        // 嚴格要求
  "npm": "9.5.1",           // 嚴格要求
  "vue": "^3.x",            // Vue 3 + Composition API
  "vuex": "^4.x",           // 狀態管理
  "vue-router": "^4.x",     // 路由管理
  "ant-design-vue": "^3.x"  // UI 框架
}
```

### 2. 圖表技術
- **主要圖表庫**：Chart.js v3（含自訂 Plugin）
- **輔助圖表庫**：ApexCharts
- **地圖服務**：Google Maps API
- **圖表優化**：使用 optimized-apexchart.vue 包裝元件

### 3. 開發工具
- **IDE**：推薦 Visual Studio Code 或 Cursor
- **程式碼品質**：ESLint + Prettier
- **版本控制**：Git + GitHub
- **測試工具**：Cypress + Playwright

## 📝 程式碼規範

### 1. 基本風格
```javascript
// ✅ 正確：使用單引號
const message = 'Hello World'

// ❌ 錯誤：使用雙引號
const message = "Hello World"

// ✅ 正確：使用 const/let
const apiUrl = '/api/data'
let currentUser = null

// ❌ 錯誤：使用 var
var apiUrl = '/api/data'
```

### 2. 命名規範
```javascript
// 檔案命名：PascalCase
UserManagement.vue
DataTable.vue
ChartComponent.vue

// 元件名稱：PascalCase
<UserCard />
<DataChart />
<AlarmList />

// 變數命名：camelCase
const userName = 'admin'
const apiResponse = await fetchData()
const isLoading = false

// 常數命名：UPPER_SNAKE_CASE
const API_BASE_URL = '/api'
const MAX_RETRY_COUNT = 3
const DEFAULT_PAGE_SIZE = 20

// 函數命名：camelCase + 動詞開頭
function getUserData() { }
function validateInput() { }
function handleSubmit() { }
```

### 3. Vue 3 Composition API 規範
```vue
<template>
  <div class="component-wrapper">
    <!-- 模板內容 -->
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'ComponentName',

  props: {
    // 屬性定義，使用 TypeScript 風格
    userId: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },

  emits: ['update', 'delete'],

  setup(props, { emit }) {
    // 響應式資料
    const loading = ref(false)
    const data = ref(null)

    // 計算屬性
    const isValid = computed(() => {
      return data.value && data.value.length > 0
    })

    // 方法
    const fetchData = async () => {
      loading.value = true
      try {
        // API 呼叫
      } finally {
        loading.value = false
      }
    }

    // 生命週期
    onMounted(() => {
      fetchData()
    })

    return {
      loading,
      data,
      isValid,
      fetchData
    }
  }
})
</script>

<style scoped>
.component-wrapper {
  /* 樣式定義 */
}
</style>
```

## 🧩 元件開發規則

### 1. 元件結構
```
src/components/
├── oco/                    # OCO 專用元件
│   ├── alarm/             # 警報相關
│   ├── bill/              # 帳單相關
│   │   ├── fee/          # 電費計算
│   │   │   ├── lowVoltageNonTime/  # 低壓非時間電價
│   │   │   ├── highTwo/           # 高壓二段式
│   │   │   └── highThree/         # 高壓三段式
│   │   └── meter/        # 電錶管理
│   ├── form/              # 表單元件
│   ├── gui/               # GUI 相關
│   └── util/              # 工具元件
├── utilities/             # 通用工具元件
└── [feature]/             # 功能分類元件
```

### 2. 元件命名規則
- **檔案名稱**：使用 PascalCase
- **元件註冊**：使用 PascalCase
- **元件使用**：使用 kebab-case 或 PascalCase

### 3. 元件設計原則
```javascript
// ✅ 正確：單一職責
const UserCard = defineComponent({
  name: 'UserCard',
  // 只負責顯示用戶卡片
})

// ✅ 正確：可重用
const DataTable = defineComponent({
  name: 'DataTable',
  props: {
    columns: Array,
    data: Array,
    loading: Boolean
  }
})

// ❌ 錯誤：職責過多
const UserManagementPage = defineComponent({
  // 包含了用戶列表、編輯、刪除、權限管理等多個職責
})

// ✅ 正確：電費計算元件設計
const ElectricityRateSettings = defineComponent({
  name: 'ElectricityRateSettings',
  props: {
    rateType: {
      type: String,
      required: true,
      validator: (value) => ['lowVoltageNonTime', 'highTwo', 'highThree'].includes(value)
    }
  },
  setup(props) {
    // 夏月期間設定
    const summerPeriod = reactive({
      startMonth: 6,
      startDay: 1,
      endMonth: 9,
      endDay: 30
    })

    // 電價實施設定
    const electricityRate = reactive({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      temporaryMultiplier: 1
    })

    // 年份選項 (2020-2100)
    const yearOptions = computed(() => {
      return Array.from({ length: 81 }, (_, i) => 2020 + i)
    })

    // 月份選項 (1-12)
    const monthOptions = computed(() => {
      return Array.from({ length: 12 }, (_, i) => i + 1)
    })

    return {
      summerPeriod,
      electricityRate,
      yearOptions,
      monthOptions
    }
  }
})
```

## 📊 圖表開發規則

### 1. Chart.js 使用規範
```javascript
// ✅ 正確：在 onMounted 初始化圖表
onMounted(() => {
  const ctx = chartRef.value.getContext('2d')
  chart.value = new Chart(ctx, {
    type: 'doughnut',
    data: chartData.value,
    options: chartOptions.value
  })
})

// ❌ 錯誤：在 watchEffect 中重複建立實例
watchEffect(() => {
  // 不要在這裡建立 Chart 實例
  const chart = new Chart(ctx, config) // ❌
})

// ✅ 正確：更新圖表資料
const updateChart = () => {
  if (chart.value) {
    chart.value.data = toPlain(newData)
    chart.value.update('none') // 停用動畫避免殘留
  }
}

// ✅ 正確：銷毀圖表
onUnmounted(() => {
  if (chart.value) {
    chart.value.stop()    // 先停止動畫
    chart.value.destroy() // 再銷毀實例
  }
})
```

### 2. Doughnut 圖表規範
```javascript
// ✅ 正確：使用 centerDoughnut 插件
const chartOptions = {
  cutout: '80%', // 首頁 doughnut 預設厚度
  plugins: {
    centerDoughnut: {
      display: true
    }
  }
}

// ✅ 正確：中心文字設定
const chartData = {
  datasets: [{
    data: [30, 70],
    centerText: '100',        // 中心數字
    centerTextLabel: '總計'   // 中心標籤
  }]
}

// ❌ 錯誤：使用 DOM 疊字
// 不要用 position: absolute 在圖表上疊加文字
```

### 3. 圖表效能優化
```javascript
// ✅ 正確：轉換為純物件
const updateChartData = (newData) => {
  chart.value.data = toPlain(newData)
  chart.value.options = toPlain(newOptions)
  chart.value.update('none')
}

// ✅ 正確：使用防抖更新
import { debounce } from 'lodash-es'

const debouncedUpdate = debounce(() => {
  updateChart()
}, 300)
```

## 🌐 API 開發規則

### 1. API 呼叫規範
```javascript
// ✅ 正確：使用統一的 API 服務
import { apiService } from '@/config/dataService/dataService'

const fetchUserData = async (userId) => {
  try {
    const response = await apiService.get(`/api/users/${userId}`)
    return response.data
  } catch (error) {
    console.error('Failed to fetch user data:', error)
    throw error
  }
}

// ✅ 正確：錯誤處理
const handleApiError = (error) => {
  if (error.response) {
    // 伺服器回應錯誤
    const { status, data } = error.response
    switch (status) {
      case 401:
        // 未授權，重新導向登入
        router.push('/login')
        break
      case 403:
        // 權限不足
        message.error('權限不足')
        break
      case 500:
        // 伺服器錯誤
        message.error('伺服器錯誤，請稍後再試')
        break
      default:
        message.error(data.message || '請求失敗')
    }
  } else {
    // 網路錯誤
    message.error('網路連線錯誤')
  }
}
```

### 2. 資料格式規範
```javascript
// ✅ 正確：API 回應格式
{
  "Detail": {
    // 實際資料
  },
  "Success": true,
  "Message": "操作成功"
}

// ✅ 正確：分頁資料格式
{
  "Detail": {
    "Items": [...],
    "TotalCount": 100,
    "PageCount": 10,
    "CurrentPage": 1,
    "PageSize": 10
  }
}
```

### 3. 快取策略
```javascript
// ✅ 正確：使用防快取參數
const fetchData = async () => {
  const timestamp = Date.now()
  const response = await apiService.get(`/api/data?_t=${timestamp}`)
  return response.data
}

// ✅ 正確：本地快取
const cache = new Map()

const getCachedData = async (key) => {
  if (cache.has(key)) {
    return cache.get(key)
  }

  const data = await fetchData(key)
  cache.set(key, data)
  return data
}
```

### 4. 可靠度分析 API 特殊規範

#### 4.1 API 路徑規範
```javascript
// ✅ 正確：必須使用 /api/ 前綴
const getReliabilityAnalysis = async () => {
  return await DataService.get('/api/ReliabilityAnalysis/GetReliabilityAnalysList')
}

const resetOperatingHour = async (tagId) => {
  return await DataService.post('/api/System/ResetOperationgHour', { TagId: tagId })
}

// ❌ 錯誤：缺少 /api/ 前綴會導致404錯誤
const getReliabilityAnalysis = async () => {
  return await DataService.get('/ReliabilityAnalysis/GetReliabilityAnalysList') // 404錯誤
}
```

#### 4.2 權限檢查規範
```javascript
// ✅ 正確：使用權限檢查
import { usePermission } from '@/composable/permission'

const { permission } = usePermission('alarm-reliability-analysis')

// 讀取權限檢查
if (permission.read) {
  // 顯示可靠度分析數據
}

// 更新權限檢查
if (permission.update) {
  // 顯示重置按鈕
}
```

#### 4.3 錯誤處理規範
```javascript
// ✅ 正確：統一的錯誤處理
const loadReliabilityAnalysis = async () => {
  try {
    await dispatch('alarm/getReliabilityAnalysis')
  } catch (err) {
    Modal.error({
      title: '載入失敗',
      content: err.message || '獲取可靠度分析數據失敗'
    })
  }
}

// ✅ 正確：重置操作確認
const resetDevice = async (record) => {
  Modal.confirm({
    title: '確認重置',
    content: `確定要重置設備「${record.Description}」嗎？`,
    okText: '確認',
    cancelText: '取消',
    onOk: async () => {
      // 執行重置邏輯
    }
  })
}
```

## 🧪 測試規範

### 1. 測試分類
```javascript
// 單元測試：測試個別函數或元件
describe('UserCard Component', () => {
  it('should render user name correctly', () => {
    // 測試邏輯
  })
})

// 整合測試：測試元件間互動
describe('User Management Integration', () => {
  it('should update user list after deletion', () => {
    // 測試邏輯
  })
})

// E2E 測試：測試完整使用者流程
describe('User Login Flow', () => {
  it('should login and redirect to dashboard', () => {
    // 測試邏輯
  })
})
```

### 2. 測試覆蓋率要求
- **新功能**：測試覆蓋率 ≥ 80%
- **核心功能**：測試覆蓋率 ≥ 90%
- **工具函數**：測試覆蓋率 = 100%

### 3. 測試命名規範
```javascript
// ✅ 正確：描述性測試名稱
it('should display error message when API call fails', () => {})
it('should disable submit button when form is invalid', () => {})
it('should update chart data when props change', () => {})

// ❌ 錯誤：模糊的測試名稱
it('should work', () => {})
it('test function', () => {})
```

## 📋 版本控制規範

### 1. Git 分支策略
```bash
# 主分支
main/master          # 生產環境程式碼
develop             # 開發環境程式碼

# 功能分支
feature/user-management    # 新功能開發
feature/chart-optimization # 圖表優化

# 修復分支
hotfix/login-bug          # 緊急修復
bugfix/chart-memory-leak  # 一般錯誤修復

# 發布分支
release/v2.2.28          # 版本發布準備
```

### 2. 提交訊息規範
```bash
# 格式：<type>(<scope>): <description>

# 功能新增
feat(auth): add user login functionality
feat(chart): implement real-time data update

# 錯誤修復
fix(api): resolve memory leak in chart component
fix(ui): correct button alignment issue

# 文檔更新
docs(readme): update installation instructions
docs(api): add new endpoint documentation

# 樣式調整
style(css): fix indentation in main.css
style(lint): resolve ESLint warnings

# 重構
refactor(utils): simplify data transformation logic
refactor(components): extract common chart logic

# 測試
test(unit): add tests for user service
test(e2e): add login flow test

# 建置相關
build(deps): update vue to version 3.3.0
build(config): optimize webpack configuration
```

### 3. Pull Request 規範
```markdown
## 變更說明
簡要描述此次變更的內容和目的

## 變更類型
- [ ] 新功能
- [ ] 錯誤修復
- [ ] 文檔更新
- [ ] 樣式調整
- [ ] 重構
- [ ] 測試

## 測試清單
- [ ] 單元測試通過
- [ ] E2E 測試通過
- [ ] 手動測試完成
- [ ] 程式碼審查完成

## 相關 Issue
Closes #123
Related to #456

## 截圖（如適用）
[附上相關截圖]
```

## 🚀 部署規範

### 1. 環境分類
```bash
# 開發環境
NODE_ENV=development
VUE_APP_API_BASE_URL=http://localhost:3000

# 測試環境
NODE_ENV=staging
VUE_APP_API_BASE_URL=https://api-staging.example.com

# 生產環境
NODE_ENV=production
VUE_APP_API_BASE_URL=https://api.example.com
```

### 2. 建置檢查清單
- [ ] 程式碼通過 ESLint 檢查
- [ ] 所有測試通過
- [ ] 建置無錯誤和警告
- [ ] 環境變數正確設定
- [ ] 版本號已更新

### 3. 部署步驟
```bash
# 1. 建置生產版本
npm run build

# 2. 檢查建置結果
npm run serve:dist

# 3. 執行部署腳本
./deploy.sh production

# 4. 驗證部署結果
curl -f https://app.example.com/health
```

## 🔒 安全規範

### 1. 資料安全
```javascript
// ✅ 正確：敏感資料處理
const sanitizeUserInput = (input) => {
  return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

// ✅ 正確：API 金鑰保護
// 使用環境變數，不要硬編碼
const apiKey = process.env.VUE_APP_API_KEY

// ❌ 錯誤：硬編碼敏感資訊
const apiKey = 'sk-1234567890abcdef' // ❌
```

### 2. 權限控制
```javascript
// ✅ 正確：權限檢查
const hasPermission = (permission) => {
  const userPermissions = store.getters['auth/permissions']
  return userPermissions.includes(permission)
}

// ✅ 正確：路由守衛
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.getters['auth/isAuthenticated']) {
    next('/login')
  } else {
    next()
  }
})
```

## ⚡ 效能規範

### 1. 載入優化
```javascript
// ✅ 正確：懶載入路由
const UserManagement = () => import('@/view/oco/user/list/Index.vue')

// ✅ 正確：元件懶載入
const LazyChart = defineAsyncComponent(() => import('@/components/charts/LazyChart.vue'))

// ✅ 正確：圖片懶載入
<img v-lazy="imageUrl" alt="description" />
```

### 2. 記憶體管理
```javascript
// ✅ 正確：清理定時器
onUnmounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})

// ✅ 正確：清理事件監聽器
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
```

### 3. 效能監控
```javascript
// ✅ 正確：效能測量
const startTime = performance.now()
await heavyOperation()
const endTime = performance.now()
console.log(`Operation took ${endTime - startTime} milliseconds`)
```

## 📚 文檔規範

### 1. 程式碼註解
```javascript
/**
 * 計算用戶權限等級
 * @param {Object} user - 用戶物件
 * @param {string} user.role - 用戶角色
 * @param {Array} user.permissions - 用戶權限列表
 * @returns {number} 權限等級 (1-5)
 */
const calculatePermissionLevel = (user) => {
  // 實作邏輯
}

// ✅ 正確：複雜邏輯註解
// 根據業務規則計算電費
// 1. 基本費率 × 用電量
// 2. 加上時間電價調整
// 3. 套用優惠折扣
const calculateElectricityBill = (usage, timeSlot, discount) => {
  // 實作邏輯
}
```

### 2. README 更新
- 新增功能必須更新 README
- API 變更必須更新 API 文檔
- 配置變更必須更新設定說明

### 3. 變更日誌
```markdown
## [2.2.28] - 2024-12-XX

### Added
- 新增用戶權限管理功能
- 新增圖表效能優化

### Changed
- 優化 API 回應時間
- 更新 UI 元件樣式

### Fixed
- 修復圖表記憶體洩漏問題
- 修復登入頁面響應式問題

### Removed
- 移除過時的 API 端點
```

## 🚫 禁止事項

### 1. UIUX 限制
- **嚴禁**修改任何 UI/UX 相關設計
- **嚴禁**調整色彩、字型、間距、按鈕樣式
- **嚴禁**變更版面配置、動畫、響應式設計
- **嚴禁**修改使用者流程

### 2. 技術限制
- **嚴禁**在 watchEffect 中重複建立 Chart 實例
- **嚴禁**使用 var 宣告變數
- **嚴禁**硬編碼 API 端點或敏感資訊
- **嚴禁**直接操作 DOM（除非必要）

### 3. 流程限制
- **嚴禁**跳過程式碼審查直接合併
- **嚴禁**在生產環境直接修改程式碼
- **嚴禁**提交未測試的程式碼
- **嚴禁**刪除或修改他人的測試

## ✅ 檢查清單

### 開發前檢查
- [ ] 確認 Node.js 版本為 18.16.1
- [ ] 確認 npm 版本為 9.5.1
- [ ] 閱讀相關技術文檔
- [ ] 了解業務需求

### 開發中檢查
- [ ] 遵循程式碼規範
- [ ] 編寫單元測試
- [ ] 更新相關文檔
- [ ] 進行自我程式碼審查

### 提交前檢查
- [ ] ESLint 檢查通過
- [ ] 所有測試通過
- [ ] 手動測試完成
- [ ] 提交訊息符合規範

### 部署前檢查
- [ ] 程式碼審查完成
- [ ] 建置無錯誤
- [ ] 環境變數正確
- [ ] 備份現有版本

---

> **注意**：本文檔會隨著專案發展持續更新，所有開發人員都有責任遵守這些規則並提出改進建議。

**最後更新**：2024-12-XX
**維護者**：OCO 開發團隊
```

