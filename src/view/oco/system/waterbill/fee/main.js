import {
  defineComponent,
  ref,
  reactive,
  computed,
  toRaw,
  onMounted,
} from "vue";
import { useStore } from "vuex";
import DataTables from "@/components/table/DataTable.vue";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
import { ActionSpan } from "./style";
export default defineComponent({
  components: { DataTables },
  setup() {
    onMounted(async () => {
      await dispatch("waterbill/fetchFeeList");
    });

    const loading = computed(() => state.waterbill.loading);
    const { permission } = usePermission();
    const { dispatch, state } = useStore();

    const fee = ref(null);

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

    const formState = reactive({});
    const formStateObj = {
      mode: "create",
      title: "新增設定",
      year: "",
      month: "",
      basicFee: 0,
      detail: [],
    };

    const columns = [
      {
        title: "時間",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const tableData = computed(() =>
      state.waterbill.feeListTableData.map((el) => ({
        date: `${el.Year}-${el.Month}`,
        action: (
          <ActionSpan>
            {permission.update && (
              <span onClick={() => openEditModal(el)}>
                <unicon name="edit"></unicon>
              </span>
            )}
            {permission.delete && (
              <span onClick={() => deleteItem(el)}>
                <unicon name="trash"></unicon>
              </span>
            )}
          </ActionSpan>
        ),
      }))
    );

    const addLevel = () => {
      formState.detail.push({
        Fee: 0,
        FromDegree: 0,
        AccumulatedDifference: 0,
      });
    };

    const modal = ref(false);
    const openAddModal = () => {
      Object.assign(formState, JSON.parse(JSON.stringify(formStateObj)));

      modal.value = true;
    };

    const openEditModal = async ({ Year, Month }) => {
      const res = await dispatch("waterbill/fetchFeeDetail", {
        year: Year,
        month: Month,
      });

      const obj = {
        mode: "edit",
        title: `編輯${Year}-${Month}`,
        year: Year,
        month: Month,
        basicFee: res.BasicFee,
        detail: res.RateItems,
      };

      Object.assign(formState, obj);
      modal.value = true;
    };

    const closeModal = () => {
      modal.value = false;
    };

    const deleteItem = ({ Year, Month }) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("waterbill/deleteFee", {
              year: Year,
              month: Month,
            });
            Modal.success({
              content: "刪除成功",
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
        if (formState.mode === "create") {
          await dispatch("waterbill/addFee", toRaw(formState));
          title = "新增成功";
        } else {
          await dispatch("waterbill/editFee", toRaw(formState));
          title = "修改成功";
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

    return {
      addLevel,
      loading,
      columns,
      fee,
      labelCol,
      wrapperCol,
      formState,
      tableData,
      modal,
      openAddModal,
      closeModal,
      permission,
      submit,
    };
  },
});
