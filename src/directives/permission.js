import { getPermissionData } from "@/utility/tenantContext";

/**
 * 權限指令
 * 用法：
 * v-permission="'create'" - 檢查當前路由的新增權限
 * v-permission="{ permission: 'update', module: 'user-list' }" - 檢查指定模組的編輯權限
 * v-permission:hide="'delete'" - 隱藏元素而不是移除
 */
export const permission = {
  mounted(el, binding, vnode) {
    checkPermission(el, binding, vnode);
  },
  updated(el, binding, vnode) {
    checkPermission(el, binding, vnode);
  }
};

function checkPermission(el, binding, vnode) {
  const { value, arg, modifiers } = binding;
  
  let permissionType = '';
  let moduleName = '';
  
  // 從URL路徑構建模組名稱的輔助函數
  const getModuleNameFromPath = () => {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length >= 2) {
      return pathSegments.join('-'); // 例如: /user/list -> user-list
    }
    return '';
  };

  // 處理不同的綁定值格式
  if (typeof value === 'string') {
    permissionType = value;
    // 從路由獲取模組名稱，嘗試多種方式
    moduleName = vnode.ctx?.$route?.name ||
                 vnode.appContext?.app?.config?.globalProperties?.$route?.name ||
                 getModuleNameFromPath() ||
                 '';
  } else if (typeof value === 'object') {
    permissionType = value.permission || '';
    moduleName = value.module ||
                 vnode.ctx?.$route?.name ||
                 vnode.appContext?.app?.config?.globalProperties?.$route?.name ||
                 getModuleNameFromPath() ||
                 '';
  }
  
  // 獲取權限數據
  const permissionData = getPermissionData();
  const modulePermissions = permissionData?.[moduleName] || [];

  // 調試信息已移除，權限檢查正常運作

  // 檢查權限
  let hasPermission = false;
  switch (permissionType) {
    case 'create':
    case 'c':
      hasPermission = modulePermissions.includes('c');
      break;
    case 'read':
    case 'r':
      hasPermission = modulePermissions.includes('r');
      break;
    case 'update':
    case 'u':
      hasPermission = modulePermissions.includes('u');
      break;
    case 'delete':
    case 'd':
      hasPermission = modulePermissions.includes('d');
      break;
    default:
      hasPermission = false;
  }

  // 權限檢查完成，執行相應的權限控制

  // 處理權限結果
  if (!hasPermission) {
    if (arg === 'hide' || modifiers.hide) {
      // 隱藏元素
      el.style.display = 'none';
    } else if (arg === 'disable' || modifiers.disable) {
      // 禁用元素（反灰）
      el.disabled = true;
      el.style.opacity = '0.5';
      el.style.cursor = 'not-allowed';
      el.setAttribute('title', '您沒有此操作的權限');

      // 為 Ant Design 按鈕添加禁用類
      if (el.classList.contains('ant-btn')) {
        el.classList.add('ant-btn-disabled');
      }

      // 阻止點擊事件
      const preventClick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      el.addEventListener('click', preventClick, true);
      // 保存事件處理器引用，以便後續移除
      el._permissionClickHandler = preventClick;
    } else {
      // 移除元素
      el.parentNode?.removeChild(el);
    }
  } else {
    // 確保元素可用
    if (el.style.display === 'none') {
      el.style.display = '';
    }
    el.disabled = false;
    el.style.opacity = '';
    el.style.cursor = '';
    el.removeAttribute('title');

    // 移除 Ant Design 禁用類
    if (el.classList.contains('ant-btn-disabled')) {
      el.classList.remove('ant-btn-disabled');
    }

    // 移除點擊事件處理器
    if (el._permissionClickHandler) {
      el.removeEventListener('click', el._permissionClickHandler, true);
      delete el._permissionClickHandler;
    }
  }
}

export default permission;
