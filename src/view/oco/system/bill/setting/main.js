import { computed, defineComponent, reactive, ref } from "vue";
import { ActionSpan } from "./style";
import { useStore } from "vuex";
import { Modal, notification } from "ant-design-vue";
import DataTables from "@/components/table/DataTable.vue";
import { usePermission } from "@/composable/permission";
import {
  electricContractTimePeriod,
  electricContractType,
  electricContractSupplyType,
} from "@/composable/options.js";
export default defineComponent({
  props: {},
  components: { DataTables },
  setup() {
    const { permission } = usePermission();
    const { dispatch } = useStore();
    const typeOptions = ref(electricContractSupplyType);
    const contractOptions = ref(electricContractType);
    const periodOptions = ref(electricContractTimePeriod);

    const modal = ref(false);

    const closeModal = () => {
      modal.value = false;
    };

    const openAddModal = () => {
      Object.assign(settings, settingObj);
      modal.value = true;
    };

    const openEditModal = (data) => {
      const obj = {
        title: data.name,
        ...data,
        // 確保新欄位有預設值，如果資料中沒有則使用 0
        nonSummerCapacity: data.nonSummerCapacity || 0,
        regularCapacity: data.regularCapacity || 0,
      };
      Object.assign(settings, obj);
      modal.value = true;
    };

    const columns = [
      { title: "名稱", dataIndex: "name", key: "name" },
      { title: "電號", dataIndex: "no", key: "no" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const tableData = computed(() =>
      state.bill.settingListTableData.map((el) => {
        return {
          name: el.name,
          no: el.no,
          action: (
            <ActionSpan>
              {permission.update && (
                <span onClick={() => openEditModal(el)}>
                  <unicon name="edit"></unicon>
                </span>
              )}
              {permission.delete && (
                <span onClick={() => deleteItem(el.id)}>
                  <unicon name="trash"></unicon>
                </span>
              )}
            </ActionSpan>
          ),
        };
      })
    );
    const settingObj = {
      id: null,
      no: null,
      title: "新增設定",
      name: null,
      type: "HighVoltage",
      contract: "Device",
      timePeriod: 2,
      capacity: 0,
      spareCapacity: 0,
      offPeakCapacity: 0,
      satHalfPeakCapacity: 0,
      halfPeakCapacity: 0,
      nonSummerCapacity: 0, // 非夏月契約容量
      regularCapacity: 0,   // 經常契約容量
    };

    // 計算屬性：是否顯示低壓需量契約非時間電價專用欄位
    const showLowVoltageDemandFields = computed(() => {
      const shouldShow = settings.type === "LowVoltage" && 
                        settings.contract === "Demand" && 
                        settings.timePeriod === 0;
      
      // 調試資訊
      console.log('showLowVoltageDemandFields 計算:', {
        type: settings.type,
        contract: settings.contract,
        timePeriod: settings.timePeriod,
        shouldShow: shouldShow
      });
      
      return shouldShow;
    });

    // 動態驗證規則，根據時段決定是否需要驗證容量欄位
    const rules = computed(() => {
      const baseRules = {
        no: [
          {
            required: true,
            message: "請輸入電號",
            trigger: "blur",
          },
        ],
        name: [
          {
            required: true,
            message: "請輸入名稱",
            trigger: "blur",
          },
        ],
      };

      // 如果不是非時間電價，則需要驗證容量欄位
      if (settings.timePeriod !== 0) {
        baseRules.capacity = [
          {
            required: true,
            message: "請輸入容量",
            trigger: "blur",
          },
        ];
        baseRules.spareCapacity = [
          {
            required: true,
            message: "請輸入容量",
            trigger: "blur",
          },
        ];
        baseRules.offPeakCapacity = [
          {
            required: true,
            message: "請輸入容量",
            trigger: "blur",
          },
        ];
        baseRules.satHalfPeakCapacity = [
          {
            required: true,
            message: "請輸入容量",
            trigger: "blur",
          },
        ];
        baseRules.halfPeakCapacity = [
          {
            required: true,
            message: "請輸入容量",
            trigger: "blur",
          },
        ];
      }

      return baseRules;
    });

    const settings = reactive({});
    const { state } = useStore();

    const loading = computed(() => state.bill.loading);

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

    const search = (e) => {
      dispatch("bill/filterSettingTable", e.target.value);
    };

    // 處理時段變化
    const onTimePeriodChange = (e) => {
      const timePeriod = e.target.value;

      // 如果選擇非時間電價，將相關欄位設為0
      if (timePeriod === 0) {
        settings.capacity = 0;
        settings.spareCapacity = 0;
        settings.offPeakCapacity = 0;
        settings.satHalfPeakCapacity = 0;
        settings.halfPeakCapacity = 0;
        
        // 如果是低壓需量契約，初始化新欄位
        if (settings.type === "LowVoltage" && settings.contract === "Demand") {
          settings.nonSummerCapacity = settings.nonSummerCapacity || 0;
          settings.regularCapacity = settings.regularCapacity || 0;
        }
      }
    };

    // 處理用電種類變化
    const onTypeChange = (value) => {
      // 當用電種類變化時，確保新欄位有預設值
      if (value === "LowVoltage" && settings.contract === "Demand" && settings.timePeriod === 0) {
        settings.nonSummerCapacity = settings.nonSummerCapacity || 0;
        settings.regularCapacity = settings.regularCapacity || 0;
      }
    };

    // 處理契約變化
    const onContractChange = (value) => {
      // 當契約變化時，確保新欄位有預設值
      if (settings.type === "LowVoltage" && value === "Demand" && settings.timePeriod === 0) {
        settings.nonSummerCapacity = settings.nonSummerCapacity || 0;
        settings.regularCapacity = settings.regularCapacity || 0;
      }
    };

    const saveSetting = async () => {
      try {
        let title;
        if (settings.id) {
          await dispatch("bill/editSetting", settings);
          title = "修改成功";
        } else {
          await dispatch("bill/addSetting", settings);
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

    const deleteItem = (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("bill/deleteSetting", id);
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

    return {
      permission,
      loading,
      modal,
      openAddModal,
      closeModal,
      columns,
      tableData,
      settings,
      rules,
      labelCol,
      wrapperCol,
      search,
      saveSetting,
      typeOptions,
      contractOptions,
      periodOptions,
      onTimePeriodChange,
      onTypeChange,
      onContractChange,
      showLowVoltageDemandFields,
    };
  },
});
