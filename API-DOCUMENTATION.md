# iframe 自動適應功能 - API 文件

## 📋 目錄

1. [API 概述](#api-概述)
2. [核心類別 API](#核心類別-api)
3. [組件 API](#組件-api)
4. [HTTP API](#http-api)
5. [類型定義](#類型定義)

---

## API 概述

### 基礎 URL

```
開發環境: http://localhost:3000/api
生產環境: https://api.production.com/api
```

### 認證

所有 API 請求需要包含認證 token：

```http
Authorization: Bearer <token>
```

### 回應格式

成功回應：
```json
{
  "success": true,
  "data": { ... }
}
```

錯誤回應：
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "錯誤訊息"
  }
}
```

---

## 核心類別 API

### LayoutMeasurer

測量頁面佈局尺寸的工具類。

#### 構造函數

```typescript
constructor(options?: LayoutMeasurerOptions)
```

**參數：**
- `options` (可選): 配置選項
  - `selectors`: 自訂選擇器
  - `defaults`: 預設值

**範例：**
```typescript
const measurer = new LayoutMeasurer({
  selectors: {
    sidebar: '.custom-sidebar',
    header: '.custom-header'
  },
  defaults: {
    sidebarWidth: 250,
    headerHeight: 70
  }
});
```

#### measure()

執行佈局測量。

```typescript
measure(): LayoutMeasurements
```

**返回值：**
```typescript
{
  viewport: { width: number; height: number };
  sidebar: {
    width: number;
    collapsed: boolean;
    collapsedWidth: number;
  };
  header: { height: number };
  footer: { height: number };
  contentPadding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
```

**範例：**
```typescript
const measurements = measurer.measure();
console.log('視窗寬度:', measurements.viewport.width);
console.log('Sidebar 寬度:', measurements.sidebar.width);
```

#### onLayoutChange()

監聽佈局變化。

```typescript
onLayoutChange(callback: (measurements: LayoutMeasurements) => void): void
```

**參數：**
- `callback`: 佈局變化時的回調函數

**範例：**
```typescript
measurer.onLayoutChange((newMeasurements) => {
  console.log('佈局已變化:', newMeasurements);
  // 更新 UI
});
```

#### dispose()

清理資源，停止監聽。

```typescript
dispose(): void
```

**範例：**
```typescript
// 組件卸載時清理
onUnmounted(() => {
  measurer.dispose();
});
```

---

### SizeCalculator

計算最佳 iframe 尺寸的工具類。

#### 構造函數

```typescript
constructor()
```

**範例：**
```typescript
const calculator = new SizeCalculator();
```

#### calculate()

計算最佳尺寸。

```typescript
calculate(
  measurements: LayoutMeasurements,
  options: CalculationOptions
): CalculatedSize
```

**參數：**
- `measurements`: 佈局測量結果
- `options`: 計算選項
  - `designRatio`: 設計比例（例如 16/9）
  - `fitMode`: 適應模式（'auto' | 'width-based' | 'height-based'）
  - `margins`: 自訂邊距

**返回值：**
```typescript
{
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
```

**範例：**
```typescript
const result = calculator.calculate(measurements, {
  designRatio: 16 / 9,
  fitMode: 'auto'
});

console.log('推薦尺寸:', result.width, 'x', result.height);
console.log('適應模式:', result.fitMode);
```

#### calculateAvailableSpace()

計算可用空間。

```typescript
calculateAvailableSpace(
  measurements: LayoutMeasurements
): { width: number; height: number }
```

**參數：**
- `measurements`: 佈局測量結果

**返回值：**
```typescript
{
  width: number;   // 可用寬度（px）
  height: number;  // 可用高度（px）
}
```

**範例：**
```typescript
const available = calculator.calculateAvailableSpace(measurements);
console.log('可用空間:', available.width, 'x', available.height);
```

#### calculateCenterMargins()

計算居中邊距。

```typescript
calculateCenterMargins(
  availableSpace: { width: number; height: number },
  contentSize: { width: number; height: number }
): { top: number; right: number; bottom: number; left: number }
```

**參數：**
- `availableSpace`: 可用空間尺寸
- `contentSize`: 內容尺寸

**返回值：**
```typescript
{
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

**範例：**
```typescript
const margins = calculator.calculateCenterMargins(
  { width: 1672, height: 918 },
  { width: 1632, height: 918 }
);
console.log('邊距:', margins);
// { top: 0, right: 20, bottom: 0, left: 20 }
```

---

### ConfigurationManager

管理配置的工具類。

#### 構造函數

```typescript
constructor(apiClient?: ApiClient)
```

**參數：**
- `apiClient` (可選): 自訂 API 客戶端

**範例：**
```typescript
const manager = new ConfigurationManager();
```

#### validateConfig()

驗證配置。

```typescript
validateConfig(config: IframeConfig): ValidationResult
```

**參數：**
- `config`: 要驗證的配置

**返回值：**
```typescript
{
  valid: boolean;
  errors: Array<{
    field: string;
    message: string;
  }>;
  warnings: Array<{
    field: string;
    message: string;
  }>;
}
```

**範例：**
```typescript
const validation = manager.validateConfig(config);

if (!validation.valid) {
  console.error('配置無效:', validation.errors);
  validation.errors.forEach(error => {
    console.log(`${error.field}: ${error.message}`);
  });
}

if (validation.warnings.length > 0) {
  console.warn('警告:', validation.warnings);
}
```

#### saveConfig()

儲存配置。

```typescript
async saveConfig(id: string, config: IframeConfig): Promise<void>
```

**參數：**
- `id`: 配置 ID
- `config`: 配置物件

**範例：**
```typescript
try {
  await manager.saveConfig('page-1', config);
  console.log('配置已儲存');
} catch (error) {
  console.error('儲存失敗:', error);
}
```

#### loadConfig()

載入配置。

```typescript
async loadConfig(id: string): Promise<IframeConfig>
```

**參數：**
- `id`: 配置 ID

**返回值：**
- Promise<IframeConfig>: 配置物件

**範例：**
```typescript
try {
  const config = await manager.loadConfig('page-1');
  console.log('配置已載入:', config);
} catch (error) {
  console.error('載入失敗:', error);
}
```

---

## 組件 API

### IframeComponent

iframe 顯示組件。

#### Props

```typescript
interface Props {
  config: IframeConfig;  // 配置物件
}
```

**範例：**
```vue
<IframeComponent :config="iframeConfig" />
```

#### Events

```typescript
// iframe 載入完成
@load: () => void

// iframe 載入錯誤
@error: (error: Error) => void

// 尺寸變化
@resize: (size: { width: number; height: number }) => void
```

**範例：**
```vue
<IframeComponent
  :config="config"
  @load="handleLoad"
  @error="handleError"
  @resize="handleResize"
/>
```

#### Slots

```typescript
// 載入中狀態
loading: () => VNode

// 錯誤狀態
error: (props: { error: Error; retry: () => void }) => VNode
```

**範例：**
```vue
<IframeComponent :config="config">
  <template #loading>
    <div>載入中...</div>
  </template>
  
  <template #error="{ error, retry }">
    <div>
      <p>載入失敗: {{ error.message }}</p>
      <button @click="retry">重試</button>
    </div>
  </template>
</IframeComponent>
```

---

### PreviewPanel

預覽面板組件。

#### Props

```typescript
interface Props {
  config: IframeConfig;              // 配置物件
  measurements: LayoutMeasurements;  // 測量結果
  calculatedSize: CalculatedSize;    // 計算結果
}
```

**範例：**
```vue
<PreviewPanel
  :config="config"
  :measurements="measurements"
  :calculated-size="calculatedSize"
/>
```

#### Events

```typescript
// Sidebar 切換
@toggle-sidebar: (collapsed: boolean) => void

// 配置變化
@config-change: (config: IframeConfig) => void
```

**範例：**
```vue
<PreviewPanel
  :config="config"
  :measurements="measurements"
  :calculated-size="calculatedSize"
  @toggle-sidebar="handleToggleSidebar"
  @config-change="handleConfigChange"
/>
```

---

### TemplateManager

範本管理組件。

#### Props

```typescript
interface Props {
  visible: boolean;  // 是否顯示
}
```

**範例：**
```vue
<TemplateManager :visible="showTemplateManager" />
```

#### Events

```typescript
// 載入範本
@load: (template: ConfigTemplate) => void

// 儲存範本
@save: (template: Omit<ConfigTemplate, 'id' | 'createdAt'>) => void

// 刪除範本
@delete: (id: string) => void

// 關閉
@close: () => void
```

**範例：**
```vue
<TemplateManager
  :visible="visible"
  @load="handleLoadTemplate"
  @save="handleSaveTemplate"
  @delete="handleDeleteTemplate"
  @close="handleClose"
/>
```

---

## HTTP API

### 範本管理

#### 創建範本

```http
POST /api/iframe-templates
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "標準 1080p 配置",
  "description": "適用於 1920x1080 螢幕的標準配置",
  "config": {
    "displayMode": "contain-center",
    "heightMode": "px",
    "heightValue": 918,
    ...
  }
}
```

**回應：**
```json
{
  "success": true,
  "data": {
    "id": "template-123",
    "message": "範本創建成功"
  }
}
```

**錯誤碼：**
- `400` - 請求參數錯誤
- `401` - 未授權
- `500` - 伺服器錯誤

---

#### 獲取範本

```http
GET /api/iframe-templates/:id
Authorization: Bearer <token>
```

**回應：**
```json
{
  "success": true,
  "data": {
    "id": "template-123",
    "name": "標準 1080p 配置",
    "description": "適用於 1920x1080 螢幕的標準配置",
    "config": { ... },
    "createdAt": "2025-01-08T10:00:00Z"
  }
}
```

**錯誤碼：**
- `404` - 範本不存在
- `401` - 未授權
- `500` - 伺服器錯誤

---

#### 列出範本

```http
GET /api/iframe-templates
Authorization: Bearer <token>
```

**查詢參數：**
- `page` (可選): 頁碼，預設 1
- `limit` (可選): 每頁數量，預設 20
- `search` (可選): 搜尋關鍵字

**回應：**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template-123",
        "name": "標準 1080p 配置",
        "description": "...",
        "createdAt": "2025-01-08T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5
    }
  }
}
```

---

#### 更新範本

```http
PUT /api/iframe-templates/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "更新的名稱",
  "description": "更新的描述",
  "config": { ... }
}
```

**回應：**
```json
{
  "success": true,
  "data": {
    "message": "範本更新成功"
  }
}
```

**錯誤碼：**
- `404` - 範本不存在
- `400` - 請求參數錯誤
- `401` - 未授權
- `500` - 伺服器錯誤

---

#### 刪除範本

```http
DELETE /api/iframe-templates/:id
Authorization: Bearer <token>
```

**回應：**
```json
{
  "success": true,
  "data": {
    "message": "範本刪除成功"
  }
}
```

**錯誤碼：**
- `404` - 範本不存在
- `401` - 未授權
- `500` - 伺服器錯誤

---

### 配置管理

#### 儲存配置

```http
PUT /api/gui-settings/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "DataContentJson": "{\"displayMode\":\"contain-center\",...}"
}
```

**回應：**
```json
{
  "success": true,
  "data": {
    "message": "配置儲存成功"
  }
}
```

---

#### 載入配置

```http
GET /api/gui-settings/:id
Authorization: Bearer <token>
```

**回應：**
```json
{
  "success": true,
  "data": {
    "Id": 1,
    "Name": "多迴路電表_4PB_4F",
    "Category": 5,
    "DataContentJson": "{\"displayMode\":\"contain-center\",...}"
  }
}
```

---

## 類型定義

### IframeConfig

```typescript
interface IframeConfig {
  // 顯示模式
  displayMode: 'contain-center' | 'stretch' | 'none';
  
  // 高度模式
  heightMode: 'px' | 'vh' | 'auto';
  
  // 高度值（當 heightMode 為 'px' 或 'vh' 時）
  heightValue?: number;
  
  // 設計解析度
  designResolution: {
    width: number;
    height: number;
  };
  
  // 邊距
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // 伺服器 URL
  serverUrl: string;
  
  // 視圖 URL
  viewUrl: string;
  
  // URL 模式
  urlMode?: 'select' | 'custom';
  
  // 元數據
  createdAt?: Date;
  updatedAt?: Date;
}
```

### LayoutMeasurements

```typescript
interface LayoutMeasurements {
  // 視窗尺寸
  viewport: {
    width: number;
    height: number;
  };
  
  // Sidebar 資訊
  sidebar: {
    width: number;
    collapsed: boolean;
    collapsedWidth: number;
  };
  
  // Header 資訊
  header: {
    height: number;
  };
  
  // Footer 資訊
  footer: {
    height: number;
  };
  
  // 內容區域 padding
  contentPadding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
```

### CalculatedSize

```typescript
interface CalculatedSize {
  // 計算出的寬度
  width: number;
  
  // 計算出的高度
  height: number;
  
  // 適應模式
  fitMode: 'width-based' | 'height-based';
  
  // 邊距
  margins: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  
  // 可用空間
  availableSpace: {
    width: number;
    height: number;
  };
}
```

### ConfigTemplate

```typescript
interface ConfigTemplate {
  // 範本 ID
  id: string;
  
  // 範本名稱
  name: string;
  
  // 範本描述
  description: string;
  
  // 配置物件
  config: IframeConfig;
  
  // 創建時間
  createdAt: Date;
  
  // 標籤
  tags?: string[];
}
```

### ValidationResult

```typescript
interface ValidationResult {
  // 是否有效
  valid: boolean;
  
  // 錯誤列表
  errors: ValidationError[];
  
  // 警告列表
  warnings: ValidationWarning[];
}

interface ValidationError {
  // 欄位名稱
  field: string;
  
  // 錯誤訊息
  message: string;
}

interface ValidationWarning {
  // 欄位名稱
  field: string;
  
  // 警告訊息
  message: string;
}
```

---

## 使用範例

### 完整流程範例

```typescript
import { LayoutMeasurer, SizeCalculator, ConfigurationManager } from '@/utils';

// 1. 測量佈局
const measurer = new LayoutMeasurer();
const measurements = measurer.measure();

// 2. 計算最佳尺寸
const calculator = new SizeCalculator();
const result = calculator.calculate(measurements, {
  designRatio: 16 / 9,
  fitMode: 'auto'
});

// 3. 創建配置
const config: IframeConfig = {
  displayMode: 'contain-center',
  heightMode: 'px',
  heightValue: result.height,
  designResolution: {
    width: 1920,
    height: 1080
  },
  margins: result.margins,
  serverUrl: 'http://localhost:2955',
  viewUrl: 'http://localhost:2955/#/view?name=meter_4PB_4F'
};

// 4. 驗證配置
const manager = new ConfigurationManager();
const validation = manager.validateConfig(config);

if (validation.valid) {
  // 5. 儲存配置
  await manager.saveConfig('page-1', config);
  console.log('配置已儲存');
} else {
  console.error('配置無效:', validation.errors);
}

// 6. 清理
measurer.dispose();
```

---

**文件版本：** 1.0  
**最後更新：** 2025-01-08  
**適用版本：** Oco.GUI plc-frontend v2.0+  
**維護者：** Oco.GUI 開發團隊
