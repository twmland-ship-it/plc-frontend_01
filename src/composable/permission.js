import { reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import {
  getPermissionData,
  TENANT_PERMISSION_STORAGE_KEY,
} from "@/utility/tenantContext";

// 創建一個全局的權限數據響應式引用
const globalPermissionData = ref(getPermissionData());

// 監聽localStorage的變化
const updateGlobalPermissions = () => {
  globalPermissionData.value = getPermissionData();
};

// 監聽storage事件
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === TENANT_PERMISSION_STORAGE_KEY) {
      updateGlobalPermissions();
    }
  });
}

// 提供一個手動更新權限的方法
export const refreshPermissions = () => {
  updateGlobalPermissions();
};

export function usePermission(value) {
  const { name } = useRoute();
  let routeName = "";
  if (!value) {
    routeName = name;
  } else {
    routeName = value;
  }

  const permission = reactive({
    read: false,
    create: false,
    update: false,
    delete: false,
  });

  // 更新權限的函數
  const updatePermissions = () => {
    const permissionData = globalPermissionData.value;
    const modulePermissions = permissionData?.[routeName] || [];

    permission.read = modulePermissions.includes("r");
    permission.create = modulePermissions.includes("c");
    permission.update = modulePermissions.includes("u");
    permission.delete = modulePermissions.includes("d");
  };

  // 初始化權限
  updatePermissions();

  // 監聽全局權限數據的變化
  watch(globalPermissionData, updatePermissions, { deep: true });

  return {
    permission,
  };
}
