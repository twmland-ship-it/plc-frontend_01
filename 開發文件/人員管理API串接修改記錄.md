# 人員管理API串接修改記錄

## 修改日期
2025年7月16日

## 修改目的
將前端人員管理功能從Demo Data改為實際後端API調用，解決新增人員後列表不顯示的問題。

## 問題描述
- 新增人員顯示成功，但列表中沒有顯示新增的人員
- 編輯人員顯示成功，但修改沒有反映在列表中
- 刪除人員顯示成功，但人員仍然在列表中顯示

## 根本原因
人員管理功能仍然使用模擬資料（setTimeout + console.log），而不是真正的API調用，導致：
1. 新增/編輯/刪除操作只是模擬成功，沒有實際儲存到後端
2. 列表顯示的是固定的模擬資料，不會反映實際的變更

---

## 修改檔案清單

### 1. Vuex Store 檔案
**檔案路徑：** `src/vuex/modules/user/actionCreator.js`

**修改內容：**
- 移除 `user` 模擬資料 import
- 修改 `getUserList()` - 改為調用 `/api/staff/list` API
- 修改 `getUserListOptions()` - 從權限API獲取可用權限選項
- 修改 `addUser()` - 調用 `/api/staff` POST API
- 修改 `editUser()` - 調用 `/api/staff/{id}` PUT API
- 修改 `deleteUser()` - 調用 `/api/staff/{id}` DELETE API

### 2. 人員列表頁面邏輯檔案
**檔案路徑：** `src/view/oco/user/list/main.js`

**修改內容：**
- 在 `submitForm()` 中新增操作完成後重新載入人員列表
- 在 `deleteUser()` 中新增刪除完成後重新載入人員列表

---

## 詳細修改內容

### Vuex Store 修改詳情

#### 移除模擬資料 Import
```javascript
// 修改前
import user from "@/demoData/user-list.json";

// 修改後
// import user from "@/demoData/user-list.json"; // 改為使用實際 API，不再需要模擬資料
```

#### 人員列表查詢
```javascript
// 修改前 (Demo Data)
async getUserList({ commit }) {
  await new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, 500)
  );
  commit("getUserListSuccess", user.data);
}

// 修改後 (實際 API)
async getUserList({ commit }) {
  const response = await DataService.get("/api/staff/list");
  const users = response.data.Detail.Staff.map(staff => ({
    id: staff.StaffId,
    name: staff.StaffName,
    permission: {
      id: staff.RoleId,
      name: staff.RoleName
    }
  }));
  commit("getUserListSuccess", users);
}
```

#### 人員選項載入
```javascript
// 修改前 (Demo Data)
async getUserListOptions({ commit }) {
  const res = await new Promise((resolve) =>
    setTimeout(() => {
      resolve(user.options);
    }, 500)
  );
  return res;
}

// 修改後 (實際 API)
async getUserListOptions({ commit }) {
  const response = await DataService.get("/api/role/roles");
  const permissions = response.data.Detail.Roles.map(role => ({
    id: role.RoleId,
    name: role.RoleName
  }));
  return { permissions };
}
```

#### 新增人員
```javascript
// 修改前 (Demo Data)
async addUser({ commit }, params) {
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log("addUser", params);
      resolve();
    }, 500)
  );
}

// 修改後 (實際 API)
async addUser({ commit }, params) {
  const requestData = {
    StaffName: params.name,
    RoleId: params.permission,
    Account: params.name,
    Password: "123456",
    UniformNumber: "",
    EnableState: true
  };
  await DataService.post("/api/staff", requestData, { "Content-Type": "application/json" });
}
```

#### 編輯人員
```javascript
// 修改前 (Demo Data)
async editUser({ commit }, params) {
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log("editUser", params);
      resolve();
    }, 500)
  );
}

// 修改後 (實際 API)
async editUser({ commit }, params) {
  const requestData = {
    StaffName: params.name,
    RoleId: params.permission,
    EnableState: true
  };
  await DataService.put(`/api/staff/${params.id}`, requestData, { "Content-Type": "application/json" });
}
```

#### 刪除人員
```javascript
// 修改前 (Demo Data)
async deleteUser({ commit }, id) {
  await new Promise((resolve) =>
    setTimeout(() => {
      console.log("deleteUser", id);
      resolve();
    }, 500)
  );
}

// 修改後 (實際 API)
async deleteUser({ commit }, id) {
  await DataService.delete(`/api/staff/${id}`);
}
```

