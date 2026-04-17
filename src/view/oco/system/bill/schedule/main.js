import { useStore } from "vuex";
import { ActionSpan } from "../../../styled";
import {
  computed,
  defineComponent,
  onMounted,
  provide,
  reactive,
  ref,
  toRaw,
} from "vue";
import DataTables from "@/components/table/DataTable.vue";
import BasicSetting from "@/components/oco/util/schedule-basic/Index.vue";
import MeterSetting from "@/components/oco/bill/meter-setting/Index.vue";
import { Modal, notification } from "ant-design-vue";
import dayjs from "dayjs";
import { useCronFormatter } from "@/composable/formatter";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  props: {
    settingOptions: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    DataTables,
    BasicSetting,
    MeterSetting,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.bill.loading);
    onMounted(async () => {
      const res = await Promise.all([
        dispatch("bill/getSchedule"),
        dispatch("schedule/getWorkOption"),
      ]);
      endTimeOptions.value = res[1].endTime;
      repeatOptions.value = res[1].repeat;
    });

    const columns = [
      { title: "排程名稱", dataIndex: "name", key: "name" },
      { title: "開始時間", dataIndex: "startTime", key: "startTime" },
      { title: "重複", dataIndex: "repeat", key: "repeat" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];
    const tableData = computed(() =>
      state.bill.scheduleTableData.map((el) => {
        return {
          name: el.name,
          startTime: el.startTime,
          repeat: useCronFormatter(el.repeat.cron, el.repeat.count),
          action: (
            <ActionSpan>
              {permission.update && (
                <span onClick={() => openEditModal(el)}>
                  <unicon name="edit"></unicon>
                </span>
              )}
              {permission.delete && (
                <span onClick={() => deleteWork(el.id)}>
                  <unicon name="trash"></unicon>
                </span>
              )}
            </ActionSpan>
          ),
        };
      })
    );
    const search = (e) => {
      dispatch("bill/filterSchedule", e.target.value);
    };

    const repeatOptions = ref([]);
    const endTimeOptions = ref([]);
    const activeTab = ref("1");

    const modal = ref(false);
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

    const radioStyle = reactive({
      display: "flex",
      marginTop: "0.2rem",
    });

    const formRef = ref();
    provide("basicForm", formRef);
    const formState = reactive({
      id: null,
      name: "",
      startTime: null,
      repeatCount: 1,
      repeat: null,
      repeatValue: null,
      repeatLabel: null,
      endTime: "1",
      endTimeAddition: {},
    });

    const updateBasicForm = (data) => {
      Object.assign(formState, data);
    };

    const validateEndTimeAddition = async () => {
      const selectEndTimeType = endTimeOptions.value.find(
        (el) => el.id === formState.endTime
      );
      if (
        selectEndTimeType &&
        selectEndTimeType.settings &&
        !formState.endTimeAddition[formState.endTime]
      )
        return Promise.reject("請輸入");
      return Promise.resolve();
    };

    const rules = {
      name: { required: true, trigger: "blur", message: "請填入名稱" },
      tags: { required: true, trigger: "blur", message: "請選擇" },
      startTime: { required: true, trigger: "blur", message: "請選擇" },
      repeatCount: { required: true, trigger: "blur", message: "請選擇" },
      repeat: { required: true, trigger: "blur", message: "請選擇" },
      repeatValue: { required: true, trigger: "blur", message: "請選擇" },
      endTimeAddition: [
        { required: true, trigger: "blur", message: "請選擇" },
        { validator: validateEndTimeAddition },
      ],
    };

    const meterObj = {
      meters: [],
      date: 1,
    };
    const meterFormState = reactive(meterObj);

    const openAddModal = () => {
      const obj = {
        id: null,
        name: "",
        startTime: null,
        season: null,
        repeatCount: 1,
        repeat: null,
        repeatValue: null,
        repeatLabel: null,
        endTime: "1",
        endTimeAddition: {},
      };
      Object.assign(formState, obj);

      Object.assign(meterFormState, meterObj);
      modal.value = true;
    };
    const openEditModal = ({
      id,
      name,
      startTime,
      season,
      repeat,
      endTime,
      meter,
    }) => {
      const obj = {
        id,
        name,
        startTime: dayjs(startTime, "YYYY-MM-DD HH:mm:ss"),
        season: season ? season.id : null,
        repeatCount: repeat.count,
        repeat: repeat.type,
        repeatValue: repeat.cron,
        repeatLabel: repeat.text,
        endTime: endTime.id,
        endTimeAddition: {
          [endTime.id]: dayjs(endTime.value, "YYYY-MM-DD HH:mm:ss").isValid()
            ? dayjs(endTime.value, "YYYY-MM-DD HH:mm:ss")
            : endTime.value,
        },
      };
      Object.assign(formState, obj);
      const meterObj = {
        meters: meter.meters,
        date: meter.date,
      };
      Object.assign(meterFormState, meterObj);
      modal.value = true;
    };

    const submitingForm = ref(false);
    const submitForm = async () => {
      try {
        submitingForm.value = true;
        const failedArr = [];

        await formRef.value.validateFields().catch(() => {
          failedArr.push("基礎設定");
        });

        if (meterFormState.meters.length === 0) {
          failedArr.push("電錶設定");
        }

        if (failedArr.length > 0) {
          let str = "";
          failedArr.forEach((el) => (str += `"${el}" `));
          str += `尚未設置完成`;
          Modal.error({
            title: "請將欄位填寫完整",
            content: str,
          });
          submitingForm.value = false;
          return;
        }

        const params = {
          ...toRaw(formState),
          startTime: formState.startTime.format("YYYY-MM-DD HH:mm:ss"),
          endTimeValue: dayjs(
            formState.endTimeAddition[formState.endTime],
            "YYYY-MM-DD HH:mm:ss"
          ).isValid()
            ? formState.endTimeAddition[formState.endTime].format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : formState.endTimeAddition[formState.endTime],
        };

        let title;
        if (params.id) {
          title = "編輯成功";
          await dispatch("bill/editSchedule", params);
        } else {
          title = "新增成功";
          await dispatch("bill/addSchedule", params);
        }
        submitingForm.value = false;
        modal.value = false;
        notification.success({
          message: title,
        });
      } catch (err) {
        submitingForm.value = false;
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const closeModal = () => {
      modal.value = false;
    };

    const deleteWork = async (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("schedule/deleteWork", id);
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
      repeatOptions,
      endTimeOptions,
      activeTab,
      modal,
      labelCol,
      wrapperCol,
      radioStyle,
      formState,
      updateBasicForm,
      rules,
      meterFormState,
      openAddModal,
      submitingForm,
      submitForm,
      closeModal,
      search,
    };
  },
});
