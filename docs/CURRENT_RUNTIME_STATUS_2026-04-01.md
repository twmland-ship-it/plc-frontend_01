# plc-frontend / Product-002 當前狀態紀錄

> 更新時間：2026-04-01  
> 範圍：`Frontend/plc-frontend` + `Backend/Oco.Product-002/Oco.Product-002.Api`  
> 目的：記錄目前正在使用的本機啟動方式、前後端鏈路、已確認修正、未完成事項、整體設計與接手注意事項。

## 0. 專案群總覽與目前狀態

### 0.1 常用專案與角色

| 專案 | 路徑 | 角色 | 典型入口 |
|---|---|---|---|
| `plc-frontend` | `Frontend/plc-frontend` | PLC/Web Scada 前端 | `http://localhost:8345` |
| `Oco.Product-002.Api` | `Backend/Oco.Product-002/Oco.Product-002.Api` | PLC 前端 API / Login / Tag / Dashboard / SignalR | `http://localhost:5170` |
| `Oco.Gui` Server | `Frontend/Oco.Gui/Oco.Gui/server` | GUI 後端 / CMS 代理來源 | `http://localhost:2955` |
| `Oco.Gui.Cms` | `Frontend/Oco.Gui.Cms` | CMS 外殼與代理 | `http://localhost:5560` |
| `Oco.Backend.AppHost` | `Backend/Oco.Backend.AppHost` | Aspire 統一編排入口 | `http://localhost:15888` |
| `Oco.LogCenter.Api` | 由 AppHost 編排 | 中央日誌 / 狀態 | `http://localhost:7000` |
| `Oco.Admin` | Docker 由 AppHost/手動啟動 | 多租戶管理後台 | `http://localhost:8350` |

### 0.2 目前這台機器的 runtime 狀態

依本次檢查，目前監聽中的埠如下：

| Port | 狀態 | 用途 | 備註 |
|---|---|---|---|
| `2955` | Running | `Oco.Gui` Server | 本機程序 |
| `5170` | Running | `Oco.Product-002.Api` | 本機程序 |
| `5560` | Running | `Oco.Gui.Cms` | 本機程序 |
| `7000` | Running | LogCenter | 由 Aspire / AppHost 編排 |
| `8345` | Running | `plc-frontend` | **本機 Vue CLI dev server**，非 Docker |
| `8350` | Running | `Oco.Admin` | Docker 容器 |
| `15888` | Running | Aspire Dashboard | AppHost |

目前容器狀態：
- `oco-lu-oco-admin`：Running
- `oco-lu-rabbitmq`：Running
- `oco-lu-plc-frontend`：**已移除，不再使用**

### 0.3 目前建議使用的主線

目前真正正在 debug 的主線是：

```text
plc-frontend (localhost:8345, 本機 dev server)
  -> proxy
  -> Oco.Product-002.Api (localhost:5170)
```

CMS / GUI / Aspire 目前可視為平行子系統，除非要驗證跨系統代理或編排，否則不要混在同一輪一起改。

## 1. 目前權威子系統

### 前端
- 路徑：`oco-Syetem/Frontend/plc-frontend/`
- 技術：Vue 3 + Vuex + Vue Router + Ant Design Vue + Vue CLI
- 目前使用模式：**本機 dev server**
- 目前入口網址：`http://localhost:8345`
- 目前狀態：**不再使用 `oco-lu-plc-frontend` Docker 容器**

### 後端
- 路徑：`oco-Syetem/Backend/Oco.Product-002/Oco.Product-002.Api/`
- 技術：ASP.NET Core / .NET 8 / PostgreSQL
- 目前 API 埠：`http://localhost:5170`
- 目前模式：直接執行本機 `dotnet run -c Debug`

## 2. 目前有效啟動方式

### 前端啟動
工作目錄：

```powershell
D:\Project\Lu-Project\oco-Syetem\Frontend\plc-frontend
```

目前使用指令：

```powershell
npm run serve -- --port 8345
```

說明：
- 專案原始預設 dev port 是 `8080`
- 因現場使用習慣需要維持 `http://localhost:8345`
- 所以目前改為 **本機 dev server 直接綁 8345**
- 這不是 Docker/nginx 8345，而是 Vue CLI dev server 8345

### 其他常用專案啟動方式

#### `Oco.Product-002.Api`

工作目錄：

```powershell
D:\Project\Lu-Project\oco-Syetem\Backend\Oco.Product-002\Oco.Product-002.Api
```

啟動：

```powershell
dotnet run -c Debug
```

