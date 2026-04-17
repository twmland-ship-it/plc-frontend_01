import { useStore } from "vuex";
import { Main } from "../../../styled.js";
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRaw,
  provide,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import DataTables from "@/components/table/DataTable.vue";
import { GroupMsgSpan, ActionSpan, Search } from "./style.js";
import { Modal, TreeSelect, notification } from "ant-design-vue";
import dayjs from "dayjs";
import TagSetting from "@/components/oco/form/tag-setting/TagSetting.vue";
import TagAlarm from "@/components/oco/form/tag-alarm/TagAlarm.vue";
import TagExp from "@/components/oco/form/tag-expression/TagExp.vue";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    Main,
    LevelSelect,
    TagSetting,
    TagAlarm,
    TagExp,
    DataTables,
    GroupMsgSpan,
    Search,
  },
  setup() {
    const { permission } = usePermission();
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const { dispatch, state } = useStore();
    const collapseKey = ref("1");
    onMounted(async () => {
      const res = await dispatch("tags/getAllTagsAndOptions");
      init.value = true;
      locations.value = res.locations;
      classOptions.value = res.tagClass;
      typeOptions.value = res.typeOptions;
      saveTypeOptions.value = res.saveTypeOptions;
      logTypeOptions.value = res.logTypeOptions;
      unitOptions.value = res.unitOptions;
      dataTypeOptions.value = res.dataTypeOptions;
      alarmStatusOptions.value = res.alarmStatusOptions;
      exceptionUntilOptions.value = res.exceptionUntilOptions;
      exceptionActionOptions.value = res.exceptionActionOptions;
      digitalAlarmValueOptions.value = res.digitalAlarmValueOptions;
      expressionTypeOptions.value = res.expressionTypeOptions;
    });

    onBeforeUnmount(() => {
      dispatch("tags/resetTagsState");
    });

    const init = ref(false);
    const loading = computed(() => state.tags.loading);
    const locations = ref([]);
    const typeOptions = ref([]);
    const saveTypeOptions = ref([]);
    const logTypeOptions = ref([]);
    const unitOptions = ref([]);
    const dataTypeOptions = ref([]);
    const classOptions = ref([]);
    const alarmStatusOptions = ref([]);
    const exceptionUntilOptions = ref([]);
    const exceptionActionOptions = ref([]);
    const digitalAlarmValueOptions = ref([]);
    const expressionTypeOptions = ref([]);

    const filterFormState = reactive({
      region: null,
      tagClass: null,
      text: null,
    });

    const search = (e) => {
      filterFormState.text = e.target.value;
    };

    const callFilter = () => {
      const schemes = [
        {
          type: "text",
          target: filterFormState.text,
        },
        {
          type: "list",
          target: filterFormState.region ? filterFormState.region : null,
          source: "RegionList",
          sourceProp: "Id",
        },
        {
          type: "list",
          target: filterFormState.tagClass ? filterFormState.tagClass : null,
          source: "TagCategoryList",
          sourceProp: "Id",
        },
      ];
      dispatch("tags/filterTagsTable", schemes);
    };

    watch(() => filterFormState, callFilter, { deep: true });
    watch(() => state.tags.tagInitData, callFilter, { deep: true });
    const columns = [
      {
        title: "名稱",
        dataIndex: "name",
        key: "name",
        fixed: "left",
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "地區",
        dataIndex: "locationName",
        key: "locationName",
        sorter: (a, b) => a.locationName.localeCompare(b.locationName),
      },
      {
        title: "說明",
        dataIndex: "description",
        key: "description",
        sorter: (a, b) => a.description.localeCompare(b.description),
      },
      {
        title: "裝置",
        dataIndex: "deviceName",
        key: "deviceName",
        sorter: (a, b) => a.deviceName.localeCompare(b.deviceName),
      },
      { title: "測點種類", dataIndex: "typeName", key: "typeName" },
      { title: "測點狀態", dataIndex: "signalStatus", key: "signalStatus" },
      { title: "測點現值", dataIndex: "currentValue", key: "currentValue" },
      { title: "操作", dataIndex: "action", key: "action" },
    ];

    const data = ref([]);

    watch(
      () => state.tags.tagTableData,
      async (newValue) => {
        if (newValue.length > 0) {
          const tagList = newValue.map((el) => el.Id);
          const currTagValueList = await dispatch(
            "tags/fetchTagListValue",
            tagList
          ).catch((err) => {
            console.log(err);
          });
          data.value = newValue.map((el) => {
            const tagClass = el.TagCategoryList.map(
              (el2) => el2[el2.length - 1].Id
            );
            return {
              ...el,
              name: el.SimpleName,
              tagClass,
              signalStatus: currTagValueList?.find((tag) => tag.Id === el.Id)
                ?.QualityText,
              currentValue: currTagValueList?.find((tag) => tag.Id === el.Id)
                ?.Value,
              location: el.RegionList[el.RegionList.length - 1].Id,
              locationName: el.RegionList.map((el) => el.Name).join(" > "),
              description: el.Description,
              deviceName: el.Device.Name,
              typeName: el.Type.Name,
              action: (
                <ActionSpan>
                  {permission.update && (
                    <span onClick={() => openEditModal(el.Id)}>
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
          });
        } else {
          data.value = [];
        }
      },
      { deep: true, immediate: true }
    );

    const modal = ref(false);
    const activeTab = ref("1");
    watch(modal, (_nextVisible) => {
    });

    const form = ref();
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

    provide("form", form);
    const formObj = {
      title: "新增測點",
      status: true,
      id: null,
      region: null,
      device: null,
      cctv: [],
      name: null,
      description: null,
      type: 1,
      saveType: 1,
      dataType: null,
      initValue: 0,
      retentive: false,
      valueAddress: null,
      dataInterval: 1000,
      closingContact: "NO",
      usage: "Normal",
      log: false,
      logInterval: null,
      logIntervalType: 1,
      tagClass: [],
      unit: null,
      ignore: null,
    };
    const formState = reactive({});
    Object.assign(formState, formObj);

    const setCCTV = (data) => {
      formState.cctv = data.map((el) => el.value);
    };

    const setDevice = (data) => {
      formState.device = data.value;
    };

    const alarmForm = ref();
    provide("alarmForm", alarmForm);
    const alarmObj = {
      status: 1,
      audio: false,
      page: null,
      exceptionStatus: false,
      exceptionStartAt: null,
      exceptionEndAt: null,
      exceptionUntil: null,
      exceptionAction: null,
      sop: null,
      notifyGroup: [],
      HHStatus: false,
      HHValue: "",
      HHContent: null,
      HIStatus: false,
      HIValue: "",
      HIContent: null,
      LOStatus: false,
      LOValue: "",
      LOContent: null,
      LLStatus: false,
      LLValue: "",
      LLContent: null,
      digAlarmStatus: false,
      digAlarmValue: null,
      digAlarmContent: null,
      digNorStatus: false,
      digNorValue: null,
      digNorContent: null,
    };

    const alarmFormState = reactive({});

    Object.assign(alarmFormState, alarmObj);

    const expForm = ref();
    provide("expForm", expForm);

    const expObj = {
      status: false,
      type: null,
      valueMultiple: null,
      transferMax: null,
      transferMin: null,
      max: null,
      min: null,
      tags: [],
      content: "",
    };
    const expFormstate = reactive({});
    Object.assign(expFormstate, expObj);

    const removeTag = (itemid) => {
      let index = expFormstate.tags.indexOf(
        expFormstate.tags.find((el) => el === itemid)
      );
      if (index !== -1) {
        expFormstate.content = expFormstate.content.replace(
          /@([^@]*)@/g,
          (match, id) => {
            if (id == itemid) {
              return "";
            } else {
              return match;
            }
          }
        );
        expFormstate.tags.splice(index, 1);
      }
    };
    const addTag = (data) => {
      expFormstate.tags
        ? (expFormstate.tags = [...expFormstate.tags, ...data])
        : (expFormstate.tags = data);

      for (let i = 0; i < data.length; i++) {
        expFormstate.content += `@${data[i]}@`;
      }
    };

    const editContent = (event) => {
      const res = event.replace(/@([^@]*)@/g, (match, name) => {
        const matchingTag = expFormstate.tags.find((tag) => tag.name === name);
        return matchingTag ? `@${matchingTag.id}@` : match;
      });
      expFormstate.content = res;
    };

    const openAddModal = () => {
      activeTab.value = "1";

      Object.assign(formState, formObj);

      Object.assign(alarmFormState, alarmObj);

      Object.assign(expFormstate, expObj);
      modal.value = true;
    };

    const openEditModal = async (elementId) => {
      activeTab.value = "1";
      const additionProps = await dispatch(
        "tags/fetchAdditionProps",
        elementId
      );
      const {
        Status: tagStatus,
        location,
        Device: device,
        CctvList: cctv,
        Id: id,
        name,
        Description: description,
        Type: type,
        SaveType: saveType,
        DataType: dataType,
        ValueAddress: valueAddress,
        DataInterval: dataInterval,
        IsLog: log,
        LogInterval: logInterval,
        LogInterValType: logIntervalType,
        InitialValue: initValue,
        ReTentive: retentive,
        tagClass,
        Unit: unit,
        Ignore: ignore,
        Alarm: alarm,
        IsUseExpression: expStatus,
        ExpressMode: expType,
        ExpressValue: valueMultiple,
        RelatedPage: page,
      } = data.value.find((el) => el.Id === elementId);
      const formObj = {
        title: "編輯測點",
        id,
        status: tagStatus,
        region: location,
        device: device.Id,
        cctv: cctv.map((el) => el.Id),
        name,
        description,
        type: type.Id,
        saveType: saveType.Id,
        dataType: dataType.Id,
        valueAddress,
        dataInterval,
        log,
        logInterval,
        logIntervalType: logIntervalType.Id,
        initValue,
        retentive,
        tagClass,
        unit: unit.Id,
        ignore,
        usage: additionProps[elementId]?.Usage,
        closingContact: additionProps[elementId]?.ContactType,
      };
      Object.assign(formState, formObj);
      if (alarm) {
        const {
          Status: status,
          Audio: audio,
          Sop: sop,
          NotifyGroup: notifyGroup,
          HHStatus,
          HHValue,
          HHContent,
          HIStatus,
          HIValue,
          HIContent,
          LOStatus,
          LOValue,
          LOContent,
          LLStatus,
          LLValue,
          LLContent,
          DigAlarmStatus: digAlarmStatus,
          DigAlarmValue: digAlarmValue,
          DigAlarmContent: digAlarmContent,
          DigNormalStatus: digNorStatus,
          DigNormalValue: digNorValue,
          DigNormalContent: digNorContent,
          AlarmException: exception,
        } = alarm;
        let exceptionObj = null;
        if (exception) {
          const {
            Status: exceptionStatus,
            StartAt: startAt,
            EndAt: endAt,
            Until: until,
            Action: action,
          } = exception;
          exceptionObj = {
            exceptionStatus,
            exceptionStartAt: startAt && dayjs(startAt, "HH:mm:ss"),
            exceptionEndAt: endAt && dayjs(endAt, "HH:mm:ss"),
            exceptionUntil: until.Id,
            exceptionAction: action.Id,
          };
        }

        const alarmObj = {
          status,
          audio,
          sop,
          page: page?.Id,
          notifyGroup: notifyGroup.map((el) => el.Id),
          HHStatus,
          HHValue,
          HHContent,
          HIStatus,
          HIValue,
          HIContent,
          LOStatus,
          LOValue,
          LOContent,
          LLStatus,
          LLValue,
          LLContent,
          digAlarmStatus,
          digAlarmValue,
          digAlarmContent,
          digNorStatus,
          digNorValue,
          digNorContent,
          ...exceptionObj,
        };
        Object.assign(alarmFormState, alarmObj);
      }

      // if (expression) {
      // const {
      //   status: expStatus,
      //   type: expType,
      //   content: expContent,
      //   tags: expTags,
      //   valueMultiple,
      //   transferMax,
      //   transferMin,
      //   max,
      //   min,
      // } = expression;

      const expObj = {
        status: expStatus,
        type: expType,
        valueMultiple,
        // transferMax,
        // transferMin,
        // max,
        // min,
        // tags: expTags && JSON.parse(JSON.stringify(expTags)),
        // content: expContent,
      };
      Object.assign(expFormstate, expObj);
      // }

      modal.value = true;
    };

    const closeModal = () => {
      modal.value = false;
    };

    const deleteItem = (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("tags/deleteTag", id);
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

    const submitingForm = ref(false);
    const modalSubmit = async () => {
      try {
        submitingForm.value = true;
        const failedArr = [];

        await form.value.validateFields().catch(() => {
          failedArr.push("基礎設定");
        });

        await alarmForm.value.validateFields().catch(() => {
          failedArr.push("警報設定");
        });

        await expForm.value.validateFields().catch(() => {
          failedArr.push("運算式設定");
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
        let title;
        const params = {
          ...formState,
          cctv: formState.cctv,
          region: toRaw(formState.region),
          alarm: {
            ...alarmFormState,
            notifyGroup: alarmFormState.notifyGroup,
            exceptionStartAt:
              alarmFormState.exceptionStartAt &&
              dayjs(alarmFormState.exceptionStartAt).format("HH:mm:ss"),
            exceptionEndAt:
              alarmFormState.exceptionStartAt &&
              dayjs(alarmFormState.exceptionEndAt).format("HH:mm:ss"),
          },

          expression: {
            ...toRaw(expFormstate),
          },
        };
        if (formState.id) {
          await dispatch("tags/edittag", params);
          title = "修改成功";
        } else {
          await dispatch("tags/addtag", params);
          title = "新增成功";
        }
        submitingForm.value = false;
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

    // const testModal = ref(false);
    // const currTagId = ref("");
    // const currTagName = ref("");
    // const currTagValue = ref();
    // const openTestModal = async ({ Id, Name, Unit }) => {
    //   try {
    //     const res = await dispatch("tags/fetchCurrTagValue", Id);
    //     currTagId.value = Id;
    //     currTagName.value = Name;
    //     currTagValue.value = `${res?.Value ?? null} ${Unit.Name}`;
    //     testModal.value = true;
    //   } catch (err) {
    //     Modal.error({
    //       title: "發生錯誤",
    //       content: err.message,
    //     });
    //   }
    // };

    // const closeTestModal = () => {
    //   testModal.value = false;
    // };

    return {
      permission,
      SHOW_PARENT,
      loading,
      collapseKey,
      locations,
      typeOptions,
      saveTypeOptions,
      logTypeOptions,
      unitOptions,
      dataTypeOptions,
      classOptions,
      alarmStatusOptions,
      exceptionUntilOptions,
      exceptionActionOptions,
      digitalAlarmValueOptions,
      expressionTypeOptions,
      filterFormState,
      search,
      activeTab,
      modal,
      formState,
      alarmFormState,
      expFormstate,
      removeTag,
      addTag,
      editContent,
      columns,
      data,
      labelCol,
      wrapperCol,
      openAddModal,
      openEditModal,
      closeModal,
      submitingForm,
      modalSubmit,
      // currTagId,
      // currTagName,
      // currTagValue,
      // testModal,
      // closeTestModal,
      setCCTV,
      setDevice,
    };
  },
});
