import { computed } from 'vue';
import { usePermission } from '@/composable/permission';

/**
 * 權限混入
 * 提供常用的權限檢查方法
 */
export function usePermissionMixin(moduleName = null) {
  const { permission } = usePermission(moduleName);
  
  // 權限檢查方法
  const hasPermission = (type, module = null) => {
    if (module) {
      const { permission: modulePermission } = usePermission(module);
      switch (type) {
        case 'create':
        case 'c':
          return modulePermission.create;
        case 'read':
        case 'r':
          return modulePermission.read;
        case 'update':
        case 'u':
          return modulePermission.update;
        case 'delete':
        case 'd':
          return modulePermission.delete;
        default:
          return false;
      }
    }
    
    switch (type) {
      case 'create':
      case 'c':
        return permission.create;
      case 'read':
      case 'r':
        return permission.read;
      case 'update':
      case 'u':
        return permission.update;
      case 'delete':
      case 'd':
        return permission.delete;
      default:
        return false;
    }
  };
  
  // 常用權限計算屬性
  const canCreate = computed(() => permission.create);
  const canRead = computed(() => permission.read);
  const canUpdate = computed(() => permission.update);
  const canDelete = computed(() => permission.delete);
  
  // 組合權限檢查
  const canEdit = computed(() => permission.update);
  const canManage = computed(() => permission.create && permission.update && permission.delete);
  const canView = computed(() => permission.read);
  
  // 按鈕顯示控制
  const showAddButton = computed(() => permission.create);
  const showEditButton = computed(() => permission.update);
  const showDeleteButton = computed(() => permission.delete);
  const showSearchButton = computed(() => permission.read);
  
  // 表格操作列配置
  const getActionColumn = () => {
    const actions = [];
    
    if (permission.read) {
      actions.push({
        key: 'view',
        icon: 'eye',
        tooltip: '查看'
      });
    }
    
    if (permission.update) {
      actions.push({
        key: 'edit',
        icon: 'edit',
        tooltip: '編輯'
      });
    }
    
    if (permission.delete) {
      actions.push({
        key: 'delete',
        icon: 'trash',
        tooltip: '刪除'
      });
    }
    
    return actions;
  };
  
  // DataTable 權限配置
  const getTablePermissions = () => ({
    addOption: permission.create,
    editOption: permission.update,
    deleteOption: permission.delete,
    exportOption: permission.read,
    importOption: permission.create
  });
  
  return {
    permission,
    hasPermission,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canEdit,
    canManage,
    canView,
    showAddButton,
    showEditButton,
    showDeleteButton,
    showSearchButton,
    getActionColumn,
    getTablePermissions
  };
}
