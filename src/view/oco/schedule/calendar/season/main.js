import { defineComponent, computed, onMounted, ref, reactive } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { useStore } from "vuex";
import { ActionSpan } from "../../../styled";
import { Modal, notification } from "ant-design-vue";
import dayjs from "dayjs";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    DataTables,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.schedule.loading);

    onMounted(async () => {
      await dispatch("schedule/getSeasonList");
    });

    const columns = [
      { title: "季節/區間名稱", dataIndex: "name", key: "name" },
      { title: "開始日期", dataIndex: "start", key: "start" },
      { title: "結束日期", dataIndex: "end", key: "end" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const tableData = computed(() =>
      state.schedule.seasonTableData.map((el) => {
        return {
          name: el.name,
          start: el.period[0],
          end: el.period[1],
          action: (
            <ActionSpan>
              {permission.update && (
                <span onClick={() => openEditModal(el)}>
                  <unicon name="edit"></unicon>
                </span>
              )}
              {permission.delete && (
                <span onClick={() => deleteSeason(el.id)}>
                  <unicon name="trash"></unicon>
                </span>
              )}
            </ActionSpan>
          ),
        };
      })
    );

    const search = (e) => {
      dispatch("schedule/filterSeason", e.target.value);
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
    const dateFormat = "MM/DD";
    const formState = reactive({
      id: null,
      name: "",
      period: [],
    });

    const rules = {
      name: { required: true, trigger: "blur", message: "請輸入名稱" },
      period: { required: true, trigger: "blur", message: "請選擇區間" },
    };

    const modal = ref(false);
    const closeModal = () => {
      modal.value = false;
    };
    const openAddModal = () => {
      const obj = {
        id: null,
        name: "",
        period: [],
      };
      Object.assign(formState, obj);
      modal.value = true;
    };

    const openEditModal = ({ id, name, period }) => {
      const obj = {
        id,
        name,
        period: [dayjs(period[0], "MM/DD"), dayjs(period[1], "MM/DD")],
      };
      Object.assign(formState, obj);
      modal.value = true;
    };

    const submitForm = async () => {
      try {
        let title;
        if (formState.id) {
          title = "編輯成功";
          await dispatch("schedule/editSeason");
        } else {
          title = "新增成功";
          await dispatch("schedule/addSeason");
        }
        modal.value = false;
        notification.success({
          message: title,
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err,
        });
      }
    };
    const deleteSeason = async (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("schedule/deleteSeason", id);
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
      permission,
      loading,
      columns,
      tableData,
      search,
      labelCol,
      wrapperCol,
      dateFormat,
      formState,
      rules,
      modal,
      closeModal,
      openAddModal,
      submitForm,
    };
  },
});
