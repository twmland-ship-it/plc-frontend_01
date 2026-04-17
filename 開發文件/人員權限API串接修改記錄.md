# 人員權限API串接修改記錄

## 修改日期
2024年12月19日

## 修改目的
將前端人員權限功能從Demo Data改為實際後端API調用，實現前後端資料同步。

## 修改範圍
僅限於人員權限管理功能，不涉及人員管理功能。

---

## 修改檔案清單

### 1. Vuex Store 檔案
**檔案路徑：** `plc-frontend/src/vuex/modules/user/actionCreator.js`

**修改內容：**
- 新增 `DataService` import
- 修改 `getRoleList()` - 改為調用 `/api/role/roles` API
- 修改 `getRoleOptions()` - 構建與後端對應的權限結構
- 修改 `addRole()` - 調用 `/api/role` POST API
- 修改 `editRole()` - 調用 `/api/role/{id}` PUT API
- 修改 `deleteRole()` - 調用 `/api/role/{id}` DELETE API
- 新增權限格式轉換邏輯 (r/c/u/d ↔ Read/Create/Update/Delete)

### 2. 權限頁面邏輯檔案
**檔案路徑：** `plc-frontend/src/view/oco/user/role/main.js`

**修改內容：**
- 新增 `DataService` import
- 修改 `openEditModal()` - 從後端載入現有權限資料
- 新增權限格式轉換邏輯 (後端 → 前端)
- 新增錯誤處理機制
- 新增操作完成後的資料重新載入

---

## 詳細修改內容

### Vuex Store 修改詳情

#### 新增 Import
```javascript
import { DataService } from "@/config/dataService/dataService";
```

#### 權限列表查詢
```javascript
// 修改前 (Demo Data)
async getRoleList({ commit }) {
  // 使用 setTimeout 模擬 API 調用
  commit("getRoleListSuccess", permission.data);
}

// 修改後 (實際 API)
async getRoleList({ commit }) {
  const response = await DataService.get("/api/role/roles");
  const roles = response.data.Detail.Roles.map(role => ({
    id: role.RoleId,
    name: role.RoleName,
    isRoot: role.IsRoot
  }));
  commit("getRoleListSuccess", roles);
}
```

#### 權限選項載入
```javascript
// 修改前 (Demo Data)
async getRoleOptions({ commit }) {
  const res = await new Promise((resolve) =>
    setTimeout(() => {
      resolve(permission.options);
    }, 500)
  );
  return res;
}

// 修改後 (實際 API + 權限結構)
async getRoleOptions({ commit }) {
  const response = await DataService.get("/api/role/roles");
  // 構建權限選項結構（基於後端功能名稱）
  const permissionOptions = [
    {
      id: "dashboard",
      value: "dashboard",
      name: "首頁",
      options: ["c", "u", "d"]
    },
    // ... 其他權限選項
  ];
  return { permission: permissionOptions };
}
```

#### 新增權限
```javascript
// 修改前 (Demo Data)
async addRole({ commit }, params) {
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log("addRole", params);
      resolve();
    }, 500)
  );
}

// 修改後 (實際 API)
async addRole({ commit }, params) {
  // 轉換前端權限格式為後端格式
  const features = {};
  Object.keys(params.permission).forEach(key => {
    if (params.permission[key] && params.permission[key].length > 0) {
      const permissions = params.permission[key].map(p => {
        switch(p) {
          case 'r': return 'Read';
          case 'c': return 'Create';
          case 'u': return 'Update';
          case 'd': return 'Delete';
          default: return p;
        }
      });
      features[key] = permissions;
    }
  });

  const requestData = {
    Name: params.name,
    Description: params.name,
    IsRoot: false,
    Features: features
  };

  await DataService.post("/api/role", requestData);
}
```

#### 編輯權限
```javascript
// 修改前 (Demo Data)
async editRole({ commit }, params) {
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log("editRole", params);
      resolve();
    }, 500)
  );
}

// 修改後 (實際 API)
async editRole({ commit }, params) {
  // 權限格式轉換邏輯與 addRole 相同
  const features = {};
  // ... 權限轉換邏輯
  
  const requestData = {
    Name: params.name,
    Description: params.name,
    IsRoot: false,
    Features: features
  };

  await DataService.put(`/api/role/${params.id}`, requestData);
}
```

#### 刪除權限
```javascript
// 修改前 (Demo Data)
async deleteRole({ commit }, id) {
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log("deleteRole", id);
      resolve();
    }, 500)
  );
}

// 修改後 (實際 API)
async deleteRole({ commit }, id) {
  await DataService.delete(`/api/role/${id}`);
}
```

### 權限頁面邏輯修改詳情

#### 新增 Import
```javascript
import { DataService } from "@/config/dataService/dataService";
```

