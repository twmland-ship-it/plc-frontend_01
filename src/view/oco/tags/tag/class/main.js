import { defineComponent, computed, ref, reactive, onMounted } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { Modal, notification } from "ant-design-vue";
import { useStore } from "vuex";
import { ActionSpan, ChildSpan } from "../../../styled";
import { ModalWrap } from "./style";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    DataTables,
    ActionSpan,
    ModalWrap,
  },
  setup() {
    const { permission } = usePermission();
    const loading = computed(() => state.tags.loading);
    const { dispatch, state } = useStore();

    onMounted(() => {
      dispatch("tags/getAllClass");
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

    const openAddModal = () => {
      formState.title = "新增分類";
      formState.id = null;
      formState.name = null;
      formState.parentId =
        state.tags.classURLs[state.tags.classURLs.length - 1];
      modal.value = true;
    };

    const openEditModal = ({ Id, Name }) => {
      formState.title = "編輯分類";
      formState.id = Id;
      formState.name = Name;
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
            await dispatch("tags/deleteClass", id);
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

    const submit = async () => {
      try {
        let title;
        if (formState.id) {
          await dispatch("tags/editClass", formState);
          title = "修改成功";
        } else {
          await dispatch("tags/addClass", formState);
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

    const isChild = computed(() => state.tags.classURLs.length > 0);
    const tableData = computed(() =>
      state.tags.classTableData
        ? state.tags.classTableData.map((el) => {
            return {
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
      dispatch("tags/filterClassTable", e.target.value);
    };

    const backTitle = computed(() =>
      state.tags.classURLs.length > 0
        ? state.tags.classURLs[state.tags.classURLs.length - 1].name
        : ""
    );
    const getChild = async ({ id, name }) => {
      try {
        await dispatch("tags/getClassChild", { id, name });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const goBack = async () => {
      await dispatch("tags/classGoback");
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
      goBack,
      closeModal,
      openAddModal,
    };
  },
});