說明：
- 目前固定 API 埠是 `5170`
- `plc-frontend` 的 `/api/*` 會 proxy 到這裡
- 若要重新編譯，先停掉執行中的 `Oco.Product-002.Api.exe`

#### `Oco.Gui` Server

工作目錄：

```powershell
D:\Project\Lu-Project\oco-Syetem\Frontend\Oco.Gui\Oco.Gui\server
```

典型啟動：

```powershell
$env:LOGCENTER_URL='http://localhost:7000'
node main.js
```

說明：
- 對外埠 `2955`
- CMS `5560` 主要代理來源是這個服務

#### `Oco.Gui.Cms`

工作目錄：

```powershell
D:\Project\Lu-Project\oco-Syetem\Frontend\Oco.Gui.Cms
```

標準流程：

```powershell
pnpm build
$env:LOGCENTER_URL='http://localhost:7000'
node cms-launcher.js
```

說明：
- 對外埠 `5560`
- 有改 `app/apps/web-antd` 時，**一定先 build 再重啟**

#### `Oco.Backend.AppHost` / Aspire

工作目錄：

```powershell
D:\Project\Lu-Project\oco-Syetem\Backend\Oco.Backend.AppHost
```

直接啟動：

```powershell
dotnet run --launch-profile http
```

建議腳本方式：

```powershell
cd D:\Project\Lu-Project\oco-Syetem
.\start-site.ps1 -Profile aspire-backend
```

或：

```powershell
.\start-site.ps1 -Profile aspire-cms-gui
```

#### `Oco.Admin`

目前狀態：
- 目前由 Docker 容器提供，對外 `http://localhost:8350`
- 容器名稱：`oco-lu-oco-admin`

若要走 AppHost / Docker 編排，請依 `Backend/Oco.Backend.AppHost/README.md` 與對應 Dockerfile。

### 後端啟動
工作目錄：

```powershell
D:\Project\Lu-Project\oco-Syetem\Backend\Oco.Product-002\Oco.Product-002.Api
```

目前使用指令：

```powershell
dotnet run -c Debug
```

對外 API：

```text
http://localhost:5170
```

### 目前前後端鏈路

```text
Browser (localhost:8345)
  -> Vue CLI dev server proxy
  -> /api/* rewrite 去掉 /api
  -> Product-002 API (localhost:5170)
```

SignalR / WebSocket：
- `ws://localhost:5170/AlarmSummary`
- `ws://localhost:5170/Cctv`
- `ws://localhost:5170/PageTag`（依前端設定與實際頁面使用）

## 2.1 `start-site.ps1` 可用設定檔

`oco-Syetem/start-site.ps1` 目前可用的 profile：

| Profile | 內容 |
|---|---|
| `cms-gui` | LogCenter + ProtectionApi + GUI Server (`2955`) + CMS (`5560`) |
| `cms-scada` | CMS / Scada 線（依腳本設定） |
| `plc-gui` | LogCenter + GUI Server (`2955`) + `plc-frontend` |
| `aspire-backend` | Aspire AppHost（含 LogCenter `7000` + Dashboard `15888`），不含 GUI/CMS |
| `aspire-cms-gui` | Aspire AppHost + GUI (`2955`) + CMS (`5560`) |

說明：
- 若要完整後端堆疊，**優先用 AppHost**
- 若只要現在這條 `plc-frontend + Product-002.Api`，可直接手動起 `8345 + 5170`
- 不要一邊用 AppHost 起 LogCenter，一邊再獨立 `dotnet run Oco.LogCenter.Api`

## 2.2 Aspire 相關資訊

### Aspire 版本
- 目前文件記錄版本：**Aspire 13.2.0**

### 主要入口
- Dashboard：`http://localhost:15888`
- LogCenter：`http://localhost:7000`

### 目前與本案關聯最深的 Aspire 資源
- `product-002-api`
- `product-002-service`
- `logcenter-api`
- `plc-frontend`（AppHost 內是 Docker 模式，與本次本機 8345 模式不同）
- `oco-admin`
- `rabbitmq`

### 本案要特別注意
- AppHost 內的 `plc-frontend` 是 **Docker 8345**
- 本次 debug 主線改成 **本機 dev server 8345**
- 兩者執行來源不同，但都可能佔用同一個對外網址
- 因此接手時一定先確認 `8345` 到底是：
  - Docker 容器
  - 還是本機 `npm run serve -- --port 8345`

## 3. 已確認完成的修正

### 3.1 本機 8345 登入 proxy 逾時已修正

