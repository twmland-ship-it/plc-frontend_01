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
    const loading = computed(() => state.group.loading);
    const { dispatch, state } = useStore();

    onMounted(async () => {
      await dispatch("group/getAllClass");
    });

    const modal = ref(false);
    const formState = reactive({
      title: null,
      id: null,
      name: null,
      parentId: null,
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
          await dispatch("group/editTagsGroupClass", formState);
          title = "修改成功";
        } else {
          await dispatch("group/addTagsGroupClass", formState);
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

    const isChild = computed(() => state.group.classURLs.length > 0);
    const tableData = computed(() =>
      state.group.groupClassTableData
        ? state.group.groupClassTableData.map((el) => {
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
      dispatch("group/filterTagsGroupClassTable", e.target.value);
    };

    const backTitle = computed(() =>
      state.group.classURLs.length > 0
        ? state.group.classURLs[state.group.classURLs.length - 1].name
        : ""
    );

    const getChild = async ({ id, name }) => {
      try {
        await dispatch("group/getClassChild", { id, name });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const goBack = async () => {
      await dispatch("group/classGoback");
    };

    const openAddModal = () => {
      formState.title = "新增分類";
      formState.id = null;
      formState.name = null;
      formState.parentId =
        state.group.classURLs[state.group.classURLs.length - 1];
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
            await dispatch("group/deleteTagsGroupClass", id);
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
