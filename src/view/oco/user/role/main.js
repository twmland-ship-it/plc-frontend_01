import { Main } from "../../styled";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRaw,
} from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { ActionSpan } from "../../styled";
import { useStore } from "vuex";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
import { DataService } from "@/config/dataService/dataService";

export default defineComponent({
  components: {
    Main,
    DataTables,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.user.loading);

    const permissionOptions = ref([]);
    const allPermissionOptions = ref([]);
    const getTopLevelExpandableKeys = () =>
      permissionOptions.value
        .filter((item) => Array.isArray(item.sub) && item.sub.length > 0)
        .map((item) => item.id);

    onMounted(async () => {
      await dispatch("user/getRoleList");
      const res = await Promise.all([dispatch("user/getRoleOptions")]);
      permissionOptions.value = res[0].permission;
      expandedRowKeys.value = getTopLevelExpandableKeys();
      res[0].permission.forEach((item) => {
        allPermissionOptions.value.push(item); // 将原对象添加到新数组

        if (item.sub) {
          const subItems = item.sub.map((subItem) => ({
            ...item,
            ...subItem,
          }));
          allPermissionOptions.value.push(...subItems); // 将sub属性的子对象数组加入新数组
        }
      });
    });

    const columns = [
      { title: "名稱", dataIndex: "name", key: "name" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const tableData = computed(() =>
      state.user.roleTableData.map((el) => {
        return {
          name: el.name,
          action: (
            <ActionSpan>
              {permission.update && (
                <span onClick={() => openEditModal(el)}>
                  <unicon name="edit"></unicon>
                </span>
              )}
              {permission.delete && (
                <span onClick={() => deleteUser(el.id)}>
                  <unicon name="trash"></unicon>
                </span>
              )}
            </ActionSpan>
          ),
        };
      })
    );

    const search = (e) => {
      dispatch("user/filterRoleTable", e.target.value);
    };

    const labelCol = {
      lg: 6,
      md: 9,
      xs: 24,
    };

    const wrapperCol = {
      lg: 18,
      md: 15,
      xs: 24,
    };
    const formState = reactive({
      title: "",
      id: null,
      name: "",
      permission: {},
    });
    const rules = {
      name: [{ required: true, trigger: "blur", message: "請輸入名稱" }],
    };
    const permissionColumns = [
      {
        title: "名稱",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "檢視",
        dataIndex: "view",
        key: "view",
      },
      {
        title: "新增",
        dataIndex: "add",
        key: "add",
      },
      {
        title: "編輯",
        dataIndex: "edit",
        key: "edit",
      },
      {
        title: "刪除",
        dataIndex: "delete",
        key: "delete",
      },
    ];
    const expandedRowKeys = ref([]);
    const expandRow = (_, record) => {
      const index = expandedRowKeys.value.indexOf(record.id);
      if (index > -1) {
        expandedRowKeys.value.splice(index, 1);
      } else {
        expandedRowKeys.value.push(record.id);
      }
    };

    /** 依權限樹對每個功能 id 填入該列可選的全部代碼（與 options 一致），供 Root／Administrator 預設全開 */
    const buildFullPermissionFromPermissionTree = (nodes) => {
      const out = {};
      const walk = (items) => {
        if (!items || !Array.isArray(items)) return;
        items.forEach((el) => {
          const opts = el.options || [];
          if (opts.length) out[el.id] = [...opts];
          if (el.sub && el.sub.length) walk(el.sub);
        });
      };
      walk(nodes);
      return out;
    };

    const permissionTable = computed(() => {
      const setSubData = (data) => {
        const res = data.map((el) => {
          const currentSetting = formState.permission[el.id];
          const view = currentSetting && currentSetting.includes("r");
          const add = currentSetting && currentSetting.includes("c");
          const edit = currentSetting && currentSetting.includes("u");
          const del = currentSetting && currentSetting.includes("d");
          return {
            id: el.id,
            name: el.name,
            value: el.value,
            view,
            add,
            edit,
            sub: el.sub ? setSubData(el.sub) : null,
            delete: del,
          };
        });
        return res;
      };
      return setSubData(permissionOptions.value);
    });

    const innerTable = (record) => {
      return record.sub.map((el) => {
        const currentSetting = formState.permission[el.id];
        const view = currentSetting && currentSetting.includes("r");
        const add = currentSetting && currentSetting.includes("c");
        const edit = currentSetting && currentSetting.includes("u");
        const del = currentSetting && currentSetting.includes("d");
        return {
          id: el.id,
          name: el.name,
          view,
          add,
          edit,
          sub: el.sub,
          delete: del,
        };
      });
    };

    const hasOption = (id, permissionCode) => {
      const tar = allPermissionOptions.value.find((el) => el.id === id);
      return tar.options.includes(permissionCode);
    };

    // 找到項目及其所有子項目
    const findItemAndChildren = (items, targetId) => {
      for (const item of items) {
        if (item.id === targetId) {
          return item;
        }
        if (item.sub) {
          const found = findItemAndChildren(item.sub, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    // 收集所有子項目的 ID
    const collectChildrenIds = (item) => {
      const ids = [];
      if (item.sub) {
        for (const child of item.sub) {
          ids.push(child.id);
          ids.push(...collectChildrenIds(child));
        }
      }
      return ids;
    };

    // 找到父項目
    const findParentItem = (items, targetId) => {
      for (const item of items) {
        if (item.sub) {
          for (const child of item.sub) {
            if (child.id === targetId) {
              return item;
            }
            const found = findParentItem(item.sub, targetId);
            if (found) return found;
          }
        }
      }
      return null;
    };

    // 找到同級的兄弟項目
    const findSiblingItems = (items, targetId) => {
      for (const item of items) {
        if (item.sub) {
          for (const child of item.sub) {
            if (child.id === targetId) {
              return item.sub.filter(sibling => sibling.id !== targetId);
            }
          }
          const found = findSiblingItems(item.sub, targetId);
          if (found) return found;
        }
      }
      return [];
    };

    // 檢查所有子項目是否都有指定權限
    const allChildrenHavePermission = (item, value) => {
      if (!item.sub) return true;

      return item.sub.every(child => {
        const childPermissions = formState.permission[child.id] || [];
        const hasPermission = childPermissions.includes(value);
        const allSubChildrenHave = allChildrenHavePermission(child, value);
        return hasPermission && allSubChildrenHave;
      });
    };

    const changeCheckbox = (e, { id, value }) => {
      const isChecked = e.target.checked;
      const currentItem = findItemAndChildren(permissionOptions.value, id);

      if (isChecked) {
        // 勾選邏輯
        if (formState.permission[id]) {
          if (!formState.permission[id].includes(value)) {
            formState.permission[id].push(value);
          }
        } else {
          formState.permission[id] = [value];
        }

        // 如果是主項目被勾選，自動勾選所有子項目（只要子項目有該權限選項）
        if (currentItem && currentItem.sub) {
          const childrenIds = collectChildrenIds(currentItem);
          childrenIds.forEach(childId => {
            // 檢查子項目是否有這個權限選項
            const childItem = allPermissionOptions.value.find(el => el.id === childId);
            if (childItem && childItem.options.includes(value)) {
              if (formState.permission[childId]) {
                if (!formState.permission[childId].includes(value)) {
                  formState.permission[childId].push(value);
                }
              } else {
                formState.permission[childId] = [value];
              }
            }
          });
        }

        // 如果是子項目被勾選，檢查是否需要自動勾選父項目
        // 只有當父項目也有該權限選項，且所有子項目都勾選時，才勾選父項目
        const parentItem = findParentItem(permissionOptions.value, id);
        if (parentItem) {
          const parentItemOptions = allPermissionOptions.value.find(el => el.id === parentItem.id);
          if (parentItemOptions && parentItemOptions.options.includes(value) && allChildrenHavePermission(parentItem, value)) {
            if (formState.permission[parentItem.id]) {
              if (!formState.permission[parentItem.id].includes(value)) {
                formState.permission[parentItem.id].push(value);
              }
            } else {
              formState.permission[parentItem.id] = [value];
            }
          }
        }

        // 特殊處理：如果主項目沒有該權限，但子項目有，則實現子項目之間的聯動
        // 當勾選一個子項目時，如果其他兄弟項目也有該權限，則一起勾選
        if (parentItem) {
          const parentItemOptions = allPermissionOptions.value.find(el => el.id === parentItem.id);
          if (!parentItemOptions || !parentItemOptions.options.includes(value)) {
            // 主項目沒有該權限，實現子項目聯動
            const siblingItems = findSiblingItems(permissionOptions.value, id);
            siblingItems.forEach(sibling => {
              const siblingOptions = allPermissionOptions.value.find(el => el.id === sibling.id);
              if (siblingOptions && siblingOptions.options.includes(value)) {
                if (formState.permission[sibling.id]) {
                  if (!formState.permission[sibling.id].includes(value)) {
                    formState.permission[sibling.id].push(value);
                  }
                } else {
                  formState.permission[sibling.id] = [value];
                }
              }
            });
          }
        }
      } else {
        // 取消勾選邏輯
        if (formState.permission[id]) {
          const index = formState.permission[id].indexOf(value);
          if (index > -1) {
            formState.permission[id].splice(index, 1);
          }
        }

        // 如果是主項目被取消，自動取消所有子項目
        if (currentItem && currentItem.sub) {
          const childrenIds = collectChildrenIds(currentItem);
          childrenIds.forEach(childId => {
            if (formState.permission[childId]) {
              const index = formState.permission[childId].indexOf(value);
              if (index > -1) {
                formState.permission[childId].splice(index, 1);
              }
            }
          });
        }

        // 如果是子項目被取消，自動取消父項目（如果父項目有該權限選項）
        const parentItem = findParentItem(permissionOptions.value, id);
        if (parentItem) {
          const parentItemOptions = allPermissionOptions.value.find(el => el.id === parentItem.id);
          if (parentItemOptions && parentItemOptions.options.includes(value) && formState.permission[parentItem.id]) {
            const index = formState.permission[parentItem.id].indexOf(value);
            if (index > -1) {
              formState.permission[parentItem.id].splice(index, 1);
            }
          }

          // 特殊處理：如果主項目沒有該權限，但子項目有，則實現子項目之間的聯動
          // 當取消一個子項目時，如果其他兄弟項目也有該權限，則一起取消
          if (!parentItemOptions || !parentItemOptions.options.includes(value)) {
            // 主項目沒有該權限，實現子項目聯動
            const siblingItems = findSiblingItems(permissionOptions.value, id);
            siblingItems.forEach(sibling => {
              const siblingOptions = allPermissionOptions.value.find(el => el.id === sibling.id);
              if (siblingOptions && siblingOptions.options.includes(value) && formState.permission[sibling.id]) {
                const index = formState.permission[sibling.id].indexOf(value);
                if (index > -1) {
                  formState.permission[sibling.id].splice(index, 1);
                }
              }
            });
          }
        }
      }
    };

    const modal = ref(false);
    const openAddModal = () => {
      const obj = {
        title: "新增權限",
        id: null,
        name: "",
        permission: {},
      };
      Object.assign(formState, obj);
      expandedRowKeys.value = getTopLevelExpandableKeys();
      modal.value = true;
    };
    
    const openEditModal = async ({ id, name }) => {
      try {
        const response = await DataService.get(`/api/role/${id}`);
        const roleData =
          response.data?.Detail ?? response.data?.detail ?? null;
        if (!roleData) {
          throw new Error("GetRole 回應缺少 Detail");
        }

        const rawFeatures =
          roleData.Features ?? roleData.features ?? {};
        const isRoot = !!(roleData.IsRoot ?? roleData.isRoot);
        const roleName = roleData.RoleName ?? roleData.roleName ?? name ?? "";

        let permissionData = {};
        Object.keys(rawFeatures).forEach((featureKey) => {
          const row = rawFeatures[featureKey];
          if (!row || !Array.isArray(row) || row.length === 0) return;
          permissionData[featureKey] = row.map((p) => {
            switch (p) {
              case "Read":
              case "read":
                return "r";
              case "Create":
              case "create":
                return "c";
              case "Update":
              case "update":
                return "u";
              case "Delete":
              case "delete":
                return "d";
              default:
                return p;
            }
          });
        });

        const hasAnyPermission = Object.keys(permissionData).some(
          (k) => permissionData[k] && permissionData[k].length > 0
        );
        const isAdministratorName =
          String(roleName).trim().toLowerCase() === "administrator";
        if (
          !hasAnyPermission &&
          (isRoot || isAdministratorName) &&
          permissionOptions.value &&
          permissionOptions.value.length
        ) {
          permissionData = buildFullPermissionFromPermissionTree(
            permissionOptions.value
          );
        }

        const obj = {
          title: "編輯權限",
          id,
          name: roleName || name,
          permission: permissionData,
        };
        Object.assign(formState, obj);
      } catch (error) {
        const obj = {
          title: "編輯權限",
          id,
          name,
          permission: {},
        };
        Object.assign(formState, obj);
      }

      expandedRowKeys.value = getTopLevelExpandableKeys();
      modal.value = true;
    };
    
    const submitForm = async () => {
      try {
        let title;
        if (formState.id) {
          title = "編輯成功";
          await dispatch("user/editRole", toRaw(formState));
        } else {
          title = "新增成功";
          await dispatch("user/addRole", toRaw(formState));
        }
        modal.value = false;
        notification.success({
          message: title,
        });
        // 重新載入權限列表
        await dispatch("user/getRoleList");
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message || err,
        });
      }
    };
    const closeModal = () => {
      modal.value = false;
    };
    const deleteUser = async (id) => {
      // 先檢查權限使用情況
      try {
        const roleUsage = await dispatch("user/checkRoleUsage", id);

        if (roleUsage.isInUse) {
          const activeUserNames = roleUsage.activeUsers.map(u => u.name).join('、');
          const disabledUserNames = roleUsage.disabledUsers.map(u => u.name).join('、');

          // 如果只有已停用的用戶在使用，提供自動清理選項
          if (roleUsage.activeUsers.length === 0 && roleUsage.disabledUsers.length > 0) {
            Modal.confirm({
              title: "權限被已停用人員使用",
              content: `此權限被以下已停用人員使用：${disabledUserNames}\n\n是否要自動刪除這些已停用人員並刪除此權限？`,
              okText: "是，自動清理並刪除",
              cancelText: "取消",
              width: 500,
              onOk: async () => {
                try {
                  // 顯示處理進度
                  const loadingNotification = notification.info({
                    message: "正在處理...",
                    description: "正在刪除已停用人員並刪除權限",
                    duration: 0, // 不自動關閉
                  });

                  // 永久刪除所有已停用的用戶
                  for (const user of roleUsage.disabledUsers) {
                    await dispatch("user/permanentDeleteUser", {
                      id: user.id,
                      index: user.index
                    });
                  }

                  // 刪除權限
                  await dispatch("user/deleteRole", id);

                  // 關閉進度通知
                  loadingNotification();

                  // 顯示成功訊息
                  notification.success({
                    message: "刪除成功",
                    description: `已刪除 ${roleUsage.disabledUsers.length} 個已停用人員並刪除權限`,
                  });

                  // 重新載入權限列表
                  await dispatch("user/getRoleList");
                } catch (err) {
                  Modal.error({
                    title: "自動清理失敗",
                    content: `處理過程中發生錯誤：${err.message}`,
                    width: 500,
                  });
                }
              }
            });
            return;
          }

          // 如果有啟用的用戶在使用，顯示警告
          let content = "此權限正在使用中，無法刪除。\n\n使用此權限的人員：\n";

          if (roleUsage.activeUsers.length > 0) {
            content += `• 啟用中：${activeUserNames}\n`;
          }

          if (roleUsage.disabledUsers.length > 0) {
            content += `• 已停用：${disabledUserNames}\n`;
          }

          content += "\n請先移除這些人員的權限設定後再刪除此權限。";

          Modal.warning({
            title: "無法刪除權限",
            content: content,
            width: 500,
          });
          return;
        }
      } catch (err) {
        // 如果檢查失敗，繼續執行刪除操作
      }

      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("user/deleteRole", id);
            notification.success({
              message: "刪除成功",
            });
            // 重新載入權限列表
            await dispatch("user/getRoleList");
          } catch (err) {
            // 根據錯誤類型顯示不同的錯誤訊息
            let errorTitle = "刪除失敗";
            let errorContent = err.message || "發生未知錯誤";

            if (errorContent.includes('已經有人員使用該權限') ||
                errorContent.includes('此權限正在使用中')) {
              errorTitle = "無法刪除權限";
              errorContent = "此權限正在使用中，請檢查是否有人員（包括已停用的）正在使用此權限。";
            } else if (errorContent.includes('系統根權限')) {
              errorTitle = "無法刪除權限";
              errorContent = "此為系統根權限，無法刪除。";
            }

            Modal.error({
              title: errorTitle,
              content: errorContent,
              width: 500,
            });
          }
        },
      });
    };

    return {
      permission,
      loading,
      columns,
      tableData,
      search,
      expandedRowKeys,
      expandRow,
      permissionOptions,
      labelCol,
      wrapperCol,
      formState,
      rules,
      permissionColumns,
      permissionTable,
      innerTable,
      hasOption,
      changeCheckbox,
      modal,
      openAddModal,
      submitForm,
      closeModal,
    };
  },
});