問題：
- 原本 `plc-frontend/.env` 將 `VUE_APP_API_ENDPOINT` 指向 `http://192.168.1.152:8345/`
- 本機前端改跑 `8345` 後，登入請求會被 proxy 到遠端 IP，造成：

```text
Proxy error: Could not proxy request /Staff/StaffLogin from localhost:8345 to http://192.168.1.152:8345/ (ETIMEDOUT)
```

已修正：
- `VUE_APP_API_ENDPOINT="http://localhost:5170/"`
- `VUE_APP_FRONTEND_URL="http://localhost:8345/"`

結論：
- `8345 -> 5170` 的前後端代理鏈路目前已正常

### 3.2 Docker 前端容器已退出目前工作流

已執行：
- 移除 `oco-lu-plc-frontend`
- 不再以 Docker 容器提供 `plc-frontend`

保留：
- `oco-lu-oco-admin`
- `rabbitmq`

目前前端來源：
- **只看本機專案 `plc-frontend`**

### 3.3 `StaffLogin` 已確認可成功

runtime 證據顯示：
- `StaffLogin` 可成功解析 `Account / Password / IdName`
- 可找到租戶
- 可找到 staff
- 可找到 role
- 前端也可收到 `Detail`

已確認成功鏈路：

```text
POST /api/Staff/StaffLogin
-> proxy rewrite
-> POST http://localhost:5170/Staff/StaffLogin
-> 200
```

因此目前**登入本身不是主要故障點**。

## 4. 目前未解決的主要問題

### 4.1 登入後首頁前端例外

目前最主要未完成問題：

```text
TypeError: Cannot read properties of undefined (reading 'Data')
```

出錯位置：
- `Frontend/plc-frontend/src/view/oco/home/index.js`

目前已知觀察：
- 登入成功後會導向首頁
- 首頁在載入 dashboard/chart 資料時崩潰
- 不是 `StaffLogin` 失敗，而是**登入後首頁 render/data shape 假設錯誤**

### 4.2 疑似根因方向

目前最強假設有兩條：

1. `dashboard/getDashboard` 的歷史資料結果中，`param.detail[0]` 存在但沒有 `Data`
2. `param.detail` 本身是空陣列，但 `home/index.js` 直接讀 `detail[0].Data`

目前相關危險讀取：

```js
labels = data[0].detail[0].Data.map(...)
const datas = param.detail[0].Data.map(...)
```

若 API shape 稍有不同，就會直接炸掉。

## 5. 目前已加的 debug instrumentation

### 保留中的 dashboard / home 探針

目前仍保留的調查點：

#### `Frontend/plc-frontend/src/vuex/modules/dashboard/actionCreator.js`
- 在 dashboard 歷史資料 API 回來後，記錄：
  - `chartName`
  - `paramName`
  - `tagCount`
  - 第一筆 tag 的 keys
  - 第一筆 tag 是否有 `Data`

#### `Frontend/plc-frontend/src/view/oco/home/index.js`
- 在 `fetchLineChart()` 讀 `detail[0].Data` 前，記錄：
  - 每個 series 的 `detailCount`
  - 第一筆 detail keys
  - 第一筆 detail 是否有 `Data`

### 已移除的登入探針

先前為了調查登入問題加過：
- `auth/actionCreator.js`
- `oco/auth/signIn/index.js`
- `StaffController.cs`
- `StaffLoginLogic.cs`

在 runtime 證明「登入可成功」後，這批探針已移除，避免干擾後續判讀。

## 6. 目前整體設計理解

### 6.1 前端層

`plc-frontend` 主要扮演：
- UI 顯示層
- Vuex 資料彙整層
- 路由與權限控制層
- 對 Product-002 API / SignalR 的前端代理入口

重要特性：
- `/auth/:id?` 登入路由支援租戶識別碼
- `brand_id` / `customer_id` 會存於 localStorage
- `/api/*` 經 dev server proxy 轉發到 Product-002 API
- Dashboard 首頁會拉 `GetFirstPageItemContent` 與統計資料，並把結果重組成圖表可用格式

### 6.2 後端層

`Oco.Product-002.Api` 目前負責：
- `StaffLogin`
- Tag / Region / Device / CCTV 等 API
- Dashboard 首頁內容 API
- SignalR hubs

目前與前端直接相關的固定埠：
- HTTP API: `5170`

### 6.3 租戶與登入設計

目前已知設計：
- 登入以 `IdName` 作為租戶識別入口
- 前端登入 action 會優先取：
  1. route `id`
  2. localStorage `brand_id`
- 登入成功後會回存：
  - `access_token`
  - `refresh_token`
  - `brand_id`
  - `customer_id`
  - `userData`
  - `permission`

