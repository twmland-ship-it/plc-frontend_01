# 技術前提約束 (Technical Prerequisites)

> **版本**：2.2.36
> **最後更新**：2025-09-28
> **適用範圍**：所有開發、測試、部署環境

## 📋 目錄

- [核心環境要求](#核心環境要求)
- [開發工具要求](#開發工具要求)
- [技術棧規範](#技術棧規範)
- [瀏覽器支援](#瀏覽器支援)
- [伺服器環境](#伺服器環境)
- [第三方服務](#第三方服務)
- [安全要求](#安全要求)
- [效能要求](#效能要求)

## 🔧 核心環境要求

### 必要環境版本

> ⚠️ **嚴格要求**：以下版本為強制要求，不得使用其他版本

| 工具 | 版本 | 驗證指令 | 說明 |
|------|------|----------|------|
| **Node.js** | `18.16.1` | `node -v` | 必須完全一致 |
| **npm** | `9.5.1` | `npm -v` | 必須完全一致 |
| **Git** | `≥ 2.30.0` | `git --version` | 版本控制 |

### 環境設定驗證

```bash
# 1. 檢查 Node.js 版本
node -v
# 預期輸出：v18.16.1

# 2. 檢查 npm 版本
npm -v
# 預期輸出：9.5.1

# 3. 檢查 Git 版本
git --version
# 預期輸出：git version 2.30.0 或更高

# 4. 驗證 npm 全域套件
npm list -g --depth=0
```

### Node.js 版本管理

```bash
# 使用 nvm 管理 Node.js 版本（推薦）
nvm install 18.16.1
nvm alias default 18.16.1
nvm use 18.16.1

# 驗證版本
node -v && npm -v
```

## 🛠️ 開發工具要求

### IDE 與編輯器

#### 推薦 IDE
1. **Visual Studio Code** (≥ 1.70.0)
   - 必要擴充套件：
     - Vue Language Features (Volar)
     - TypeScript Vue Plugin (Volar)
     - ESLint
     - Prettier - Code formatter
     - GitLens

2. **Cursor** (最新版本)
   - 內建 AI 輔助開發
   - 自動讀取專案規則檔案

#### IDE 設定檔案
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "vetur.validation.template": false,
  "vetur.validation.script": false,
  "vetur.validation.style": false
}
```

### 瀏覽器開發工具

#### 必要瀏覽器
- **Chrome** (≥ 90.0)
- **Firefox** (≥ 88.0)
- **Safari** (≥ 14.0)
- **Edge** (≥ 90.0)

#### 瀏覽器擴充套件
- Vue.js devtools
- React Developer Tools (用於某些第三方元件)

## 🏗️ 技術棧規範

### 前端框架

#### 核心框架
```json
{
  "vue": "^3.3.0",
  "vue-router": "^4.2.0",
  "vuex": "^4.1.0"
}
```

#### UI 框架
```json
{
  "ant-design-vue": "^3.2.0"
}
```

### 圖表與視覺化

#### 主要圖表庫
```json
{
  "chart.js": "^3.9.0",
  "chartjs-plugin-zoom": "^2.0.0",
  "apexcharts": "^3.40.0",
  "vue3-apexcharts": "^1.4.0"
}
```

#### 地圖服務
```json
{
  "@googlemaps/js-api-loader": "^1.16.0"
}
```

### 開發與建置工具

#### 建置工具
```json
{
  "@vue/cli": "^5.0.0",
  "webpack": "^5.80.0",
  "babel-core": "^7.20.0"
}
```

#### 程式碼品質
```json
{
  "eslint": "^8.40.0",
  "prettier": "^2.8.0",
  "@vue/eslint-config-prettier": "^7.1.0"
}
```

#### 測試工具
```json
{
  "cypress": "^12.0.0",
  "@playwright/test": "^1.35.0",
  "jest": "^29.0.0"
}
```

### 工具庫

#### 核心工具
```json
{
  "lodash-es": "^4.17.0",
  "dayjs": "^1.11.0",
  "axios": "^1.4.0"
}
```

#### UI 增強
```json
{
  "gridstack": "^8.0.0",
  "sortablejs": "^1.15.0",
  "vue-draggable-next": "^2.2.0"
}
```

## 🌐 瀏覽器支援

### 支援的瀏覽器版本

| 瀏覽器 | 最低版本 | 推薦版本 | 說明 |
|--------|----------|----------|------|
| Chrome | 90+ | 最新版 | 主要開發瀏覽器 |
| Firefox | 88+ | 最新版 | 次要測試瀏覽器 |
| Safari | 14+ | 最新版 | macOS 支援 |
| Edge | 90+ | 最新版 | Windows 預設 |

### 瀏覽器功能要求

#### 必要 Web API
- ES2020 支援
- WebGL 1.0 (圖表渲染)
- Canvas 2D Context
- WebSocket (即時資料)
- Local Storage
- Session Storage
- Fetch API

#### 效能要求
- 記憶體：≥ 4GB 可用
- CPU：支援 JavaScript JIT 編譯
- GPU：支援硬體加速 (推薦)

## 🖥️ 伺服器環境

### 開發伺服器

#### 本地開發
```bash
# 開發伺服器規格
CPU: ≥ 4 核心
RAM: ≥ 8GB
Storage: ≥ 20GB 可用空間
Network: 穩定網路連線
```

#### 容器環境
```dockerfile
# 基礎映像要求
FROM node:18.16.1-alpine

# 系統套件
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++
```

### 生產環境

#### Web 伺服器
- **Nginx** (≥ 1.20.0) - 推薦
- **Apache** (≥ 2.4.0)
- **IIS** (≥ 10.0) - Windows 環境

#### 容器平台
- **Docker** (≥ 20.10.0)
- **Kubernetes** (≥ 1.24.0)
- **Docker Compose** (≥ 2.0.0)

## 🔗 第三方服務

### 必要服務

#### 地圖服務
```javascript
// Google Maps API
const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
  version: 'weekly',
  libraries: ['places', 'geometry']
}
```

#### 字型服務
```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
```

### 可選服務

#### 監控服務
- **Sentry** - 錯誤追蹤
- **Google Analytics** - 使用分析
- **Hotjar** - 用戶行為分析

#### CDN 服務
- **Cloudflare** - 內容分發
- **AWS CloudFront** - 靜態資源加速

## 🔒 安全要求

### HTTPS 要求
- 生產環境必須使用 HTTPS
- 開發環境推薦使用 HTTPS
- 所有 API 呼叫必須使用 HTTPS

### 內容安全政策 (CSP)
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com;
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
               font-src 'self' https://fonts.gstatic.com;
               img-src 'self' data: https:;
               connect-src 'self' https://api.example.com;">
```

### 環境變數安全
```bash
# 敏感資訊必須使用環境變數
VUE_APP_API_BASE_URL=https://api.example.com
VUE_APP_GOOGLE_MAPS_API_KEY=your_api_key_here

# 不可在程式碼中硬編碼
```

## ⚡ 效能要求

### 載入效能

#### 首次載入
- **首屏時間** ≤ 3 秒
- **完全載入** ≤ 5 秒
- **資源大小** ≤ 2MB (gzipped)

#### 後續載入
- **路由切換** ≤ 500ms
- **API 回應** ≤ 1 秒
- **圖表渲染** ≤ 300ms

### 運行效能

#### 記憶體使用
- **初始記憶體** ≤ 50MB
- **峰值記憶體** ≤ 200MB
- **記憶體洩漏** = 0

#### CPU 使用
- **閒置 CPU** ≤ 5%
- **圖表更新** ≤ 30%
- **資料處理** ≤ 50%

## 📦 套件管理

### 套件安裝
```bash
# 使用 npm（不要使用 yarn 或 pnpm）
npm install

# 檢查套件漏洞
npm audit

# 修復漏洞
npm audit fix
```

### 套件版本鎖定
```json
// package-lock.json 必須提交到版本控制
// 確保所有環境使用相同版本
```

### 套件更新策略
```bash
# 檢查過時套件
npm outdated

# 更新次要版本
npm update

# 更新主要版本（需要測試）
npm install package@latest
```

## ✅ 環境驗證清單

### 開發環境檢查
- [ ] Node.js 版本正確 (18.16.1)
- [ ] npm 版本正確 (9.5.1)
- [ ] Git 版本符合要求
- [ ] IDE 已安裝必要擴充套件
- [ ] 瀏覽器版本符合要求
- [ ] 網路連線正常

### 專案設定檢查
- [ ] 環境變數已設定
- [ ] API 端點可連線
- [ ] 第三方服務金鑰有效
- [ ] 本地開發伺服器可啟動
- [ ] 熱重載功能正常

### 建置環境檢查
- [ ] 建置過程無錯誤
- [ ] 靜態資源正確生成
- [ ] 程式碼壓縮正常
- [ ] Source map 生成
- [ ] 環境變數正確注入

---

> **重要提醒**：所有環境要求都是強制性的，不符合要求的環境可能導致專案無法正常運行或出現未預期的錯誤。

**維護者**：OCO 開發團隊
**聯絡方式**：support@ococomtw.com

