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
import { notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";

import ModalHelper from "@/utility/modalHelper";
export default defineComponent({
  components: {
    Main,
    DataTables,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.user.loading);

    onMounted(async () => {
      try {
        // 載入人員列表
        dispatch("user/getUserList");

        // 載入權限選項
        const res = await dispatch("user/getUserListOptions");

        if (res && res.permissions && Array.isArray(res.permissions)) {
          permissionOptions.value = res.permissions;
        } else {
          // 設定空陣列，讓用戶知道沒有可用的權限選項
          permissionOptions.value = [];
        }
      } catch (error) {
        // 設定空陣列
        permissionOptions.value = [];

        // 只有在不是身份驗證錯誤時才顯示錯誤對話框
        if (!error.message || !error.message.includes('401')) {
          ModalHelper.error({
            title: "載入權限選項失敗",
            content: error.message || "無法載入權限選項，請檢查網路連線或聯繫管理員",
          });
        }
      }
    });

    const columns = [
      { title: "名稱", dataIndex: "name", key: "name" },
      { title: "權限", dataIndex: "permission", key: "permission" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const tableData = computed(() =>
      state.user.userTableData.map((el) => {
        return {
          name: el.name,
          permission: el.permission.name,
          action: (
            <ActionSpan>
              {permission.update && (
                <span onClick={() => openEditModal(el)}>
                  <unicon name="edit"></unicon>
                </span>
              )}
              {permission.delete && (
                <span onClick={() => deleteUser(el)}>
                  <unicon name="trash"></unicon>
                </span>
              )}
            </ActionSpan>
          ),
        };
      })
    );

    const search = (e) => {
      dispatch("user/filterUserTable", e.target.value);
    };

    const permissionOptions = ref([]);

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
      email: "",
      permission: null,
      password: "",
    });
    const rules = {
      name: [{ required: true, trigger: "blur", message: "請輸入名稱" }],
      email: [
        { required: true, trigger: "blur", message: "請輸入 Email" },
        { type: "email", trigger: "blur", message: "請輸入有效的 Email 格式" }
      ],
      permission: [{ required: true, trigger: "blur", message: "請選擇" }],
      password: [
        {
          validator: (rule, value) => {
            if (!formState.id && !value) {
              return Promise.reject('新增人員時必須設定密碼');
            }
            if (value && value.length < 6) {
              return Promise.reject('密碼長度至少6個字元');
            }
            return Promise.resolve();
          },
          trigger: "blur"
        }
      ],
    };
    const modal = ref(false);
    const openAddModal = () => {
      const obj = {
        title: "新增人員",
        id: null,
        name: "",
        email: "",
        permission: null,
        password: "",
      };
      Object.assign(formState, obj);
      modal.value = true;
    };
    const openEditModal = ({ id, index, name, permission, email }) => {
      const obj = {
        title: "編輯人員",
        id,
        index,
        name,
        email: email || "",
        permission: permission.id,
        password: "", // 編輯時密碼留空
      };
      Object.assign(formState, obj);
      modal.value = true;
    };
    const submitForm = async () => {
      try {
        let title;
        let description = "";

        if (formState.id) {
          title = "編輯成功";
          await dispatch("user/editUser", toRaw(formState));

          // 如果有輸入密碼，顯示密碼更新提示
          if (formState.password && formState.password.trim()) {
            description = "密碼已更新";
          }
        } else {
          title = "新增成功";
          await dispatch("user/addUser", toRaw(formState));

          // 新增時如果有設定密碼，顯示密碼提示
          description = "人員已建立，請通知使用者以既定流程登入或重設密碼。";
        }

        modal.value = false;
        notification.success({
          message: title,
          description: description,
        });
        // 重新載入人員列表
        dispatch("user/getUserList");
      } catch (err) {
        ModalHelper.error({
          title: "發生錯誤",
          content: err.message || err,
        });
      }
    };
    const closeModal = () => {
      modal.value = false;
    };


    const deleteUser = (record) => {
      ModalHelper.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            // 傳遞包含 index 的參數
            await dispatch("user/deleteUser", {
              id: record.id,
              index: record.index
            });
            notification.success({
              message: "刪除成功",
            });
            // 重新載入人員列表
            dispatch("user/getUserList");
          } catch (err) {
            ModalHelper.error({
              title: "發生錯誤",
              content: err.message,
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
      permissionOptions,
      labelCol,
      wrapperCol,
      formState,
      rules,
      modal,
      openAddModal,
      submitForm,
      closeModal,
      deleteUser,
    };
  },
});