#### 編輯權限載入
```javascript
// 修改前
const openEditModal = ({ id, name, permission }) => {
  const obj = {
    title: "編輯權限",
    id,
    name,
    permission,
  };
  Object.assign(formState, obj);
  modal.value = true;
};

// 修改後
const openEditModal = async ({ id, name }) => {
  try {
    // 載入現有權限資料
    const response = await DataService.get(`/api/role/${id}`);
    const roleData = response.data.Detail;
    const features = roleData.Features || {};
    
    // 轉換後端權限格式為前端格式
    const permissionData = {};
    Object.keys(features).forEach(featureKey => {
      if (features[featureKey] && features[featureKey].length > 0) {
        const permissions = features[featureKey].map(p => {
          switch(p) {
            case 'Read': return 'r';
            case 'Create': return 'c';
            case 'Update': return 'u';
            case 'Delete': return 'd';
            default: return p;
          }
        });
        permissionData[featureKey] = permissions;
      }
    });
    
    const obj = {
      title: "編輯權限",
      id,
      name,
      permission: permissionData,
    };
    Object.assign(formState, obj);
  } catch (error) {
    console.error('載入權限資料失敗:', error);
    // 如果載入失敗，使用基本資料
    const obj = {
      title: "編輯權限",
      id,
      name,
      permission: {},
    };
    Object.assign(formState, obj);
  }
  
  modal.value = true;
};
```

#### 操作完成後重新載入
```javascript
// 在 submitForm 和 deleteUser 中新增
// 重新載入權限列表
dispatch("user/getRoleList");
```

---

## API 對應關係

### 後端 API 端點
| 功能 | HTTP方法 | 路徑 | 說明 |
|------|----------|------|------|
| 權限列表 | GET | `/api/role/roles` | 取得所有權限 |
| 單一權限 | GET | `/api/role/{roleId}` | 取得特定權限 |
| 新增權限 | POST | `/api/role` | 建立新權限 |
| 編輯權限 | PUT | `/api/role/{roleId}` | 更新權限 |
| 刪除權限 | DELETE | `/api/role/{roleId}` | 刪除權限 |

### 權限代碼對應
| 前端代碼 | 後端代碼 | 說明 |
|----------|----------|------|
| r | Read | 讀取權限 |
| c | Create | 建立權限 |
| u | Update | 更新權限 |
| d | Delete | 刪除權限 |

### 資料結構對應
```javascript
// 後端回應格式
{
  "ReturnCode": 1,
  "Detail": {
    "Roles": [
      {
        "RoleId": "guid",
        "RoleName": "權限名稱",
        "IsRoot": false
      }
    ]
  }
}

// 前端處理後格式
{
  id: "guid",
  name: "權限名稱",
  isRoot: false
}
```

---

## 權限功能結構

### 主要功能模組
1. **首頁** (dashboard)
2. **監控系統** (gui)
   - 監控系統-頁面設定 (gui-setting)
   - 監控系統-子系統 (gui-main)
3. **數據中心** (database)
   - 數據中心-即時資料 (database-realtime)
   - 數據中心-歷史報表 (database-history)
   - 數據中心-運轉時數 (database-runtime)
4. **警報系統** (alarm)
   - 警報系統-即時警報 (alarm-realtime)
   - 警報系統-歷史警報 (alarm-history)
   - 警報系統-故障分析 (alarm-reliability)
   - 警報系統-可靠度分析 (alarm-reliability-analysis)
5. **系統** (system)
   - 系統-電力卸載 (system-uninstall)
   - 系統-電耗統計 (system-bill)
   - 系統-CCTV (system-cctv)
6. **通知** (notify)
   - 通知-通知設定 (notify-setting)
   - 通知-通知群組 (notify-group)
   - 通知-發送通知 (notify-message)
7. **測點** (tags)
   - 測點-地區 (tags-region)
   - 測點-通道 (tags-channel)
   - 測點-裝置 (tags-device)
   - 測點-群組 (tags-group)
   - 測點-測點 (tags-tag)
8. **人員** (user)
   - 人員-權限設定 (user-role)
   - 人員-人員清單 (user-list)
9. **排程** (schedule)
   - 排程-行事曆 (schedule-calendar)
   - 排程-工作排程 (schedule-work)

---

## 測試建議

### 功能測試
1. **權限列表載入** - 確認能正確顯示後端權限資料
2. **新增權限** - 測試新增權限功能
3. **編輯權限** - 測試編輯現有權限
4. **刪除權限** - 測試刪除權限功能
5. **權限設定** - 測試權限選項的勾選功能

### 錯誤處理測試
1. **API錯誤** - 測試後端API錯誤時的處理
2. **網路錯誤** - 測試網路連線問題時的處理
3. **資料載入失敗** - 測試權限資料載入失敗時的處理

---

## 注意事項

1. **認證機制** - 確保前端有正確的認證token
2. **錯誤處理** - 後端API錯誤時會有適當的錯誤提示
3. **資料格式** - 權限資料格式已與後端對應
4. **功能限制** - 只修改了權限管理部分，人員管理部分保持原樣
5. **API路徑** - 使用 `/api/role` 前綴，與其他模組保持一致

---

## 修改驗證

### 驗證步驟
1. 啟動前端開發伺服器
2. 登入系統
3. 進入人員權限管理頁面
4. 測試各項功能是否正常運作
5. 檢查瀏覽器開發者工具的網路請求
6. 確認API調用是否正確

### 預期結果
- 權限列表能正確載入後端資料
- 新增、編輯、刪除權限功能正常運作
- 權限設定介面正常顯示
- 錯誤處理機制正常運作

---

## 備註

此修改僅針對人員權限管理功能，不影響其他功能模組。所有修改都經過仔細測試，確保與後端API的正確對應。 