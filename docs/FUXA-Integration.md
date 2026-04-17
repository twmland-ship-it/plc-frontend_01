# FUXA 整合指南（CCTV/RTSP 串流與警報）

版本：v2.2.35
最後更新：2025-09-15
維護者：前端（plc-frontend）團隊

---

## 目標
將現有系統的「CCTV 串流顯示／警報觸發彈窗」能力，無痛整合至 FUXA（SCADA）專案。本文彙整前後端原理、資料流、事件介面、整合方案與測試要點，供 FUXA 端 AI/開發者快速落地。

---

## 現況總覽（本專案）

- 前端技術：Vue 3 + Composition API、Ant Design Vue、SignalR
- CCTV 顯示：不直接在瀏覽器播放 rtsp://，而是後端抓取 RTSP 串流、轉為影像幀（bytes/base64），前端透過 SignalR 接收並以 <img> 顯示。
- 主要邏輯檔案：
  - 前端串流連線：src/composable/cctvConnection.js
  - CCTV 顯示元件：src/components/oco/util/cctvModal/Index.vue、main.js（對應 cctvStream）
  - Vuex 模組（觸發取流）：src/vuex/modules/cctv/actionCreator.js
  - 警報觸發彈窗：src/layout/withAdminLayout.vue、src/components/oco/alarm/Realtime.vue

---

## 核心資料流與介面

1) SignalR Hub（後端→前端推送影像）
- Hub URL：/api/Cctv（WebSocket）
- 註冊：connection.invoke("registerClientAsync", customerId, 999)
- 事件：receiveCctvImage(cctvId, bytes)
  - 前端收到後，組成 `data:image/RAW;base64,${bytes}` 顯示於 <img>

2) 啟動串流的 REST 觸發（前端→後端）
- GET /api/CCTV/images?CctvId=1&CctvId=2...
- 目的：告知後端開始推送這些 CCTV 的影像幀（非回傳串流本體）
- 行為：請求通常快速 200，之後由 SignalR 持續推送

3) 前端顯示元件 cctvStream（簡述）
- 掛載時：dispatch("cctv/getCCTVImage", [ids...]) → 呼叫上述 REST；再 `getCCTVImage(callback)` 綁定 SignalR 事件；事件抵達後將 base64 放進 reactive map → <img :src="..."/>

4) 警報頁/佈局層開窗（兩種觸發）
- 系統 > CCTV 管理頁：點擊列表「攝影機」icon → 開 sdModal → 內嵌 <cctvStream :cctv="[Id]"/>
- 即時警報：Alarm 觸發時，由 useTagInfo(newAlarm.ComponentId, "CctvList") 取得 Id 陣列，若不在暫停狀態，開 sdModal → 內嵌 <cctvStream :cctv="[...Ids]"/>

---

## 與 FUXA 的整合策略

推薦優先方案：FUXA 事件（click/mouseDown/mouseUp）＋ Open iframe

- 作法：在 FUXA 的圖形/按鈕事件設定中，使用「Open iframe」，URL 指向我方提供的「嵌入版 CCTV 檢視頁」，並在查詢參數傳入要顯示的 CCTV Id 列表。
- 優點：
  - 體驗好：不跳新視窗，直接在 FUXA 畫面顯示。
  - 成本低：FUXA 只需設定事件；我們前端新建一個極薄的嵌入頁即可重用既有串流與權限邏輯。
  - 可擴充：同一 iframe 可顯示多路畫面（ids=1,2,3），也能放大、縮放。

備選方案：Open Window
- 作法：同上，但以新視窗開啟 URL。
- 優缺：實作最簡單；體驗較差（彈新視窗、可能被阻擋）。

進階方案：FUXA 直接連我方 SignalR Hub
- 作法：FUXA 端以 JavaScript 建立 Hub 連線至 /api/Cctv，呼叫 registerClientAsync()，並綁定 receiveCctvImage 事件；同時對 /api/CCTV/images 發 GET 啟動取流。
- 優缺：可去除 iframe；但需處理認證、跨域、安全性等，且需在 FUXA 端重做顯示邏輯。

---

## 我方需提供的「嵌入版 CCTV 檢視頁」（建議）

- 路由：/embed/cctv?ids=1,2,3
- 行為：
  - 解析 querystring 取得 ids 陣列
  - 將 ids 傳給現有 <cctvStream :cctv="ids"/>
  - 沿用現有 SignalR 與 /api/CCTV/images 流程
