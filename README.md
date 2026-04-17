# PLC Frontend System

[![Version](https://img.shields.io/badge/version-2.2.36-blue.svg)](https://github.com/ococomtw/plc-frontend)
[![Node.js](https://img.shields.io/badge/node.js-18.16.1-green.svg)](https://nodejs.org/)
[![Vue.js](https://img.shields.io/badge/vue.js-3.x-brightgreen.svg)](https://vuejs.org/)
[![License](https://img.shields.io/badge/license-Proprietary-red.svg)](LICENSE)

> **工業控制系統前端介面** - 提供完整的 PLC 監控、資料分析與系統管理功能

## 📋 目錄

- [專案概述](#專案概述)
- [功能特色](#功能特色)
- [技術架構](#技術架構)
- [環境要求](#環境要求)
- [安裝與啟動](#安裝與啟動)
- [開發指南](#開發指南)
- [部署說明](#部署說明)
- [API 文檔](#api-文檔)
- [測試](#測試)
- [貢獻指南](#貢獻指南)
- [版本歷史](#版本歷史)
- [支援與聯絡](#支援與聯絡)

## 🎯 專案概述

PLC Frontend System 是一個現代化的工業控制系統前端介面，基於 Vue.js 3 開發，提供直觀的用戶體驗和強大的功能。系統主要用於：

- **即時監控**：工業設備與感測器的即時狀態監控
- **資料分析**：歷史資料查詢、統計分析與報表生成
- **警報管理**：即時警報通知與歷史警報記錄
- **系統管理**：用戶權限、設備配置與系統設定

## ✨ 功能特色

### 🏠 儀表板
- 可自訂的儀表板配置
- 即時資料視覺化
- 多種圖表類型支援
- 響應式設計

### 📊 資料管理
- 即時資料監控
- 歷史資料查詢
- 統計報表生成
- 資料匯出功能

### 🚨 警報系統
- 即時警報通知
- 警報等級分類
- 歷史警報記錄
- 警報確認機制
- 可靠度分析功能
  - 設備故障次數統計
  - 運轉次數統計
  - 可靠度百分比計算
  - 設備運轉時間重置

### 👥 用戶管理
- 角色權限控制
- 用戶群組管理
- 操作日誌記錄
- 安全認證

### ⚙️ 系統設定
- 設備標籤管理
- 通訊設定
- 系統參數配置
- 備份與還原

### 💰 電費計算
- 低壓非時間電價設定
- 夏月期間配置 (月日範圍設定)
- 電價實施年月設定 (2020-2100年)
- 臨時用電倍數設定 (支援小數倍數)
- 基本電費與流動電費計算

## 🏗️ 技術架構

### 前端技術棧
- **框架**：Vue.js 3.x
- **狀態管理**：Vuex 4.x
- **路由**：Vue Router 4.x
- **UI 框架**：Ant Design Vue
- **圖表庫**：ApexCharts, Chart.js
- **地圖**：Google Maps API
- **建置工具**：Vue CLI, Webpack

### 開發工具
- **程式碼品質**：ESLint, Prettier
- **測試框架**：Cypress, Playwright
- **版本控制**：Git
- **CI/CD**：GitHub Actions
- **容器化**：Docker

## 📋 環境要求

> **⚠️ 重要：所有開發人員必須嚴格遵守以下版本要求**

### 必要環境
- **Node.js**：18.16.1 (必須)
- **npm**：9.5.1 (必須)
- **Git**：2.x 或更高版本

### 推薦工具
- **IDE**：Visual Studio Code, Cursor
- **瀏覽器**：Chrome 90+, Firefox 88+, Safari 14+
- **Node 版本管理**：nvm (推薦)

## 🚀 安裝與啟動

### 1. 環境準備

```bash
# 安裝指定版本的 Node.js
nvm install 18.16.1
nvm alias default 18.16.1
nvm use 18.16.1

# 驗證版本
node -v   # 必須顯示 v18.16.1
npm -v    # 必須顯示 9.5.1
```

### 2. 專案安裝

```bash
# 複製專案
git clone https://github.com/ococomtw/plc-frontend.git
cd plc-frontend

# 安裝依賴
npm install
```

### 3. 環境設定

```bash
# 複製環境變數檔案
cp .env.example .env

# 編輯環境變數
# 設定 API 端點、地圖 API 金鑰等
```

### 4. 啟動開發伺服器

```bash
# 開發模式啟動
npm run serve

# 專案將在 http://localhost:8080 啟動
```


## 🛠️ 開發指南

### 可用指令

```bash
# 開發
npm run serve          # 啟動開發伺服器
npm run build          # 建置生產版本
npm run lint           # 程式碼檢查
npm run lint:fix       # 自動修復程式碼問題

# 測試
npm run test:unit      # 單元測試
npm run test:e2e       # 端對端測試
npm run test:cypress   # Cypress 測試

# 其他
npm run analyze        # 分析打包結果
npm run serve:dist     # 預覽生產版本
```

### 專案結構

```
plc-frontend/
├── public/                 # 靜態資源
├── src/
│   ├── components/        # 可重用元件
│   │   ├── oco/          # OCO 專用元件
│   │   └── utilities/    # 工具元件
│   ├── composable/       # Vue 3 Composition API
│   ├── config/           # 配置檔案
│   ├── core/             # 核心功能
│   ├── layout/           # 版面配置
│   ├── routes/           # 路由設定
│   ├── static/           # 靜態資源
│   ├── utility/          # 工具函數
│   ├── view/             # 頁面元件
│   ├── vuex/             # 狀態管理
│   └── main.js           # 應用程式入口
├── docs/                 # 文檔
├── cypress/              # E2E 測試
├── 開發文件/             # 開發文檔
└── 版本修改/             # 版本記錄
```

### 程式碼規範

#### 命名規範
- **檔案名稱**：使用 PascalCase (如：`UserManagement.vue`)
- **元件名稱**：使用 PascalCase (如：`<UserCard>`)
- **變數名稱**：使用 camelCase (如：`userName`)
- **常數名稱**：使用 UPPER_SNAKE_CASE (如：`API_BASE_URL`)

#### Vue 元件規範
```vue
<template>
  <!-- 模板內容 -->
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComponentName',
  components: {
    // 子元件
  },
  props: {
    // 屬性定義
  },
  setup() {
    // Composition API 邏輯
    return {
      // 回傳值
    }
  }
})
</script>

<style scoped>
/* 樣式定義 */
</style>
```

### Git 工作流程

```bash
# 1. 建立功能分支
git checkout -b feature/new-feature

# 2. 開發並提交
git add .
git commit -m "feat: add new feature"

# 3. 推送分支
git push origin feature/new-feature

# 4. 建立 Pull Request
# 5. 程式碼審查
# 6. 合併到主分支
```

## 🚀 部署說明

### Docker 部署

```bash
# 建置 Docker 映像
docker build -t plc-frontend:latest .

# 執行容器
docker run -d \
  --name plc-frontend \
  -p 80:80 \
  plc-frontend:latest
```

### Docker Compose 部署

```bash
# 啟動服務
docker-compose up -d

# 停止服務
docker-compose down
```

### 傳統部署

```bash
# 建置生產版本
npm run build

# 將 dist/ 目錄內容部署到 Web 伺服器
# 例如：Apache, Nginx, IIS
```

### 環境變數設定

建立 `.env` 檔案並設定以下變數：

```env
# API 設定
VUE_APP_API_BASE_URL=https://api.example.com
VUE_APP_API_TIMEOUT=30000

# 地圖 API
VUE_APP_GOOGLE_MAPS_API_KEY=your_api_key_here

# 系統設定
VUE_APP_SYSTEM_NAME=PLC Frontend System
VUE_APP_VERSION=2.2.36

# 功能開關
VUE_APP_ENABLE_DEBUG=false
VUE_APP_ENABLE_MOCK=false
```

## 📚 API 文檔

完整的 API 文檔請參考：
- [OpenAPI 規範](./docs/openapi.yaml)
- [環境變數設定規範](./docs/環境變數設定規範.md)

### 主要 API 端點

| 端點 | 方法 | 說明 |
|------|------|------|
| `/api/auth/login` | POST | 用戶登入 |
| `/api/System/GetFirstPageItemContent` | GET | 取得儀表板配置 |
| `/api/Statistic/GetRealTimeStaisticSummary` | POST | 即時統計資料 |
| `/api/history-report/tag-statistic-summaries/search` | POST | 歷史統計查詢 |
| `/api/alarms/realtime` | GET | 即時警報 |
| `/api/tags/list` | GET | 標籤列表 |

## 🧪 測試

### 單元測試

```bash
# 執行所有單元測試
npm run test:unit

# 執行特定測試檔案
npm run test:unit -- --grep "ComponentName"

# 產生覆蓋率報告
npm run test:unit -- --coverage
```

### E2E 測試

```bash
# 執行 Cypress 測試
npm run test:cypress

# 執行 Playwright 測試
npm run test:playwright

# 開啟 Cypress 測試介面
npx cypress open
```

### 測試檔案結構

```
tests/
├── unit/              # 單元測試
│   ├── components/    # 元件測試
│   └── utils/         # 工具函數測試
├── e2e/               # E2E 測試
│   ├── cypress/       # Cypress 測試
│   └── playwright/    # Playwright 測試
└── fixtures/          # 測試資料
```

## 🤝 貢獻指南

### 開發流程

1. **Fork 專案**到您的 GitHub 帳號
2. **建立功能分支**：`git checkout -b feature/amazing-feature`
3. **提交變更**：`git commit -m 'Add amazing feature'`
4. **推送分支**：`git push origin feature/amazing-feature`
5. **建立 Pull Request**

### 程式碼審查

所有 Pull Request 都需要經過程式碼審查：
- 確保程式碼符合專案規範
- 通過所有自動化測試
- 至少一位維護者的審查通過

### 問題回報

請使用 [GitHub Issues](https://github.com/ococomtw/plc-frontend/issues) 回報問題：
- 使用清楚的標題描述問題
- 提供詳細的重現步驟
- 包含錯誤訊息和螢幕截圖
- 說明預期行為和實際行為

## 📋 重要規則

### ⚠️ UIUX 不可異動規則
- 任何 UI 或 UX 相關的元件、樣式、版面、互動設計，均不可異動、不可調整
- 包含但不限於：色彩、字型、間距、按鈕樣式、版面配置、動畫、響應式設計、使用者流程等
- 若有任何 UIUX 相關需求，需經專案負責人書面同意

### 🔧 Cursor AI 設定
每次重開 Cursor 時，AI 助手會自動讀取以下檔案：
- `.cursor/rules/uiux-lock.md` - UIUX 鎖定規則
- `.cursorrules` - 專案規則設定

## 📈 版本歷史

| 版本 | 日期 | 說明 |
|------|------|------|
| 2.2.36 | 2025-09-28 | 當前版本 |
| 2.2.35 | 2025-09-09 | CCTV 視窗拖曳修正＋文件補全 |
| 2.2.27 | 2024-11-XX | 功能更新 |
| 2.2.26 | 2024-10-XX | 錯誤修復 |

詳細版本記錄請參考 [版本修改紀錄.txt](./版本修改紀錄.txt)

## 📞 支援與聯絡

### 技術支援
- **Email**：support@ococomtw.com
- **GitHub Issues**：[問題回報](https://github.com/ococomtw/plc-frontend/issues)
- **文檔**：[開發文件](./開發文件/)

### 專案資訊
- **GitHub**：https://github.com/ococomtw/plc-frontend
- **官方網站**：https://www.ococomtw.com
- **技術文檔**：[專案架構](./開發文件/專案架構.md)

### 開發團隊
- **專案負責人**：OCO 開發團隊
- **技術架構**：Vue.js 3 + Ant Design Vue
- **維護狀態**：積極維護中

---

© 2024 OCO Company. All rights reserved.

## 🌐 外部連結（iframe）— 內網行為與限制

- 同網域（same-origin）
  - 我們會在 iframe onload 時移除內頁的預設 margin/padding 以及第一個標題的 margin-top，避免頂部空白。
- 跨網域（cross-origin）
  - 基於瀏覽器同源政策，前端無法存取或修改內頁 DOM/CSS，外部頁面若自帶外距將保留。
- 內網最佳化（localhost 重寫）
  - 若外部連結設定為 `http://localhost` 或 `http://127.0.0.1`，前端會自動重寫為 `http://<目前主機名>:<原埠>`，避免每台用戶端各自指向本機導致結果不一致。
- 建議做法
  - 配置外部連結時避免使用 `localhost`，改用實際主機名或 IP。
  - 需要視覺完全一致且可控時，建議透過反向代理提供同源路徑（例如：`/ext/grafana` → `http://grafana:3000`）。
"# plc-frontend_01" 
