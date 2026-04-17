-- =============================================
-- iframe 配置範本資料表
-- 用於儲存使用者自訂的 iframe 配置範本
-- =============================================

-- 檢查表是否已存在，如果存在則刪除
IF OBJECT_ID('dbo.IframeConfigTemplate', 'U') IS NOT NULL
    DROP TABLE dbo.IframeConfigTemplate;
GO

-- 創建 IframeConfigTemplate 表
CREATE TABLE dbo.IframeConfigTemplate (
    -- 主鍵：範本 ID
    Id INT PRIMARY KEY IDENTITY(1,1),
    
    -- 範本名稱（必填，最多 100 字元）
    Name NVARCHAR(100) NOT NULL,
    
    -- 範本描述（選填，最多 500 字元）
    Description NVARCHAR(500) NULL,
    
    -- 配置 JSON（必填，存儲完整的 IframeConfig 物件）
    ConfigJson NVARCHAR(MAX) NOT NULL,
    
    -- 標籤（選填，用於分類和搜尋，以逗號分隔）
    Tags NVARCHAR(200) NULL,
    
    -- 創建時間（自動設定為當前時間）
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    
    -- 更新時間（選填，用於追蹤最後修改時間）
    UpdatedAt DATETIME NULL,
    
    -- 創建者（選填，用於多用戶環境）
    CreatedBy NVARCHAR(100) NULL,
    
    -- 是否為系統預設範本（0: 用戶範本, 1: 系統範本）
    IsSystemTemplate BIT NOT NULL DEFAULT 0,
    
    -- 索引：加速按名稱搜尋
    INDEX IX_IframeConfigTemplate_Name NONCLUSTERED (Name),
    
    -- 索引：加速按創建時間排序
    INDEX IX_IframeConfigTemplate_CreatedAt NONCLUSTERED (CreatedAt DESC)
);
GO

-- 添加表註釋
EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', 
    @value = N'iframe 配置範本表，用於儲存使用者自訂的 iframe 顯示配置範本', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate';
GO

-- 添加欄位註釋
EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', @value = N'範本唯一識別碼', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate',
    @level2type = N'COLUMN', @level2name = N'Id';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', @value = N'範本名稱', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate',
    @level2type = N'COLUMN', @level2name = N'Name';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', @value = N'範本描述說明', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate',
    @level2type = N'COLUMN', @level2name = N'Description';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', @value = N'配置 JSON 字串（IframeConfig 物件）', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate',
    @level2type = N'COLUMN', @level2name = N'ConfigJson';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', @value = N'標籤（以逗號分隔）', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate',
    @level2type = N'COLUMN', @level2name = N'Tags';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', @value = N'創建時間', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate',
    @level2type = N'COLUMN', @level2name = N'CreatedAt';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', @value = N'更新時間', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate',
    @level2type = N'COLUMN', @level2name = N'UpdatedAt';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', @value = N'創建者', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate',
    @level2type = N'COLUMN', @level2name = N'CreatedBy';

EXEC sys.sp_addextendedproperty 
    @name = N'MS_Description', @value = N'是否為系統預設範本', 
    @level0type = N'SCHEMA', @level0name = N'dbo',
    @level1type = N'TABLE',  @level1name = N'IframeConfigTemplate',
    @level2type = N'COLUMN', @level2name = N'IsSystemTemplate';
GO

-- 插入系統預設範本
INSERT INTO dbo.IframeConfigTemplate (Name, Description, ConfigJson, Tags, IsSystemTemplate, CreatedBy)
VALUES 
(
    N'1920x1080 滿版居中',
    N'適用於 1920x1080 解析度的滿版居中顯示，保持 16:9 比例',
    N'{
        "displayMode": "contain-center",
        "heightMode": "auto",
        "heightValue": null,
        "designResolution": {
            "width": 1920,
            "height": 1080
        },
        "margins": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
        },
        "serverUrl": "",
        "viewUrl": "",
        "urlMode": "select"
    }',
    N'1920x1080,16:9,滿版,居中',
    1,
    N'System'
),
(
    N'1366x768 滿版居中',
    N'適用於 1366x768 解析度的滿版居中顯示，保持 16:9 比例',
    N'{
        "displayMode": "contain-center",
        "heightMode": "auto",
        "heightValue": null,
        "designResolution": {
            "width": 1366,
            "height": 768
        },
        "margins": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
        },
        "serverUrl": "",
        "viewUrl": "",
        "urlMode": "select"
    }',
    N'1366x768,16:9,滿版,居中',
    1,
    N'System'
),
(
    N'2560x1440 滿版居中',
    N'適用於 2560x1440 解析度的滿版居中顯示，保持 16:9 比例',
    N'{
        "displayMode": "contain-center",
        "heightMode": "auto",
        "heightValue": null,
        "designResolution": {
            "width": 2560,
            "height": 1440
        },
        "margins": {
            "top": 0,
            "right": 0,
            "bottom": 0,
            "left": 0
        },
        "serverUrl": "",
        "viewUrl": "",
        "urlMode": "select"
    }',
    N'2560x1440,16:9,滿版,居中',
    1,
    N'System'
);
GO

-- 驗證表創建成功
SELECT 
    'IframeConfigTemplate 表創建成功' AS Status,
    COUNT(*) AS SystemTemplateCount
FROM dbo.IframeConfigTemplate
WHERE IsSystemTemplate = 1;
GO