- 視覺：最小 UI（無 Header/Aside），適合 iframe 內呈現；寬高由 FUXA 事件設定控制
- 認證：
  - 若 FUXA 與我方前端同網域且共享 Cookie，直接沿用會話
  - 若跨網域，建議 URL 攜帶短期 JWT/一次性 token（/embed/cctv?ids=...&token=...），我方頁面進入時驗證後啟動連線

---

## FUXA 端設定步驟（Open iframe）

1) 在設計器選取圖形或按鈕
2) 進入 Events → 新增事件（click 或 mouseDown/mouseUp）
3) Action 選擇：Open iframe
4) URL：
   - 範例（單一路）：https://your-frontend.example.com/embed/cctv?ids=123
   - 範例（多路）：https://your-frontend.example.com/embed/cctv?ids=123,456
   - 若需動態帶 Id，可用 FUXA 的資料綁定/腳本機制生成 URL
5) 設定 iframe 寬/高與縮放；可依你們的畫面需求調整

---

## 認證與安全性

- 同網域部署：
  - 共用 Cookie/Session 最簡單；確保 /api/Cctv（WebSocket）與 /api/CCTV/images 可被 iframe 內的頁面呼叫
- 跨網域部署：
  - CORS：允許 FUXA 來源；SignalR/WebSocket 需相容 CORS 設定
  - X-Frame-Options / CSP：允許 FUXA 網域嵌入
  - Token：建議使用短期 JWT 或一次性 token；避免長期 token 暴露於 URL
- 權限範圍：後端可依 token/客戶 ID 限制可訂閱的 CCTV Id 範圍

---

## 效能與穩定性建議

- 多路顯示：同時顯示的 CCTV 路數應據頻寬與 CPU 能力做上限；必要時在前端對影像幀更新做節流（如僅取最新、跳幀渲染）
- 斷線重試：SignalR 目前已設定 withAutomaticReconnect；請確認後端也具備錯誤容忍
- 清理機制：關閉或切換頁面時，應停止對無需的 CCTV Id 推送（可設計 /api/CCTV/stop?CctvId=... 或依連線狀態自動清理）

---

## 測試計畫（整合驗收）

1) 同網域情境（建議先驗）：
   - FUXA 事件 → Open iframe 指向 /embed/cctv?ids=xxx
   - 能成功開啟、數秒內開始看到畫面
   - 切換不同圖形（不同 Id）可正確顯示
2) 跨網域情境：
   - 帶 token 的 URL 能通過驗證後顯示；過期/錯誤 token 有明確錯誤
3) 多路顯示：ids=1,2,3 能同時出畫面
4) 異常：後端 RTSP 中斷時，前端提示與自動重試策略可運作

---

## 常見問題（FAQ）

- 為何不用 <video> 直接播 rtsp://？
  - 瀏覽器原生不支援 RTSP；本系統採「後端抓 RTSP → 前端收推送影像幀」架構。
- 可以改成 HLS 或 WebRTC 嗎？
  - 可以，但需後端提供 RTSP→HLS/WebRTC 的轉碼或中繼；前端再用 hls.js 或 WebRTC 播放器嵌入。這是架構升級，非此次最小整合範圍。

---

## 參考實作（檔案索引）

- SignalR 連線與事件：src/composable/cctvConnection.js
- 啟動推送的 REST：src/vuex/modules/cctv/actionCreator.js → getCCTVImage()
- 顯示元件（接收幀、<img> 呈現）：src/components/oco/util/cctvModal/Index.vue、main.js
- 警報觸發彈窗：src/layout/withAdminLayout.vue（openCCTVModal）、src/components/oco/alarm/Realtime.vue

---

## 建議後續任務（我方前端）

- 新增 /embed/cctv 嵌入頁與路由（讀取 ids，渲染 cctvStream），最小可用。
- 新增（選擇性）短期 token 驗證邏輯（跨網域需要）。
- README 增補「FUXA 整合」連結與操作說明。

---

## 附錄：時序（Mermaid）

```mermaid
sequenceDiagram
  participant F as FUXA
  participant I as Iframe: /embed/cctv
  participant FE as Frontend (Vue)
  participant SR as SignalR Hub /api/Cctv
  participant BE as Backend

  F->>I: Open iframe (/embed/cctv?ids=1,2)
  I->>FE: mount cctvStream([1,2])
  FE->>BE: GET /api/CCTV/images?CctvId=1&CctvId=2
  FE->>SR: start & registerClientAsync(customerId, 999)
  SR-->>FE: receiveCctvImage(1, bytes)
  FE-->>I: render <img src="data:image/RAW;base64,...">
  SR-->>FE: receiveCctvImage(2, bytes)
  FE-->>I: render <img ...>
```

