import { defineComponent, computed, ref, reactive, onMounted } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { ActionSpan, ChildSpan } from "../../../styled";
import { Modal, notification } from "ant-design-vue";
import { useStore } from "vuex";
import { ModalWrap } from "./style";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    DataTables,
    ModalWrap,
  },
  setup() {
    const { permission } = usePermission();
    const loading = computed(() => state.device.loading);
    const { dispatch, state } = useStore();

    onMounted(() => {
      dispatch("device/getAllClass");
    });

    const modal = ref(false);
    const formState = reactive({
      title: null,
      id: null,
      parentId: null,
      name: null,
    });
    const rules = {
      name: [
        {
          required: true,
          message: "請輸入名稱",
          trigger: "blur",
        },
      ],
      description: [
        {
          required: true,
          message: "請填入說明",
          trigger: "blur",
        },
      ],
    };

    const labelCol = {
      lg: 8,
      md: 9,
      xs: 24,
    };
    const wrapperCol = {
      lg: 16,
      md: 15,
      xs: 24,
    };

    const closeModal = () => {
      modal.value = false;
    };

    const submit = async () => {
      try {
        let title;
        if (formState.id) {
          await dispatch("device/editClass", formState);
          title = "修改成功";
        } else {
          await dispatch("device/addClass", formState);
          title = "新增成功";
        }
        modal.value = false;
        notification.success({
          message: title,
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const columns = [
      { title: "名稱", dataIndex: "name", key: "name" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const isChild = computed(() => state.device.classURLs.length > 0);
    const tableData = computed(() =>
      state.device.classTableData
        ? state.device.classTableData.map((el) => {
            return {
              // ...el,
              name: (
                <ChildSpan
                  onClick={() => getChild({ id: el.Id, name: el.Name })}
                >
                  {el.Name}
                </ChildSpan>
              ),
              action: (
                <ActionSpan>
                  {permission.update && (
                    <span onClick={() => openEditModal(el)}>
                      <unicon name="edit"></unicon>
                    </span>
                  )}
                  {permission.delete && (
                    <span onClick={() => deleteItem(el.Id)}>
                      <unicon name="trash"></unicon>
                    </span>
                  )}
                </ActionSpan>
              ),
            };
          })
        : []
    );

    const search = (e) => {
      dispatch("device/filterClassTable", e.target.value);
    };

    const backTitle = computed(() =>
      state.device.classURLs.length > 0
        ? state.device.classURLs[state.device.classURLs.length - 1].name
        : ""
    );

    const getChild = async ({ id, name }) => {
      try {
        await dispatch("device/getClassChild", { id, name });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const goBack = async () => {
      await dispatch("device/classGoback");
    };

    const openAddModal = () => {
      formState.title = "新增分類";
      formState.id = null;
      formState.name = null;
      formState.parentId =
        state.device.classURLs[state.device.classURLs.length - 1];
      modal.value = true;
    };

    const openEditModal = ({ Id, Name }) => {
      formState.title = "編輯分類";
      formState.id = Id;
      formState.name = Name;
      formState.parentId = null;
      modal.value = true;
    };

    const deleteItem = (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("device/deleteClass", id);
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
    return {
      backTitle,
      permission,
      loading,
      modal,
      formState,
      rules,
      submit,
      labelCol,
      wrapperCol,
      columns,
      isChild,
      tableData,
      search,
      closeModal,
      goBack,
      openAddModal,
    };
  },
});
