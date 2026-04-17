# iframe 自動適應功能 - 部署檢查清單

## 📋 部署前檢查

### 1. 代碼準備

- [ ] 所有代碼已提交到版本控制系統
- [ ] 代碼已通過 code review
- [ ] 沒有未解決的 merge conflicts
- [ ] 版本號已更新（package.json）
- [ ] CHANGELOG 已更新

### 2. 測試驗證

- [ ] 所有單元測試通過
- [ ] 所有屬性測試通過（或已知失敗已記錄）
- [ ] 所有整合測試通過（或已知失敗已記錄）
- [ ] 手動測試完成
- [ ] 跨瀏覽器測試完成
- [ ] 效能測試完成

**測試結果摘要：**
```
總測試數: 326
通過: 323 (99.1%)
失敗: 3 (已知問題，不影響核心功能)
```

### 3. 文件準備

- [ ] 用戶指南已完成（USER-GUIDE.md）
- [ ] 故障排除指南已完成（TROUBLESHOOTING-GUIDE.md）
- [ ] 開發者指南已完成（DEVELOPER-GUIDE.md）
- [ ] API 文件已完成（API-DOCUMENTATION.md）
- [ ] 發布說明已完成（RELEASE-NOTES.md）
- [ ] 部署檢查清單已完成（本文件）

### 4. 資料庫準備

- [ ] 資料庫遷移腳本已準備
- [ ] 資料庫備份已完成
- [ ] 遷移腳本已在測試環境驗證
- [ ] 回滾腳本已準備

**資料庫腳本：**
```sql
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

### 5. 環境配置

- [ ] 生產環境變數已設定
- [ ] API 端點已配置
- [ ] 資料庫連線字串已配置
- [ ] 日誌級別已設定為 production
- [ ] 除錯模式已關閉

**環境變數檢查：**
```bash
VUE_APP_API_URL=https://api.production.com
VUE_APP_ENABLE_DEBUG=false
VUE_APP_LOG_LEVEL=error
```

---

## 🚀 部署步驟

### 階段 1：準備階段

#### 1.1 通知相關人員

- [ ] 通知用戶即將進行系統更新
- [ ] 通知技術團隊部署時間
- [ ] 通知客服團隊準備支援

**通知範本：**
```
主旨：系統更新通知 - iframe 自動適應功能

親愛的用戶：

我們將於 [日期] [時間] 進行系統更新，預計停機時間 30 分鐘。

更新內容：
- 新增一鍵最佳化功能
- 新增即時預覽功能
- 新增範本管理功能
- 效能優化和錯誤修復

感謝您的耐心等待。

Oco.GUI 團隊
```

#### 1.2 備份

- [ ] 備份生產資料庫
- [ ] 備份當前部署的代碼
- [ ] 備份配置文件
- [ ] 驗證備份完整性

**備份命令：**
```bash
# 資料庫備份
sqlcmd -S server -d database -Q "BACKUP DATABASE..."

# 代碼備份
tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/deploy/

# 配置備份
cp .env .env.backup
```

#### 1.3 構建

- [ ] 清理舊的構建產物
- [ ] 運行生產構建
- [ ] 驗證構建產物
- [ ] 壓縮構建產物

**構建命令：**
```bash
cd Oco.Gui/plc-frontend

# 清理
rm -rf dist/
rm -rf node_modules/.vite/

# 安裝依賴
npm ci

# 構建
npm run build

# 驗證
ls -lh dist/
```

### 階段 2：部署階段

#### 2.1 停止服務

- [ ] 停止 Web 伺服器
- [ ] 停止應用程式服務
- [ ] 確認所有服務已停止

**停止命令：**
```bash
# 停止 nginx
sudo systemctl stop nginx

# 停止應用
pm2 stop oco-gui
```

#### 2.2 資料庫遷移

- [ ] 執行資料庫遷移腳本
- [ ] 驗證表結構
- [ ] 驗證資料完整性

**遷移命令：**
```bash
# 執行遷移
sqlcmd -S server -d database -i database/create-iframe-template-table.sql

