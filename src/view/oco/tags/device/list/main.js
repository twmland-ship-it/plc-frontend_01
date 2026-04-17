import { useStore } from "vuex";
import {
  computed,
  defineComponent,
  reactive,
  ref,
  onMounted,
  onBeforeUnmount,
  watch,
} from "vue";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import DataTables from "@/components/table/DataTable.vue";
import { ActionSpan, Search } from "./style.js";
import { Modal, TreeSelect, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
import { useDatatableFilter } from "@/composable/filter.js";
import dayjs from "dayjs";
export default defineComponent({
  components: { LevelSelect, DataTables, Search },
  setup() {
    const { permission } = usePermission();
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const { dispatch, state } = useStore();
    const loading = computed(() => state.device.loading);
    const collapseKey = ref("1");
    onMounted(async () => {
      const res = await Promise.all([
        dispatch("device/getAllDeviceAndOptions"),
      ]);
      locations.value = res[0].locations;
      rateOptions.value = res[0].rateOptions;
      channelOptions.value = res[0].channelOptions;
      dataFormateOptions.value = res[0].dataFormateOptions;
      addressStartOptions.value = res[0].addressStartOptions;
      deviceClassOptions.value = res[0].deviceClassOptions;
      config.value = {
        TCP: [
          {
            label: "資料格式",
            type: "select",
            value: "dataFormate",
            options: res[0].dataFormateOptions,
          },
          {
            label: "資料位址起始值",
            type: "select",
            value: "addressStart",
            options: res[0].addressStartOptions,
          },
          {
            label: "IP",
            type: "input",
            value: "ip",
          },
          {
            label: "Port",
            type: "input",
            value: "TCPPort",
          },
          {
            label: "站號",
            type: "input",
            value: "station",
          },
        ],
        OBIX: [
          {
            label: "Endpoint",
            type: "input",
            value: "endpoint",
          },
          {
            label: "使用者帳號",
            type: "input",
            value: "username",
          },
          {
            label: "使用者密碼",
            type: "input",
            value: "password",
          },
        ],
        "Desigo CC": [
          {
            label: "web應用程式名稱",
            type: "input",
            value: "webAppName",
          },
          {
            label: "系統名稱",
            type: "input",
            value: "systemName",
          },
          {
            label: "系統編號",
            type: "input",
            value: "systemId",
          },
          {
            label: "使用者帳號",
            type: "input",
            value: "username",
          },
          {
            label: "使用者密碼",
            type: "input",
            value: "password",
          },
          {
            label: "Endpoint",
            type: "input",
            value: "endpoint",
          },
        ],
      };

      init.value = true;
    });

    onBeforeUnmount(() => {
      dispatch("device/resetState");
    });

    const config = ref();
    const importChannelType = [4, 5];
    const init = ref(false);
    const rateOptions = ref([]);
    const channelOptions = ref([]);
    const dataFormateOptions = ref([]);
    const addressStartOptions = ref([]);
    const deviceClassOptions = ref([]);

    const locations = ref([]);

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
    const filterFormState = reactive({
      region: null,
      class: null,
      targetChannel: null,
      text: null,
    });

    const columns = [
      {
        title: "名稱",
        dataIndex: "DeviceName",
        key: "DeviceName",
        sorter: (a, b) => a.DeviceName.localeCompare(b.DeviceName),
        fixed: "left",
      },
      {
        title: "Channel",
        dataIndex: "channelName",
        key: "channelName",
        sorter: (a, b) => a.channelName.localeCompare(b.channelName),
      },
      {
        title: "地區",
        dataIndex: "locationName",
        key: "locationName",
        sorter: (a, b) => a.locationName.localeCompare(b.locationName),
      },
      { title: "狀態", dataIndex: "statusName", key: "statusName" },
      {
        title: "上次匯入時間",
        dataIndex: "lastImportTime",
        key: "lastImportTime",
      },
      {
        title: "匯入狀態",
        dataIndex: "importStatus",
        key: "importStatus",
      },
      { title: "操作", dataIndex: "action", key: "action" },
    ];

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
          target: filterFormState.class ? filterFormState.class : null,
          source: "DeviceCategoryList",
          sourceProp: "Id",
        },
        {
          type: "element",
          target: filterFormState.targetChannel,
          source: "TagChannel",
          sourceProp: "Id",
        },
      ];
      dispatch("device/filterTagsDeviceTable", schemes);
    };
    watch(() => filterFormState, callFilter, { deep: true });
    watch(() => state.device.deviceInitData, callFilter, { deep: true });

    const data = computed(() => {
      if (init.value) {
        return state.device.deviceTableData.map((el) => {
          return {
            ...el,
            lastImportTime: !importChannelType.includes(el.TagChannel.TypeCode)
              ? null
              : el.LastDownLoadTagTime
              ? dayjs(el.LastDownLoadTagTime).format("YYYY-MM-DD HH:mm:ss")
              : "未匯入",
            importStatus: !importChannelType.includes(el.TagChannel.TypeCode)
              ? null
              : el.DownLoadTagOK
              ? "已完成"
              : "匯入中",
            locationName: el.RegionList.map((el) => el.Name).join(" > "),
            channelName: el.TagChannel.Name,
            statusName: statusOptions.find(
              (status) => status.value === el.Status
            ).label,
            action: (
              <ActionSpan>
                {permission.update &&
                  importChannelType.includes(el.TagChannel.TypeCode) && (
                    <span
                      onClick={() =>
                        importTagData(el.DeviceId, el.DownLoadTagOK)
                      }
                    >
                      <unicon name="refresh"></unicon>
                    </span>
                  )}
                {permission.update &&
                  importChannelType.includes(el.TagChannel.TypeCode) && (
                    <span
                      onClick={() =>
                        compareTag({
                          id: el.DeviceId,
                          importDone: el.DownLoadTagOK,
                          name: el.DeviceName,
                        })
                      }
                    >
                      <unicon name="file-check-alt"></unicon>
                    </span>
                  )}
                {permission.update && (
                  <span onClick={() => openEditModal(el.DeviceId)}>
                    <unicon name="edit"></unicon>
                  </span>
                )}
                {permission.delete && (
                  <span onClick={() => deleteItem(el.DeviceId)}>
                    <unicon name="trash"></unicon>
                  </span>
                )}
              </ActionSpan>
            ),
          };
        });
      } else {
        return [];
      }
    });

    const search = (e) => {
      filterFormState.text = e.target.value;
    };

    const modal = ref(false);
    const formState = reactive({
      title: "",
      id: null,
      name: null,
      description: null,
      channel: null,
      channelType: null,
      status: null,
      regionId: null,
      classId: null,
      ip: null,
      TCPPort: null,
      rate: null,
      RTUPort: null,
      station: null,
      dataFormate: null,
      addressStart: null,
      endpoint: null,
      username: null,
      password: null,
      webAppName: null,
      systemName: null,
      systemId: null,
    });
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

    const checkChannelType = computed(() => {
      if (formState.channel) {
        const tar = channelOptions.value.find(
          (el) => el.Id === formState.channel
        );
        return tar.TypeName;
      }
      return null;
    });

    const rules = {
      name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
      description: [{ required: true, message: "請輸入說明", trigger: "blur" }],
      channel: [{ required: true, message: "請選擇", trigger: "blur" }],
      regionId: [{ required: true, message: "請選擇", trigger: "blur" }],
      ip: [{ required: true, message: "請輸入IP", trigger: "blur" }],
      TCPPort: [{ required: true, message: "請輸入Port", trigger: "blur" }],
      RTUPort: [{ required: true, message: "請輸入Port", trigger: "blur" }],
      rate: [{ required: true, message: "請選擇包率", trigger: "blur" }],
      station: [{ required: true, message: "請輸入站號", trigger: "blur" }],
      dataFormate: [{ required: true, message: "請選擇格式", trigger: "blur" }],
      addressStart: [{ required: true, message: "請選擇", trigger: "blur" }],
      endpoint: [
        { required: true, message: "請輸入Endpoint", trigger: "blur" },
      ],
      username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
      password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
      webAppName: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
      systemName: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
      systemId: [{ required: true, message: "請輸入ID", trigger: "blur" }],
    };
    const openAddModal = () => {
      const obj = {
        title: "新增裝置",
        id: null,
        name: null,
        description: null,
        dataFormate: null,
        addressStart: null,
        channel: null,
        channelType: null,
        ip: null,
        TCPPort: null,
        rate: null,
        RTUPort: null,
        station: null,
        status: true,
        regionId: null,
        classId: null,
        endpoint: null,
        username: null,
        password: null,
      };
      Object.assign(formState, obj);
      modal.value = true;
    };

    const openEditModal = (id) => {
      formState.title = "編輯裝置";
      const tar = data.value.find((el) => el.DeviceId === id);
      formState.id = tar.DeviceId;
      formState.name = tar.DeviceName;
      formState.description = tar.Description;
      formState.channel = tar.TagChannel.Id;
      formState.channelType = tar.TagChannel.TypeName;
      formState.ip = tar.Ip;
      formState.TCPPort = tar.Port;
      formState.rate = tar.BaudRate;
      formState.RTUPort = tar.RtuPort;
      formState.station = tar.StationNo;
      formState.dataFormate = tar.DeviceDataFormat.Id;
      formState.addressStart = tar.DeviceDataAddressFrom.Id;
      formState.regionId = tar.RegionList[tar.RegionList.length - 1].Id;
      formState.endpoint =
        tar.ObixProtocalPrefix !== "" ? tar.ObixProtocalPrefix : tar.EndPoint;
      formState.username = tar.UserName;
      formState.password = tar.Password;
      formState.webAppName = tar.WebAppName;
      formState.systemName = tar.SystemName;
      formState.systemId = tar.SystemId;
      (formState.classId =
        tar.DeviceCategoryList[tar.DeviceCategoryList.length - 1].Id),
        (formState.status = tar.Status);
      console.log(tar.TagChannel.TypeName);
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
            await dispatch("device/deleteDevice", id);
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
    const submitForm = async () => {
      try {
        let title;
        if (formState.id) {
          await dispatch("device/editDevice", formState);
          title = "修改成功";
        } else {
          await dispatch("device/addDevice", formState);
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

    const importTagData = async (id, importDone) => {
      if (!importDone) {
        Modal.error({
          title: "發生錯誤",
          content: "資料已在匯入中，請勿重複匯入",
        });
        return;
      }
      Modal.confirm({
        title: "確認匯入?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("device/importTag", id);
            Modal.success({
              content: "已開始匯入程序",
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

    const showSelected = ref(false);
    const searchText = ref("");
    const compareFormState = reactive({
      id: null,
      name: null,
      tags: [],
    });
    const compareModal = ref(false);
    const compareInitData = ref([]);
    const compareLoading = ref(false);
    const compareTableData = computed(() => {
      const rawData = useDatatableFilter(
        compareInitData.value,
        searchText.value
      );
      if (!showSelected.value) return rawData;
      return rawData.filter((el) => compareSelected.value.includes(el.Name));
    });
    const compareColumns = [
      { title: "名稱", dataIndex: "Name", key: "Name" },
      {
        title: "描述",
        dataIndex: "Description",
        key: "Description",
      },
      {
        title: "地區",
        dataIndex: "Location",
        key: "Location",
        align: "left",
      },
    ];
    const compareSelected = computed(() => compareFormState.tags);

    const compareTag = async ({ id, importDone, name }) => {
      if (!importDone) {
        Modal.error({
          title: "發生錯誤",
          content: "測點匯入中，請稍後",
        });
        return;
      }
      try {
        const res = await dispatch("device/getCompareTable", id);
        compareFormState.id = id;
        compareFormState.name = name;

        compareInitData.value = res.map((el) => {
          return {
            ...el,
            key: el.Name,
          };
        });
        const selectedTag = [];
        compareInitData.value.forEach((el) => {
          el.Selected && selectedTag.push(el.Name);
        });
        compareFormState.tags = selectedTag;
        compareModal.value = true;
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const searchCompareTable = (e) => {
      compareLoading.value = true;
      searchText.value = e.target.value;
      compareLoading.value = false;
    };

    const setTags = (data) => {
      const allTableData = compareTableData.value.map((el) => el.Name);
      const filteredB = compareFormState.tags.filter(
        (item) => !allTableData.includes(item)
      );
      const result = filteredB.concat(data);
      compareFormState.tags = result;
    };

    const closeCompareModal = () => {
      compareModal.value = false;
      searchText.value = "";
    };

    const compareSubmit = async () => {
      try {
        const params = {
          id: compareFormState.id,
          tags: compareFormState.tags.map((el) =>
            compareInitData.value.find((item) => item.Name === el)
          ),
        };

        await dispatch("device/compareTags", params);
        notification.success({
          message: "成功導入測點",
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    // const copyFrom = (targetid) => {
    //   const {
    //     id,
    //     description,
    //     channel,
    //     ip,
    //     Port,
    //     BaudRate,
    //     RtuPort,
    //     station,
    //     dataFormat,
    //     addressStart,
    //     status,
    //   } = data.value.find((el) => el.id === targetid);
    //   formState.title = "複製裝置";
    //   formState.id = id;
    //   formState.name = null;
    //   formState.description = description;
    //   formState.channel = channel.id;
    //   formState.ip = ip;
    //   formState.TCPPort = Port;
    //   formState.rate = BaudRate;
    //   formState.RTUPort = RtuPort;
    //   formState.station = station;
    //   formState.dataFormate = dataFormat.id;
    //   formState.addressStart = addressStart.id;
    //   formState.status = status;
    //   modal.value = true;
    // };

    return {
      config,
      permission,
      SHOW_PARENT,
      loading,
      collapseKey,
      locations,
      rateOptions,
      channelOptions,
      dataFormateOptions,
      addressStartOptions,
      deviceClassOptions,
      statusOptions,
      filterFormState,
      modal,
      formState,
      checkChannelType,
      rules,
      columns,
      data,
      search,
      labelCol,
      wrapperCol,
      openAddModal,
      openEditModal,
      closeModal,
      submitForm,
      compareModal,
      closeCompareModal,
      showSelected,
      compareTableData,
      compareColumns,
      compareSelected,
      searchCompareTable,
      setTags,
      compareTag,
      compareSubmit,
      compareFormState,
      compareLoading,
    };
  },
});
