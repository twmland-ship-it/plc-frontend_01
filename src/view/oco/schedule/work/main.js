import { useStore } from "vuex";
import { Main, ActionSpan } from "../../styled";
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
import BasicSetting from "@/components/oco/form/schedule-work/Index.vue";
import TagSetting from "@/components/oco/form/uninstall-tag/Index.vue";
import { Modal, notification } from "ant-design-vue";
import dayjs from "dayjs";
import { useCronFormatter } from "@/composable/formatter";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    Main,
    DataTables,
    BasicSetting,
    TagSetting,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.schedule.loading);
    onMounted(async () => {
      const res = await Promise.all([
        dispatch("schedule/getWorkList"),
        dispatch("schedule/getWorkOption"),
      ]);
      seasonOptions.value = res[1].season;
      endTimeOptions.value = res[1].endTime;
      repeatOptions.value = res[1].repeat;
      tagClassOptions.value = res[1].tagClass;
      groupClassOptions.value = res[1].groupClass;
      searchTypeOptions.value = res[1].searchType;
    });

    const columns = [
      { title: "排程名稱", dataIndex: "name", key: "name" },
      { title: "測點數量", dataIndex: "tagCount", key: "tagCount" },
      { title: "開始時間", dataIndex: "startTime", key: "startTime" },
      { title: "季節/區間", dataIndex: "season", key: "season" },
      { title: "重複", dataIndex: "repeat", key: "repeat" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];
    const tableData = computed(() =>
      state.schedule.workTableData.map((el) => {
        return {
          name: el.name,
          tagCount: el.tags.length,
          startTime: el.startTime,
          season: el.season ? el.season.name : "無",
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
      dispatch("schedule/filterWork", e.target.value);
    };

    const seasonOptions = ref([]);
    const repeatOptions = ref([]);
    const tagClassOptions = ref([]);
    const groupClassOptions = ref([]);
    const searchTypeOptions = ref([]);
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
    provide("workBasicForm", formRef);
    const formState = reactive({
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
    });

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

    const dayObj = {
      1: "一",
      2: "二",
      3: "三",
      4: "四",
      5: "五",
      6: "六",
      0: "日",
    };

    const monthAdditionOptions = computed(() => {
      if (!formState.startTime) {
        return [];
      }

      const second = formState.startTime.second();
      const minute = formState.startTime.minute();
      const hour = formState.startTime.hour();
      const day = formState.startTime.day();
      const date = formState.startTime.date();
      const firstDayOfMonth = formState.startTime.startOf("month");
      const weekNumber = Math.floor(
        formState.startTime.diff(firstDayOfMonth, "day") / 7 + 1
      );

      return [
        {
          label: `每月第 ${weekNumber} 個 週${dayObj[day]}`,
          value: `${second} ${minute} ${hour} * * ${day}#${weekNumber}`,
        },
        {
          label: `每月第 ${date} 天`,
          value: `${second} ${minute} ${hour} ${date} * *`,
        },
      ];
    });

    const changeStartTime = () => {
      formState.repeatValue = null;
    };

    const changeRepeat = () => {
      formState.repeatValue = null;
      if (!formState.startTime) {
        return;
      }
      const second = formState.startTime.second();
      const minute = formState.startTime.minute();
      const hour = formState.startTime.hour();
      const day = formState.startTime.day();
      const date = formState.startTime.date();
      const month = formState.startTime.month();
      if (formState.repeat === "1") {
        formState.repeatLabel = `每日`;
        formState.repeatValue = `${second} ${minute} ${hour} * * *`;
      } else if (formState.repeat === "2") {
        formState.repeatLabel = `每週 ${dayObj[day]}`;
        formState.repeatValue = `${second} ${minute} ${hour} * * ${day}`;
      } else if (formState.repeat === "4") {
        formState.repeatLabel = `每年 ${month} 月 ${date} 日`;
        formState.repeatValue = `${second} ${minute} ${hour} ${date} ${month} *`;
      } else if (formState.repeat === "5") {
        formState.repeatLabel = `每個工作日`;
      } else if (formState.repeat === "6") {
        formState.repeatLabel = `每個非工作日`;
      }
    };

    const tagSettingData = ref([]);

    const tagSettingColumns = [
      {
        title: "測點名稱",
        dataIndex: "name",
      },
      {
        title: "送出訊號值",
        dataIndex: "signalValue",
        editable: true,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "70px",
      },
    ];

    const addTag = (tags) => {
      tagSettingData.value = [
        ...tagSettingData.value,
        ...tags.map((el) => ({ ...el, value: "", signalValue: "" })),
      ];
    };

    const editTag = ({ id, key, value }) => {
      tagSettingData.value.find((el) => el.id === id)[key] = value;
    };

    const deleteTag = (id) => {
      tagSettingData.value.splice(
        tagSettingData.value.indexOf(
          tagSettingData.value.find((el) => el.id === id)
        ),
        1
      );
    };

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
      tagSettingData.value = [];
      modal.value = true;
    };
    const openEditModal = ({
      id,
      name,
      tags,
      startTime,
      season,
      repeat,
      endTime,
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
      tagSettingData.value = tags;
      modal.value = true;
    };
    const submitingForm = ref(false);
    const submitForm = async () => {
      try {
        submitingForm.value = true;
        const failedArr = [];

        await formRef.value.validateFields().catch(() => {
          failedArr.push("基礎設定");
          return;
        });

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
          content: tagSettingData.value,
          tags: tagSettingData.value.map((el) => el.id),
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
          await dispatch("schedule/editWork", params);
        } else {
          title = "新增成功";
          await dispatch("schedule/addWork", params);
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
      seasonOptions,
      repeatOptions,
      endTimeOptions,
      tagClassOptions,
      groupClassOptions,
      searchTypeOptions,
      activeTab,
      modal,
      labelCol,
      wrapperCol,
      radioStyle,
      formState,
      rules,
      monthAdditionOptions,
      changeStartTime,
      changeRepeat,
      tagSettingData,
      tagSettingColumns,
      addTag,
      editTag,
      deleteTag,
      openAddModal,
      submitingForm,
      submitForm,
      closeModal,
      search,
    };
  },
});
