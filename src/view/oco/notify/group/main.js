import { Main } from "../../styled";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRaw,
} from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { useStore } from "vuex";
import { Modal, notification } from "ant-design-vue";
import { ActionSpan, EmailListTitle } from "./style";
import { usePermission } from "@/composable/permission";
import dayjs from "dayjs";
export default defineComponent({
  components: {
    Main,
    DataTables,
    ActionSpan,
    EmailListTitle,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.notify.loading);
    const typeOptions = ref([]);
    const lineOptions = ref([]);
    const durationOptions = ref([]);
    onMounted(async () => {
      try {
        const res = await Promise.all([
          dispatch("notify/getGroupsAndOptions"),
          dispatch("notify/getLineService"),
        ]);

        typeOptions.value = res[0].type;
        // 手動添加 EMAIL 選項
        if (!typeOptions.value.find(option => option.Id === 3)) {
          typeOptions.value.push({
            Id: 3,
            Name: "Email"
          });
        }

        durationOptions.value = res[0].duration;
        lineOptions.value = state.notify.lineServiceInitData;
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    });

    const columns = [
      { title: "群組名稱", dataIndex: "name", key: "name" },
      {
        title: "發送類型",
        dataIndex: "typeName",
        key: "typeName",
      },
      { title: "發送時間", dataIndex: "time", key: "time" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const tableData = computed(() =>
      state.notify.groupTableData.map((el) => {
        return {
          id: el.id,
          name: el.Name,
          type: el.InformMethod,
          typeName: el.InforMethodText,
          time: `${el.StartTime} 至 ${el.DurationUntilText} ${el.EndTime}`,
          action: (
            <ActionSpan>
              {permission.update && (
                <span onClick={() => openEditModal(el)}>
                  <unicon name="edit"></unicon>
                </span>
              )}
              {permission.delete && (
                <span onClick={() => deleteGroup(el.Id)}>
                  <unicon name="trash"></unicon>
                </span>
              )}
            </ActionSpan>
          ),
        };
      })
    );

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
    const formState = reactive({
      id: null,
      title: "",
      name: "",
      starttime: null,
      until: null,
      endtime: null,
      type: null,
      line: null,
      values: [],
    });

    const formColumn = computed(() => [
      {
        title: "名稱",
        dataIndex: "name",
        key: "name",
        width: 150,
        fixed: "left",
      },
      {
        title: formState.type === 3 ? "Email" : "手機號碼",
        dataIndex: "value",
        key: "value",
        width: 200,
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        width: 100,
        align: "right",
      },
    ]);

    const changeListData = (e, { idx, key }) => {
      formState.values[idx][key] = e.target.value;
    };

    const addNewList = () => {
      formState.values.push({ name: "", value: "" });
    };

    const deleteList = (idx) => {
      formState.values.splice(idx, 1);
    };

    const rules = {
      name: [{ required: true, trigger: "blur", message: "請輸入群組名稱" }],
      type: [{ required: true, trigger: "blur", message: "選擇發送類型" }],
      starttime: [
        { required: true, trigger: "blur", message: "請選擇開始日期" },
      ],
      endtime: [{ required: true, trigger: "blur", message: "請選擇結束日期" }],
    };

    const openAddModal = () => {
      const obj = {
        id: null,
        title: "新增群組",
        name: "",
        starttime: null,
        until: 1,
        endtime: null,
        type: null,
        line: null,
        values: [],
      };
      Object.assign(formState, obj);
      modal.value = true;
    };
    const openEditModal = ({
      Id,
      Name,
      StartTime,
      EndTime,
      DurationUntil,
      InformMethod,
      // lineId,
      GroupDetail,
    }) => {
      const obj = {
        id: Id,
        title: "編輯群組",
        name: Name,
        starttime: dayjs(StartTime, "HH:mm:ss"),
        endtime: dayjs(EndTime, "HH:mm:ss"),
        until: DurationUntil,
        type: InformMethod,
        // line: lineId,
        values:
          GroupDetail &&
          JSON.parse(
            JSON.stringify(
              GroupDetail.map((el) => ({ name: el.Name, value: el.SendTarget }))
            )
          ),
      };
      Object.assign(formState, obj);
      modal.value = true;
    };

    const closeModal = () => {
      modal.value = false;
    };

    const deleteGroup = (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("notify/deleteGroup", id);
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

    const search = (e) => {
      dispatch("notify/filterGroupTable", e.target.value);
    };

    const submitForm = async () => {
      try {
        let errMsg = null;
        for (let i = 0; i < formState.values.length; i++) {
          if (!formState.values[i].name || !formState.values[i].value) {
            errMsg = "發送列表請填寫完整";
            break;
          }
          
          // 根據發送方式檢查不同格式
          if (formState.type === 3) {
            // EMAIL 格式檢查
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formState.values[i].value)) {
              errMsg = `${formState.values[i].name} Email 格式錯誤`;
              break;
            }
          } else {
            // 手機號碼格式檢查 (簡訊和語音)
            const phoneRegex = /^09[0-9]{8}$/;
            if (!phoneRegex.test(formState.values[i].value)) {
              errMsg = `${formState.values[i].name} 手機格式錯誤`;
              break;
            }
          }
        }

        if (errMsg) {
          Modal.error({
            title: errMsg,
          });
          return;
        }
        let title;
        if (formState.id) {
          title = "編輯成功";
          await dispatch("notify/editGroup", {
            ...toRaw(formState),
            starttime: dayjs(formState.starttime).format("HH:mm:ss"),
            endtime: dayjs(formState.endtime).format("HH:mm:ss"),
          });
        } else {
          title = "新增成功";
          await dispatch("notify/addGroup", {
            ...toRaw(formState),
            starttime: dayjs(formState.starttime).format("HH:mm:ss"),
            endtime: dayjs(formState.endtime).format("HH:mm:ss"),
          });
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

    return {
      permission,
      loading,
      typeOptions,
      lineOptions,
      durationOptions,
      columns,
      tableData,
      modal,
      formState,
      formColumn,
      changeListData,
      addNewList,
      deleteList,
      rules,
      labelCol,
      wrapperCol,
      openAddModal,
      closeModal,
      search,
      submitForm,
    };
  },
});