### 6.4 Dashboard 設計

目前 dashboard 流程是：

```text
首頁 mounted
  -> dispatch("dashboard/getDashboard")
  -> /api/System/GetFirstPageItemContent
  -> 解析 PageItemDetail.DataContentJson
  -> 依每個圖表設定再打統計 API
  -> 將結果組成 data/detail/summary 結構
  -> 各 chart renderer（line/pie/bar/text）再依自己的假設取值
```

目前風險最大處：
- renderer 假設 API 回傳一定有 `detail[0].Data`
- 但實際資料型態可能依圖表類型、時段、資料缺值而不同

## 7. 現在的建議接手順序

若要從這份文件直接接續處理，建議順序如下：

1. 先啟動後端 `Oco.Product-002.Api`，確認 `5170` 正常
2. 再啟動前端 `plc-frontend`，確認 `8345` 正常
3. 登入系統，確認登入不是問題
4. 直接觀察首頁 dashboard
5. 讀 `debug-03a304.log`
6. 判斷 `detail[0].Data` 缺失點來自：
   - API shape
   - 前端資料轉換
   - renderer 假設過強
7. 只在有證據時才修 `home/index.js` 的資料防護或轉換邏輯

## 8. 目前啟動檢查清單

### 前端
- [ ] `npm run serve -- --port 8345`
- [ ] `http://localhost:8345` 可開
- [ ] console 不應再出現登入 proxy `ETIMEDOUT`

### 後端
- [ ] `dotnet run -c Debug`
- [ ] `http://localhost:5170/swagger/index.html` 回 `200`
- [ ] `StaffLogin` 可回 `200`

### 鏈路
- [ ] 前端 `/api/*` 確實打到 `localhost:5170`
- [ ] `AlarmSummary` / `Cctv` WebSocket 連線成功

### 其他專案
- [ ] `http://localhost:2955` 可開或至少 API 可回應（GUI Server）
- [ ] `http://localhost:5560` 可開（CMS）
- [ ] `http://localhost:7000` 可開（LogCenter）
- [ ] `http://localhost:15888` 可開（Aspire Dashboard）
- [ ] `http://localhost:8350` 可開（Oco.Admin，若容器仍在）

## 9. 當前重要檔案

### 前端關鍵檔案
- `Frontend/plc-frontend/.env`
- `Frontend/plc-frontend/customize-vue-config.js`
- `Frontend/plc-frontend/src/routes/authRoutes.js`
- `Frontend/plc-frontend/src/routes/protectedRoute.js`
- `Frontend/plc-frontend/src/view/oco/auth/signIn/index.js`
- `Frontend/plc-frontend/src/vuex/modules/auth/actionCreator.js`
- `Frontend/plc-frontend/src/vuex/modules/dashboard/actionCreator.js`
- `Frontend/plc-frontend/src/view/oco/home/index.js`

### 後端關鍵檔案
- `Backend/Oco.Product-002/Oco.Product-002.Api/Controllers/StaffController.cs`
- `Backend/Oco.Product-002/Oco.Product-002.Api/BusinessLogic/StaffLogic/StaffLoginLogic.cs`

## 10. 與 CHANGELOG 的對應

目前已明確關聯的案例：
- `#248`：本機 8345 登入 proxy 逾時，改回 `localhost:5170`
- `#242`：多租戶登入入口與 `idName`
- `#241`：登入後權限/側欄快照問題
- `#239`：`/api/Staff/StaffLogin` rewrite
- `#238`：Docker 模式下 `StaffLogin` 問題與種子

目前首頁 dashboard 新問題尚未正式寫成新條目，等 root cause 確認後再新增。

## 11. 一句話總結

目前系統狀態是：

> **前端已改回本機 `8345`、後端 API 已固定 `5170`、登入鏈路已確認成功；真正剩餘問題是登入後首頁 dashboard 對歷史資料 shape 的假設過強，導致 `detail[0].Data` 為 `undefined` 時前端直接崩潰。**

## 12. 接手者快速判讀

若剛接手這份專案，先回答這四件事：

1. `8345` 現在是 Docker 還是本機 dev server？
2. `5170` 的 `Oco.Product-002.Api` 是否正在跑？
3. `7000` / `15888` 是否由 Aspire / AppHost 提供？
4. 目前要修的是：
   - 登入鏈路
   - Dashboard 首頁
   - GUI/CMS 代理
   - 或 AppHost 編排

只要這四題先釐清，就能避免改錯子系統或啟錯服務。
