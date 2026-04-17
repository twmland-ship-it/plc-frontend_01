import { computed, defineComponent, reactive, ref, toRaw } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { useStore } from "vuex";
import { SubscribeSpan, ActionSpan } from "./style";
import useClipboard from "vue-clipboard3";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    DataTables,
    SubscribeSpan,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const { toClipboard } = useClipboard();

    const loading = computed(() => state.notify.loading);
    const columns = [
      { title: "服務名稱", dataIndex: "name", key: "name" },
      { title: "訂閱", dataIndex: "subscribe", key: "subscribe" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];
    const tableData = computed(() =>
      state.notify.lineServiceTableData.map((el) => {
        return {
          name: el.name,
          subscribe: (
            <SubscribeSpan>
              <button onclick={() => subscribe(el.subscribeURL)}>
                訂閱服務 <unicon name="line"></unicon>
              </button>
              <span
                class="copy-link"
                onclick={() => copyLink({ id: el.id, url: el.subscribeURL })}
              >
                {currentCopy.value === el.id ? "已複製" : "複製連結"}
              </span>
            </SubscribeSpan>
          ),
          action: (
            <ActionSpan>
              {permission.update && (
                <span onClick={() => openEditModal(el)}>
                  <unicon name="edit"></unicon>
                </span>
              )}
              {permission.delete && (
                <span onClick={() => deleteService(el.id)}>
                  <unicon name="trash"></unicon>
                </span>
              )}
            </ActionSpan>
          ),
        };
      })
    );
    const search = (e) => {
      dispatch("notify/filterLineServiceList", e.target.value);
    };
    const subscribe = () => {};

    const currentCopy = ref(null);
    const copyLink = async ({ id, url }) => {
      try {
        await toClipboard(url);
        currentCopy.value = id;
      } catch (e) {
        console.error(e);
      }
    };
    const openAddModal = () => {
      const obj = {
        id: null,
        title: "新增服務",
        name: "",
        clientId: "",
        clientSecret: "",
      };
      Object.assign(formState, obj);
      modal.value = true;
    };
    const openEditModal = ({ id, name, clientId, clientSecret }) => {
      const obj = {
        id,
        title: "編輯服務",
        name,
        clientId,
        clientSecret,
      };
      Object.assign(formState, obj);
      modal.value = true;
    };
    const deleteService = async (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("notify/deleteLineService", id);
            notification.success({
              message: "刪除成功",
            });
          } catch (err) {
            Modal.error({
              title: "發生錯誤",
              content: err.message,
            });
          }
        },
      });
    };
    const closeModal = () => {
      modal.value = false;
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
    const rules = {
      name: [{ required: true, message: "請輸入名字", trigger: "blur" }],
      clientId: [
        { required: true, message: "請輸入client_id", trigger: "blur" },
      ],
      clientSecret: [
        { required: true, message: "請輸入client_secret", trigger: "blur" },
      ],
    };
    const modal = ref(false);
    const formState = reactive({
      id: null,
      title: null,
      name: "",
      clientId: "",
      clientSecret: "",
    });

    const submitForm = async () => {
      try {
        let title;
        if (formState.id) {
          await dispatch("notify/editLineService", {
            ...toRaw(formState),
          });
          title = "修改成功";
        } else {
          await dispatch("notify/addLineService", {
            ...toRaw(formState),
          });
          title = "新增成功";
        }
        modal.value = false;
        notification.success({
          message: title,
        });
      } catch (err) {
        modal.value = false;
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    return {
      permission,
      loading,
      tableData,
      columns,
      search,
      openAddModal,
      closeModal,
      labelCol,
      wrapperCol,
      rules,
      modal,
      formState,
      submitForm,
    };
  },
});
