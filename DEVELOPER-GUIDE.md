# iframe 自動適應功能 - 開發者指南

## 📋 目錄

1. [架構概述](#架構概述)
2. [核心組件](#核心組件)
3. [API 文件](#api-文件)
4. [開發指南](#開發指南)
5. [測試指南](#測試指南)
6. [部署指南](#部署指南)

---

## 架構概述

### 系統架構

```
┌─────────────────────────────────────────────────────────────┐
│                     Oco.GUI 主系統                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              設定介面 (Setting Interface)              │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  一鍵最佳化  │  視覺化預覽  │  範本管理        │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │          計算引擎 (Calculation Engine)               │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Layout Measurer  │  Size Calculator            │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
│                            ↓                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │         iframe 組件 (Iframe Component)               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 技術棧

- **前端框架**: Vue 3 (Composition API)
- **狀態管理**: Vuex 4
- **UI 框架**: Ant Design Vue 3
- **類型系統**: TypeScript 4.9+
- **測試框架**: Vitest + fast-check
- **構建工具**: Vite

### 目錄結構

```
Oco.Gui/plc-frontend/
├── src/
│   ├── types/
│   │   └── iframe-config.ts          # TypeScript 類型定義
│   ├── utils/
│   │   ├── layout-measurer.ts        # 佈局測量器
│   │   ├── size-calculator.ts        # 尺寸計算器
│   │   ├── configuration-manager.ts  # 配置管理器
│   │   ├── performance.ts            # 效能優化工具
│   │   ├── accessibility.ts          # 無障礙功能
│   │   └── browser-compat.ts         # 瀏覽器兼容性
│   ├── components/
│   │   └── oco/gui/
│   │       ├── iframe/
│   │       │   ├── Index.vue         # iframe 主組件
│   │       │   ├── main.js           # iframe 邏輯
│   │       │   └── ErrorBoundary.vue # 錯誤邊界
│   │       └── setting/
│   │           ├── Index.vue         # 設定主頁面
│   │           ├── main.js           # 設定邏輯
│   │           ├── PreviewPanel.vue  # 預覽面板
│   │           └── TemplateManager.vue # 範本管理
│   ├── api/
│   │   └── iframeTemplate.js         # 範本 API
│   └── vuex/
│       └── modules/gui/
│           └── actionCreator.js      # Vuex actions
├── tests/
│   ├── unit/                         # 單元測試
│   ├── property/                     # 屬性測試
│   └── integration/                  # 整合測試
└── database/
    └── create-iframe-template-table.sql  # 資料庫腳本
```

---

## 核心組件

### 1. Layout Measurer（佈局測量器）

#### 職責
測量當前頁面佈局的各項尺寸，包括視窗、Sidebar、Header、Footer 等。

#### 接口定義

```typescript
interface LayoutMeasurements {
  viewport: {
    width: number;
    height: number;
  };
  sidebar: {
    width: number;
    collapsed: boolean;
    collapsedWidth: number;
  };
  header: {
    height: number;
  };
  footer: {
    height: number;
  };
  contentPadding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

class LayoutMeasurer {
  measure(): LayoutMeasurements;
  onLayoutChange(callback: (measurements: LayoutMeasurements) => void): void;
  dispose(): void;
}
```

#### 使用範例

```typescript
import { LayoutMeasurer } from '@/utils/layout-measurer';

// 創建實例
const measurer = new LayoutMeasurer();

// 執行測量
const measurements = measurer.measure();
console.log('視窗尺寸:', measurements.viewport);

// 監聽變化
measurer.onLayoutChange((newMeasurements) => {
  console.log('佈局已變化:', newMeasurements);
});

// 清理
measurer.dispose();
```

#### 實現細節

**測量策略：**
1. 使用 `getBoundingClientRect()` 獲取元素尺寸
2. 使用 `getComputedStyle()` 獲取 padding 值
3. 提供預設值作為降級方案

**監聽機制：**
1. `MutationObserver` - 監聽 Sidebar 狀態變化
2. `ResizeObserver` - 監聽容器大小變化
3. `window.resize` - 降級方案

---

### 2. Size Calculator（尺寸計算器）

#### 職責
根據測量結果計算最佳 iframe 尺寸，保持 16:9 比例。

#### 接口定義

```typescript
interface CalculationOptions {
  designRatio: number;
  fitMode?: 'auto' | 'width-based' | 'height-based';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

interface CalculatedSize {
  width: number;
  height: number;
  fitMode: 'width-based' | 'height-based';
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  availableSpace: {
    width: number;
    height: number;
  };
}

class SizeCalculator {
  calculate(
    measurements: LayoutMeasurements,
    options: CalculationOptions
  ): CalculatedSize;
  
  calculateAvailableSpace(
    measurements: LayoutMeasurements
  ): { width: number; height: number };
  
  calculateCenterMargins(
    availableSpace: { width: number; height: number },
    contentSize: { width: number; height: number }
  ): { top: number; right: number; bottom: number; left: number };
}
```

#### 使用範例

```typescript
import { SizeCalculator } from '@/utils/size-calculator';

const calculator = new SizeCalculator();

// 計算最佳尺寸
const result = calculator.calculate(measurements, {
  designRatio: 16 / 9,
  fitMode: 'auto'
});

console.log('推薦尺寸:', result.width, 'x', result.height);
console.log('適應模式:', result.fitMode);
```

#### 計算邏輯

**可用空間計算：**
```typescript
availableWidth = viewport.width - sidebar.width - padding.left - padding.right
availableHeight = viewport.height - header.height - footer.height - padding.top - padding.bottom
```

**比例適應計算：**
```typescript
// 以寬度為基準
byWidth = {
  width: availableWidth,
  height: availableWidth / designRatio
}

// 以高度為基準
byHeight = {
  width: availableHeight * designRatio,
  height: availableHeight
}

// 選擇不超出可用空間的方案
optimal = byWidth.height <= availableHeight ? byWidth : byHeight
```

---

### 3. Configuration Manager（配置管理器）

#### 職責
管理用戶配置的儲存、載入和驗證。

#### 接口定義

```typescript
interface IframeConfig {
  displayMode: 'contain-center' | 'stretch' | 'none';
  heightMode: 'px' | 'vh' | 'auto';
  heightValue?: number;
  designResolution: {
    width: number;
    height: number;
  };
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  serverUrl: string;
  viewUrl: string;
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

class ConfigurationManager {
  loadConfig(id: string): Promise<IframeConfig>;
  saveConfig(id: string, config: IframeConfig): Promise<void>;
  validateConfig(config: IframeConfig): ValidationResult;
}
```

#### 使用範例

```typescript
import { ConfigurationManager } from '@/utils/configuration-manager';

const manager = new ConfigurationManager();

// 驗證配置
const validation = manager.validateConfig(config);
if (!validation.valid) {
  console.error('配置無效:', validation.errors);
}

// 儲存配置
await manager.saveConfig('page-1', config);

// 載入配置
const loaded = await manager.loadConfig('page-1');
```

---

## API 文件

### 範本管理 API

#### 儲存範本

```typescript
POST /api/iframe-templates

Request Body:
{
  name: string;
  description?: string;
  config: IframeConfig;
}

Response:
{
  id: string;
  message: string;
}
```

#### 載入範本

```typescript
GET /api/iframe-templates/:id

Response:
{
  id: string;
  name: string;
  description: string;
  config: IframeConfig;
  createdAt: string;
}
```

#### 列出範本

```typescript
GET /api/iframe-templates

Response:
{
  templates: Array<{
    id: string;
    name: string;
    description: string;
    createdAt: string;
  }>;
}
```

#### 刪除範本

```typescript
DELETE /api/iframe-templates/:id

Response:
{
  message: string;
}
```

### 配置 API

#### 儲存配置

```typescript
PUT /api/gui-settings/:id

Request Body:
{
  DataContentJson: string; // JSON.stringify(IframeConfig)
}

Response:
{
  success: boolean;
  message: string;
}
```

#### 載入配置

```typescript
GET /api/gui-settings/:id

Response:
{
  Id: number;
  Name: string;
  DataContentJson: string;
}
```

---

## 開發指南

### 環境設置

#### 1. 安裝依賴

```bash
cd Oco.Gui/plc-frontend
npm install
```

#### 2. 開發模式

```bash
npm run dev
```

#### 3. 構建生產版本

```bash
npm run build
```

### 添加新功能

#### 步驟 1：定義類型

在 `src/types/iframe-config.ts` 中添加新類型：

```typescript
export interface NewFeature {
  enabled: boolean;
  options: {
    // ...
  };
}
```

#### 步驟 2：實現邏輯

創建新的工具類或組件：

```typescript
// src/utils/new-feature.ts
export class NewFeature {
  // 實現邏輯
}
```

#### 步驟 3：添加測試

```typescript
// tests/unit/new-feature.test.ts
import { describe, it, expect } from 'vitest';
import { NewFeature } from '@/utils/new-feature';

describe('NewFeature', () => {
  it('should work correctly', () => {
    // 測試邏輯
  });
});
```

#### 步驟 4：整合到組件

```vue
<script setup lang="ts">
import { NewFeature } from '@/utils/new-feature';

const feature = new NewFeature();
// 使用功能
</script>
```

### 代碼規範

#### TypeScript 規範

```typescript
// ✅ 好的做法
interface Config {
  width: number;
  height: number;
}

function calculate(config: Config): number {
  return config.width * config.height;
}

// ❌ 避免
function calculate(config: any): any {
  return config.width * config.height;
}
```

#### Vue 組件規範

```vue
<!-- ✅ 好的做法 -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);
</script>

<!-- ❌ 避免 -->
<script>
export default {
  data() {
    return { count: 0 };
  }
};
</script>
```

#### 命名規範

```typescript
// 類名：PascalCase
class LayoutMeasurer {}

// 函數名：camelCase
function calculateSize() {}

// 常量：UPPER_SNAKE_CASE
const DEFAULT_WIDTH = 1920;

// 接口：PascalCase，以 I 開頭（可選）
interface IframeConfig {}
```

---

## 測試指南

### 測試策略

本專案採用雙重測試策略：

1. **單元測試** - 測試特定功能和邊界情況
2. **屬性測試** - 測試通用屬性在所有輸入下都成立

### 運行測試

```bash
# 運行所有測試
npm run test

# 運行單元測試
npm run test:unit

# 運行屬性測試
npm run test:property

# 運行整合測試
npm run test:integration

# 生成覆蓋率報告
npm run test:coverage

# 監視模式
npm run test:watch
```

### 編寫單元測試

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { SizeCalculator } from '@/utils/size-calculator';

describe('SizeCalculator', () => {
  let calculator: SizeCalculator;
  
  beforeEach(() => {
    calculator = new SizeCalculator();
  });
  
  it('should calculate available width correctly', () => {
    const measurements = {
      viewport: { width: 1920, height: 1080 },
      sidebar: { width: 200, collapsed: false, collapsedWidth: 64 },
      header: { height: 64 },
      footer: { height: 50 },
      contentPadding: { top: 24, right: 24, bottom: 24, left: 24 }
    };
    
    const result = calculator.calculateAvailableSpace(measurements);
    
    expect(result.width).toBe(1672); // 1920 - 200 - 24 - 24
    expect(result.height).toBe(918); // 1080 - 64 - 50 - 24 - 24
  });
});
```

### 編寫屬性測試

```typescript
import { describe, it } from 'vitest';
import * as fc from 'fast-check';
import { SizeCalculator } from '@/utils/size-calculator';

describe('SizeCalculator Properties', () => {
  const calculator = new SizeCalculator();
  
  /**
   * Property: 計算結果非負性
   * For any 測量值，計算出的尺寸應該 >= 0
   */
  it('should always return non-negative dimensions', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 800, max: 3840 }),
        fc.integer({ min: 600, max: 2160 }),
        (width, height) => {
          const measurements = createMeasurements(width, height);
          const result = calculator.calculate(measurements, {
            designRatio: 16 / 9
          });
          
          return result.width >= 0 && result.height >= 0;
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### 測試覆蓋率目標

- **整體覆蓋率**: ≥ 80%
- **核心邏輯**: ≥ 95%
- **UI 組件**: ≥ 70%

---

## 部署指南

### 構建流程

#### 1. 準備環境

```bash
# 確認 Node.js 版本
node --version  # 應該 >= 16.0.0

# 安裝依賴
npm ci
```

#### 2. 運行測試

```bash
# 運行完整測試套件
npm run test

# 生成覆蓋率報告
npm run test:coverage

# 確認覆蓋率達標
```

#### 3. 構建生產版本

```bash
# 構建
npm run build

# 輸出目錄：dist/
```

#### 4. 部署到伺服器

```bash
# 複製構建產物到伺服器
scp -r dist/* user@server:/path/to/deploy/

# 或使用 Docker
docker build -t oco-gui-frontend .
docker push oco-gui-frontend:latest
```

### 資料庫遷移

#### 1. 創建範本表

```sql
-- 在資料庫中執行
-- database/create-iframe-template-table.sql

CREATE TABLE IframeConfigTemplate (
  Id INT PRIMARY KEY IDENTITY,
  Name NVARCHAR(100) NOT NULL,
  Description NVARCHAR(500),
  ConfigJson NVARCHAR(MAX) NOT NULL,
  CreatedAt DATETIME DEFAULT GETDATE(),
  Tags NVARCHAR(200)
);
```

#### 2. 驗證表結構

```sql
-- 檢查表是否創建成功
SELECT * FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_NAME = 'IframeConfigTemplate';

-- 檢查欄位
SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'IframeConfigTemplate';
```

### 配置更新

#### 1. 更新 API 端點

```javascript
// src/api/iframeTemplate.js
const API_BASE_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000';
```

#### 2. 更新環境變數

```bash
# .env.production
VUE_APP_API_URL=https://api.production.com
VUE_APP_ENABLE_DEBUG=false
```

### 版本發布

#### 1. 更新版本號

```bash
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0
```

#### 2. 創建發布標籤

```bash
git tag -a v2.0.0 -m "Release version 2.0.0"
git push origin v2.0.0
```

#### 3. 生成發布說明

參考 `RELEASE-NOTES.md` 模板。

---

## 附錄

### A. 常用命令

```bash
# 開發
npm run dev              # 啟動開發伺服器
npm run build            # 構建生產版本
npm run preview          # 預覽生產構建

# 測試
npm run test             # 運行所有測試
npm run test:unit        # 運行單元測試
npm run test:property    # 運行屬性測試
npm run test:coverage    # 生成覆蓋率報告

# 代碼品質
npm run lint             # 運行 ESLint
npm run format           # 運行 Prettier
npm run type-check       # TypeScript 類型檢查

# 資料庫
npm run db:migrate       # 運行資料庫遷移
npm run db:seed          # 填充測試數據
```

### B. 環境變數

```bash
# 開發環境 (.env.development)
VUE_APP_API_URL=http://localhost:3000
VUE_APP_ENABLE_DEBUG=true
VUE_APP_LOG_LEVEL=debug

# 生產環境 (.env.production)
VUE_APP_API_URL=https://api.production.com
VUE_APP_ENABLE_DEBUG=false
VUE_APP_LOG_LEVEL=error
```

### C. 瀏覽器支援

| 瀏覽器 | 最低版本 | 備註 |
|--------|---------|------|
| Chrome | 90+ | 完全支援 |
| Firefox | 88+ | 完全支援 |
| Edge | 90+ | 完全支援 |
| Safari | 14+ | 完全支援 |
| IE | - | 不支援 |

### D. 效能指標

| 指標 | 目標值 | 測量方法 |
|------|--------|---------|
| 首次內容繪製 (FCP) | < 1.5s | Lighthouse |
| 最大內容繪製 (LCP) | < 2.5s | Lighthouse |
| 首次輸入延遲 (FID) | < 100ms | Lighthouse |
| 累積佈局偏移 (CLS) | < 0.1 | Lighthouse |

---

**文件版本：** 1.0  
**最後更新：** 2025-01-08  
**適用版本：** Oco.GUI plc-frontend v2.0+  
**維護者：** Oco.GUI 開發團隊