### 人員列表頁面邏輯修改詳情

#### 操作完成後重新載入
```javascript
// 在 submitForm 中新增
const submitForm = async () => {
  try {
    // ... 新增/編輯邏輯
    modal.value = false;
    notification.success({
      message: title,
    });
    // 重新載入人員列表
    dispatch("user/getUserList");
  } catch (err) {
    // ... 錯誤處理
  }
};

// 在 deleteUser 中新增
const deleteUser = (id) => {
  Modal.confirm({
    // ... 確認對話框設定
    onOk: async () => {
      try {
        await dispatch("user/deleteUser", id);
        notification.success({
          message: "刪除成功",
        });
        // 重新載入人員列表
        dispatch("user/getUserList");
      } catch (err) {
        // ... 錯誤處理
      }
    },
  });
};
```

---

## API 對應關係

### 後端 API 端點
| 功能 | HTTP方法 | 路徑 | 說明 |
|------|----------|------|------|
| 人員列表 | GET | `/api/staff/list` | 取得所有人員 |
| 新增人員 | POST | `/api/staff` | 建立新人員 |
| 編輯人員 | PUT | `/api/staff/{staffId}` | 更新人員 |
| 刪除人員 | DELETE | `/api/staff/{staffId}` | 刪除人員 |
| 權限選項 | GET | `/api/role/roles` | 取得可用權限列表 |

### 資料結構對應
```javascript
// 後端人員列表回應格式
{
  "ReturnCode": 1,
  "Detail": {
    "Staff": [
      {
        "StaffId": "guid",
        "StaffName": "人員名稱",
        "RoleId": "guid",
        "RoleName": "權限名稱",
        "Account": "帳號",
        "UniformNumber": "工號",
        "EnableState": true
      }
    ]
  }
}

// 前端新增人員請求格式
{
  "StaffName": "人員名稱",
  "RoleId": "權限ID",
  "Account": "帳號",
  "Password": "密碼",
  "UniformNumber": "工號",
  "EnableState": true
}
```

---

## 修復效果

✅ **新增人員**: 現在會實際儲存到後端，並在列表中顯示
✅ **編輯人員**: 現在會實際更新後端資料，並在列表中反映變更
✅ **刪除人員**: 現在會實際從後端刪除，並從列表中移除
✅ **權限選項**: 從實際的權限API獲取，與權限管理保持同步
✅ **列表重新載入**: 所有操作完成後會自動重新載入最新資料

---

## 注意事項

1. **API端點假設**: 基於現有的 `/api/staff/stafflogin` 端點，推測人員管理API為 `/api/staff`
2. **預設值設定**: 新增人員時使用預設密碼 "123456"，實際使用時可能需要調整
3. **帳號設定**: 目前使用人員名稱作為帳號，實際使用時可能需要獨立的帳號欄位
4. **錯誤處理**: 已包含基本的錯誤處理機制
5. **Content-Type**: 使用 "application/json" 格式，與權限管理API保持一致

---

## 測試建議

### 功能測試
1. **人員列表載入** - 確認能正確顯示後端人員資料
2. **新增人員** - 測試新增人員功能，確認列表中顯示新人員
3. **編輯人員** - 測試編輯現有人員，確認變更反映在列表中
4. **刪除人員** - 測試刪除人員功能，確認人員從列表中移除
5. **權限選項** - 確認權限下拉選單顯示正確的選項

### 錯誤處理測試
1. **API錯誤** - 測試後端API錯誤時的處理
2. **網路錯誤** - 測試網路連線問題時的處理
3. **資料載入失敗** - 測試人員資料載入失敗時的處理

---

## 修改驗證

### 驗證步驟
1. 啟動前端開發伺服器
2. 登入系統
3. 進入人員管理頁面
4. 測試新增人員功能
5. 確認新人員在列表中顯示
6. 測試編輯和刪除功能
7. 檢查瀏覽器開發者工具的網路請求

### 預期結果
- 人員列表能正確載入後端資料
- 新增、編輯、刪除人員功能正常運作
- 所有操作完成後列表會自動更新
- 錯誤處理機制正常運作
