import { useStore } from "vuex";
import { Main } from "../../styled";
import { computed, defineComponent, onMounted, reactive, ref } from "vue";
import { ChildSpan, ActionSpan, ModalWrap } from "./style";
import DataTables from "@/components/table/DataTable.vue";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: { Main, ChildSpan, ActionSpan, ModalWrap, DataTables },
  setup() {
    const { permission } = usePermission();
    const loading = computed(() => state.tags.loading);
    const { dispatch, state } = useStore();

    onMounted(async () => {
      await dispatch("tags/getTagsRegions");
    });

    const columns = [
      {
        title: "名稱",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) =>
          a.name.el.innerHTML.localeCompare(b.name.el.innerHTML),
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const isChild = computed(() => state.tags.regionURLs.length > 0);
    const tableData = computed(() =>
      state.tags.regionTableData
        ? state.tags.regionTableData.map((el) => {
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
      dispatch("tags/filterTagsRegionTable", e.target.value);
    };

    const backTitle = computed(() =>
      state.tags.regionURLs.length > 0
        ? state.tags.regionURLs[state.tags.regionURLs.length - 1].name
        : ""
    );
    const getChild = async ({ id, name }) => {
      try {
        await dispatch("tags/getTagsRegionChild", { id, name });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const goBack = async () => {
      await dispatch("tags/tagsRegionGoback");
    };

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
          await dispatch("tags/editTagsRegion", formState);
          title = "修改成功";
        } else {
          await dispatch("tags/addTagsRegion", formState);
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

    const openAddModal = () => {
      formState.title = "新增地區";
      formState.id = null;
      formState.name = "";
      formState.parentId =
        state.tags.regionURLs[state.tags.regionURLs.length - 1];
      modal.value = true;
    };

    const openEditModal = ({ Id, Name }) => {
      formState.title = "編輯地區";
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
            await dispatch("tags/deleteTagsRegion", id);
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
      goBack,
      closeModal,
      openAddModal,
    };
  },
});
