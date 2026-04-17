import { Main } from "../../styled";
import DataTables from "@/components/table/DataTable.vue";
import {
  defineComponent,
  computed,
  onMounted,
  reactive,
  ref,
  toRaw,
} from "vue";
import { useStore } from "vuex";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    Main,
    DataTables,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.notify.loading);
    onMounted(async () => {
      const res = await Promise.all([
        dispatch("notify/getMsgHistory"),
        dispatch("notify/getMsgOptions"),
      ]);
      groupOptions.value = res[1].groups;
    });
    const columns = [
      { title: "訊息內容", dataIndex: "content", key: "content" },
      { title: "群組", dataIndex: "groups", key: "groups" },
      {
        title: "時間",
        dataIndex: "time",
        align: "right",
        key: "time",
      },
    ];
    const tableData = computed(() =>
      state.notify.historyMsgTableData.map((el) => {
        return {
          ...el,
          groups: el.groups.join(","),
        };
      })
    );

    const search = (e) => {
      dispatch("notify/filterHistoryTable", e.target.value);
    };

    const modal = ref(false);
    const groupOptions = ref([]);

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
      content: "",
      groups: [],
    });

    const rules = {
      content: [{ required: true, trigger: "blur", message: "請輸入內容" }],
      groups: [{ required: true, trigger: "blur", message: "請選擇群組" }],
    };

    const openAddModal = () => {
      formState.content = "";
      formState.groups = [];
      modal.value = true;
    };

    const closeModal = () => {
      modal.value = false;
    };

    const submitForm = async () => {
      try {
        await dispatch("notify/sendMsg", toRaw(formState));
        modal.value = false;
        notification.success({
          message: "發送成功",
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err,
        });
      }
    };

    return {
      permission,
      loading,
      columns,
      tableData,
      search,
      labelCol,
      wrapperCol,
      formState,
      rules,
      modal,
      groupOptions,
      openAddModal,
      closeModal,
      submitForm,
    };
  },
});