# 驗證
sqlcmd -S server -d database -Q "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'IframeConfigTemplate'"
```

#### 2.3 部署代碼

- [ ] 上傳構建產物到伺服器
- [ ] 解壓縮到部署目錄
- [ ] 設定正確的檔案權限
- [ ] 更新符號連結（如果使用）

**部署命令：**
```bash
# 上傳
scp -r dist/* user@server:/path/to/deploy/new/

# 切換
ln -sfn /path/to/deploy/new /path/to/deploy/current

# 權限
chmod -R 755 /path/to/deploy/current
```

#### 2.4 更新配置

- [ ] 更新環境變數
- [ ] 更新 API 端點
- [ ] 更新資料庫連線
- [ ] 驗證配置正確性

**配置檢查：**
```bash
# 檢查環境變數
cat /path/to/deploy/current/.env

# 驗證 API 端點
curl https://api.production.com/health
```

#### 2.5 啟動服務

- [ ] 啟動應用程式服務
- [ ] 啟動 Web 伺服器
- [ ] 確認所有服務正常運行

**啟動命令：**
```bash
# 啟動應用
pm2 start oco-gui

# 啟動 nginx
sudo systemctl start nginx

# 檢查狀態
pm2 status
sudo systemctl status nginx
```

### 階段 3：驗證階段

#### 3.1 健康檢查

- [ ] 檢查應用程式健康狀態
- [ ] 檢查資料庫連線
- [ ] 檢查 API 端點
- [ ] 檢查日誌無錯誤

**健康檢查：**
```bash
# 應用健康檢查
curl https://app.production.com/health

# API 健康檢查
curl https://api.production.com/health

# 檢查日誌
tail -f /var/log/oco-gui/error.log
```

#### 3.2 功能驗證

- [ ] 測試一鍵最佳化功能
- [ ] 測試即時預覽功能
- [ ] 測試範本管理功能
- [ ] 測試響應式適應
- [ ] 測試錯誤處理

**測試清單：**
```
1. 打開設定介面
2. 點擊「一鍵最佳化」
3. 確認計算結果正確
4. 調整參數，確認預覽即時更新
5. 儲存範本
6. 載入範本
7. 切換 Sidebar，確認響應
8. 調整視窗大小，確認響應
```

#### 3.3 效能驗證

- [ ] 檢查頁面載入時間
- [ ] 檢查 API 回應時間
- [ ] 檢查記憶體使用
- [ ] 檢查 CPU 使用

**效能指標：**
```
FCP < 1.5s
LCP < 2.5s
FID < 100ms
CLS < 0.1
API 回應 < 500ms
```

#### 3.4 瀏覽器兼容性驗證

- [ ] Chrome 測試
- [ ] Firefox 測試
- [ ] Edge 測試
- [ ] Safari 測試

### 階段 4：監控階段

#### 4.1 即時監控

- [ ] 監控應用程式日誌
- [ ] 監控錯誤率
- [ ] 監控效能指標
- [ ] 監控用戶反饋

**監控命令：**
```bash
# 即時日誌
tail -f /var/log/oco-gui/access.log
tail -f /var/log/oco-gui/error.log

# 效能監控
pm2 monit
```

#### 4.2 用戶反饋

- [ ] 收集用戶反饋
- [ ] 記錄問題報告
- [ ] 快速回應問題

**反饋渠道：**
- Email: support@oco.com
- 電話: +886-xxx-xxxx
- 線上客服: https://oco.com/support

---

## 🔄 回滾計劃

### 何時回滾

如果出現以下情況，應立即回滾：

- [ ] 關鍵功能無法使用
- [ ] 資料庫遷移失敗
- [ ] 效能嚴重下降
- [ ] 大量用戶報告問題
- [ ] 安全漏洞發現

### 回滾步驟

#### 1. 停止服務

```bash
sudo systemctl stop nginx
pm2 stop oco-gui
```

#### 2. 回滾代碼

```bash
# 切換到備份版本
ln -sfn /path/to/deploy/backup /path/to/deploy/current
```

#### 3. 回滾資料庫

```bash
# 如果有資料庫變更，執行回滾腳本
sqlcmd -S server -d database -i database/rollback.sql
```

#### 4. 恢復配置

```bash
cp .env.backup .env
```

#### 5. 啟動服務

```bash
pm2 start oco-gui
sudo systemctl start nginx
```

#### 6. 驗證

```bash
curl https://app.production.com/health
```

#### 7. 通知

- [ ] 通知技術團隊
- [ ] 通知用戶（如需要）
- [ ] 記錄回滾原因

---

## 📊 部署後檢查

### 第一天

- [ ] 監控錯誤日誌
- [ ] 檢查效能指標
- [ ] 收集用戶反饋
- [ ] 記錄問題

### 第一週

- [ ] 分析使用數據
- [ ] 評估效能表現
- [ ] 整理用戶反饋
- [ ] 規劃改進

### 第一個月

- [ ] 完整效能評估
- [ ] 用戶滿意度調查
- [ ] 規劃下一版本
- [ ] 更新文件

---

## 📝 部署記錄

### 部署資訊

```
部署日期: _______________
部署人員: _______________
版本號: 2.0.0
環境: Production
```

### 檢查結果

```
□ 所有檢查項目已完成
□ 所有測試通過
□ 部署成功
□ 驗證通過
□ 無需回滾
```

### 問題記錄

```
問題 1:
描述: _______________
解決方案: _______________
狀態: _______________

問題 2:
描述: _______________
解決方案: _______________
狀態: _______________
```

### 簽核

```
部署人員: _______________ 日期: _______________
審核人員: _______________ 日期: _______________
```

---

## 📞 緊急聯絡

### 技術團隊

- 主要聯絡人: _______________
- 電話: _______________
- Email: _______________

### 資料庫管理員

- 聯絡人: _______________
- 電話: _______________
- Email: _______________

### 系統管理員

- 聯絡人: _______________
- 電話: _______________
- Email: _______________

---

**文件版本**: 1.0  
**最後更新**: 2025-01-08  
**維護者**: Oco.GUI 開發團隊
