/**
 * iframe 自動適應增強功能 - TypeScript 類型定義
 * 
 * 本文件定義了 iframe 自動適應功能所需的所有接口和類型
 * 包含配置、測量、計算結果等核心數據結構
 */

// ==================== 基礎類型 ====================

/**
 * 視窗尺寸
 */
export interface ViewportSize {
  width: number;
  height: number;
}

/**
 * Sidebar 資訊
 */
export interface SidebarInfo {
  /** 當前寬度 */
  width: number;
  /** 是否收合 */
  collapsed: boolean;
  /** 收合後的寬度 */
  collapsedWidth: number;
}

/**
 * 固定元素資訊（Header、Footer 等）
 */
export interface FixedElementInfo {
  height: number;
}

/**
 * 邊距設定
 */
export interface Padding {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

// ==================== 測量相關 ====================

/**
 * 佈局測量結果
 * 包含視窗、Sidebar、Header、Footer 和內容邊距的測量數據
 */
export interface LayoutMeasurements {
  /** 視窗尺寸 */
  viewport: ViewportSize;
  /** Sidebar 資訊 */
  sidebar: SidebarInfo;
  /** Header 資訊 */
  header: FixedElementInfo;
  /** Footer 資訊 */
  footer: FixedElementInfo;
  /** 內容區域邊距 */
  contentPadding: Padding;
}

// ==================== 計算相關 ====================

/**
 * 計算選項
 */
export interface CalculationOptions {
  /** 設計比例（例如 16/9） */
  designRatio: number;
  /** 適應模式 */
  fitMode?: 'auto' | 'width-based' | 'height-based';
  /** 自訂邊距 */
  margins?: Padding;
}

/**
 * 計算結果
 * 包含計算出的 iframe 尺寸、適應模式、邊距和可用空間
 */
export interface CalculatedSize {
  /** 計算出的寬度 */
  width: number;
  /** 計算出的高度 */
  height: number;
  /** 實際使用的適應模式 */
  fitMode: 'width-based' | 'height-based';
  /** 計算出的邊距 */
  margins: Padding;
  /** 可用空間 */
  availableSpace?: {
    width: number;
    height: number;
  };
}

// ==================== 配置相關 ====================

/**
 * 顯示模式
 * - contain-center: 等比例置中
 * - stretch: 拉伸滿版
 * - none: 原尺寸
 */
export type DisplayMode = 'contain-center' | 'stretch' | 'none';

/**
 * 高度模式
 * - px: 固定像素
 * - vh: 視窗高度百分比
 * - auto: 自動（100%）
 */
export type HeightMode = 'px' | 'vh' | 'auto';

/**
 * URL 模式
 * - select: 從列表選擇
 * - custom: 自訂輸入
 */
export type UrlMode = 'select' | 'custom';

/**
 * 設計解析度
 */
export interface DesignResolution {
  width: number;
  height: number;
}

/**
 * iframe 配置
 * 主要配置模型，包含所有 iframe 顯示相關的設定
 */
export interface IframeConfig {
  // 基本設定
  /** 顯示模式 */
  displayMode: DisplayMode;
  /** 高度模式 */
  heightMode: HeightMode;
  /** 高度值（當 heightMode 為 px 或 vh 時使用） */
  heightValue?: number;
  
  // 設計解析度
  /** 設計解析度 */
  designResolution: DesignResolution;
  
  // 邊距設定
  /** 自訂邊距 */
  margins?: Padding;
  
  // URL 設定
  /** 伺服器 URL */
  serverUrl: string;
  /** 視圖 URL */
  viewUrl: string;
  /** URL 模式 */
  urlMode: UrlMode;
  
  // 相容性欄位（保留舊版本相容）
  /** iframe 適應模式（相容舊版） */
  iframeFit?: string;
  /** iframe 高度模式（相容舊版） */
  iframeHeightMode?: string;
  /** iframe 高度值（相容舊版） */
  iframeHeightValue?: number;
  /** iframe 配置物件（相容舊版） */
  iframe?: {
    fit: string;
    heightMode: string;
    heightValue?: number;
  };
  
