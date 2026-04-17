import { Main } from "../../styled";
import { defineComponent, computed, ref, onMounted, reactive } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { Modal, notification } from "ant-design-vue";
import { useStore } from "vuex";
import { ActionSpan, ModalWrap } from "./style";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    Main,
    DataTables,
    ActionSpan,
    ModalWrap,
  },
  setup() {
    const { permission } = usePermission();
    const loading = computed(() => state.tags.loading);
    const { dispatch, state } = useStore();
    onMounted(async () => {
      await dispatch("tags/fetchTagsChannel");
    });
    const modal = ref(false);
    const typeOptions = computed(() => state.tags.channelTypeOptions);
    const dataOptions = computed(() => state.tags.channelDataOptions);
    const statusOptions = [
      {
        value: true,
        label: "啟用",
      },
      {
        value: false,
        label: "停用",
      },
    ];
    const formState = reactive({
      title: null,
      id: null,
      name: null,
      type: null,
      data: null,
      description: null,
      status: null,
    });
    const rules = {
      name: [
        {
          required: true,
          message: "請輸入名稱",
          trigger: "blur",
        },
      ],
      type: [
        {
          required: true,
          message: "請選擇",
          trigger: "blur",
        },
      ],
      data: [
        {
          required: true,
          message: "請選擇",
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
    const openAddModal = () => {
      formState.title = "新增頻道";
      formState.id = null;
      formState.name = null;
      formState.type = null;
      formState.data = null;
      formState.description = "";
      formState.status = true;

      modal.value = true;
    };

    const openEditModal = ({
      TagChannelId,
      TagChannelName,
      Description,
      DriverCode,
      FetchDataModeCode,
      Status,
    }) => {
      formState.title = "編輯頻道";
      formState.id = TagChannelId;
      formState.name = TagChannelName;
      formState.type = DriverCode;
      formState.data = FetchDataModeCode;
      formState.description = Description;
      formState.status = Status;
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
            await dispatch("tags/deleteTagsChannel", id);
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
          await dispatch("tags/editTagsChannel", formState);
          title = "修改成功";
        } else {
          await dispatch("tags/addTagsChannel", formState);
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
      {
        title: "名稱",
        dataIndex: "TagChannelName",
        key: "TagChannelName",
        sorter: (a, b) => a.TagChannelName.localeCompare(b.TagChannelName),
        fixed: "left",
      },
      {
        title: "Driver",
        dataIndex: "DriverName",
        key: "DriverName",
        sorter: (a, b) => a.DriverName.localeCompare(b.DriverName),
      },
      {
        title: "資料獲取方式",
        dataIndex: "FetchDataModeName",
        key: "FetchDataModeName",
      },
      { title: "狀態", dataIndex: "statusName", key: "statusName" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];
    const tableData = computed(() =>
      state.tags.channelTableData
        ? state.tags.channelTableData.map((el) => {
            return {
              ...el,
              statusName: statusOptions.find(
                (status) => status.value === el.Status
              ).label,
              action: (
                <ActionSpan>
                  {permission.update && (
                    <span onClick={() => openEditModal(el)}>
                      <unicon name="edit"></unicon>
                    </span>
                  )}
                  {permission.delete && (
                    <span onClick={() => deleteItem(el.TagChannelId)}>
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
      dispatch("tags/filterTagsChannelTable", e.target.value);
    };

    return {
      permission,
      loading,
      modal,
      typeOptions,
      dataOptions,
      statusOptions,
      formState,
      rules,
      submit,
      labelCol,
      wrapperCol,
      columns,
      tableData,
      search,
      closeModal,
      openAddModal,
    };
  },
});