  // 元數據
  /** 創建時間 */
  createdAt?: Date;
  /** 更新時間 */
  updatedAt?: Date;
}

// ==================== 範本相關 ====================

/**
 * 配置範本
 * 用於儲存和載入預設配置
 */
export interface ConfigTemplate {
  /** 範本 ID */
  id: string;
  /** 範本名稱 */
  name: string;
  /** 範本描述 */
  description: string;
  /** 配置內容 */
  config: IframeConfig;
  /** 創建時間 */
  createdAt: Date;
  /** 標籤（可選） */
  tags?: string[];
}

// ==================== 驗證相關 ====================

/**
 * 驗證錯誤
 */
export interface ValidationError {
  /** 欄位名稱 */
  field: string;
  /** 錯誤訊息 */
  message: string;
}

/**
 * 驗證警告
 */
export interface ValidationWarning {
  /** 欄位名稱 */
  field: string;
  /** 警告訊息 */
  message: string;
}

/**
 * 驗證結果
 */
export interface ValidationResult {
  /** 是否有效 */
  valid: boolean;
  /** 錯誤列表 */
  errors: ValidationError[];
  /** 警告列表 */
  warnings: ValidationWarning[];
}

// ==================== 介面定義 ====================

/**
 * 佈局測量器介面
 * 負責測量當前頁面佈局的各項尺寸
 */
export interface LayoutMeasurer {
  /**
   * 測量當前佈局
   * @returns 測量結果
   */
  measure(): LayoutMeasurements;
  
  /**
   * 監聽佈局變化
   * @param callback 變化時的回調函數
   */
  onLayoutChange(callback: (measurements: LayoutMeasurements) => void): void;
  
  /**
   * 停止監聽並清理資源
   */
  dispose(): void;
}

/**
 * 尺寸計算器介面
 * 負責根據測量結果計算最佳 iframe 尺寸
 */
export interface SizeCalculator {
  /**
   * 計算最佳尺寸
   * @param measurements 測量結果
   * @param options 計算選項
   * @returns 計算結果
   */
  calculate(
    measurements: LayoutMeasurements,
    options: CalculationOptions
  ): CalculatedSize;
  
  /**
   * 計算可用空間
   * @param measurements 測量結果
   * @returns 可用空間尺寸
   */
  calculateAvailableSpace(
    measurements: LayoutMeasurements
  ): { width: number; height: number };
  
  /**
   * 計算居中邊距
   * @param availableSpace 可用空間
   * @param contentSize 內容尺寸
   * @returns 居中邊距
   */
  calculateCenterMargins(
    availableSpace: { width: number; height: number },
    contentSize: { width: number; height: number }
  ): Padding;
}

/**
 * 配置管理器介面
 * 負責配置的儲存、載入和驗證
 */
export interface ConfigurationManager {
  /**
   * 載入配置
   * @param id 配置 ID
   * @returns 配置物件
   */
  loadConfig(id: string): Promise<IframeConfig>;
  
  /**
   * 儲存配置
   * @param id 配置 ID
   * @param config 配置物件
   */
  saveConfig(id: string, config: IframeConfig): Promise<void>;
  
  /**
   * 驗證配置
   * @param config 配置物件
   * @returns 驗證結果
   */
  validateConfig(config: IframeConfig): ValidationResult;
  
  /**
   * 儲存範本
   * @param template 範本物件（不含 id 和 createdAt）
   * @returns 範本 ID
   */
  saveTemplate(template: Omit<ConfigTemplate, 'id' | 'createdAt'>): Promise<string>;
  
  /**
   * 載入範本
   * @param id 範本 ID
   * @returns 範本物件
   */
  loadTemplate(id: string): Promise<ConfigTemplate>;
  
  /**
   * 列出所有範本
   * @returns 範本列表
   */
  listTemplates(): Promise<ConfigTemplate[]>;
  
  /**
   * 刪除範本
   * @param id 範本 ID
   */
  deleteTemplate(id: string): Promise<void>;
}

// ==================== 預設值 ====================

/**
 * 預設配置值
 */
export const DEFAULT_CONFIG: Readonly<IframeConfig> = {
  displayMode: 'contain-center',
  heightMode: 'px',
  heightValue: 918,
  designResolution: {
    width: 1920,
    height: 1080
  },
  margins: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  serverUrl: '',
  viewUrl: '',
  urlMode: 'select'
};

/**
 * 預設測量值（降級使用）
 */
export const DEFAULT_MEASUREMENTS: Readonly<LayoutMeasurements> = {
  viewport: {
    width: 1920,
    height: 1080
  },
  sidebar: {
    width: 200,
    collapsed: false,
    collapsedWidth: 64
  },
  header: {
    height: 64
  },
  footer: {
    height: 50
  },
  contentPadding: {
    top: 24,
    right: 24,
    bottom: 24,
    left: 24
  }
};

/**
 * 常見解析度預設
 */
export const COMMON_RESOLUTIONS: Readonly<DesignResolution[]> = [
  { width: 1920, height: 1080 },  // Full HD (16:9)
  { width: 1366, height: 768 },   // HD (16:9)
  { width: 2560, height: 1440 },  // 2K (16:9)
  { width: 3840, height: 2160 }   // 4K (16:9)
];
