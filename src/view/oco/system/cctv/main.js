import { useStore } from "vuex";
import { Main } from "../../styled.js";
import {
  computed,
  defineComponent,
  onMounted,
  onBeforeUnmount,
  reactive,
  ref,
  toRaw,
  watch,
} from "vue";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import DataTables from "@/components/table/DataTable.vue";
import { ActionSpan } from "./style.js";
import { Modal, TreeSelect, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
import cctvStream from "@/components/oco/util/cctvModal/Index.vue";
export default defineComponent({
  components: { Main, LevelSelect, DataTables, cctvStream },
  setup() {
    const { permission } = usePermission();
    const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const { dispatch, state } = useStore();
    const loading = computed(() => state.cctv.loading);
    const init = ref(false);
    onMounted(async () => {
      const res = await dispatch("cctv/getAllCCTVAndOptions");
      locations.value = res.locations;
      init.value = true;
    });
    onBeforeUnmount(() => {
      dispatch("cctv/resetCCTVState");
    });
    const locations = ref([]);
    const searching = ref(false);
    const filterFormState = reactive({
      region: null,
      text: null,
    });

    const columns = [
      { title: "名稱", dataIndex: "Name", key: "Name" },
      { title: "地區", dataIndex: "locationName", key: "locationName" },
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
      ];
      dispatch("cctv/filterCCTVTable", schemes);
    };
    watch(() => filterFormState, callFilter, { deep: true });
    watch(() => state.cctv.initData, callFilter, { deep: true });

    const tableData = computed(() => {
      return state.cctv.tableData.map((el) => {
        return {
          ...el,
          locationName: el.RegionList.map((el) => el.Name).join(" > "),
          action: (
            <ActionSpan>
              <span onClick={() => openCCTVModal(el)}>
                <unicon name="video"></unicon>
              </span>

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
    });
    const search = (e) => {
      filterFormState.text = e.target.value;
    };
    const modal = ref(false);
    const formState = reactive({
      title: "",
      id: null,
      name: "",
      description: "",
      username: "",
      password: "",
      manufacturer: "",
      model: "",
      region: null,
      streamUri: "",
    });
    const submitable = ref(false);
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

    const importCCTV = () => {
      Modal.confirm({
        title: "將從區網匯入所有攝影機",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("cctv/importCCTV");
            Modal.success({
              content: "已開始匯入，請稍等1分鐘後刷新",
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

    const rules = {
      name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
      description: [{ required: true, message: "請輸入說明", trigger: "blur" }],
      region: [{ required: true, message: "請選擇地區", trigger: "blur" }],
      streamUri: [
        { required: true, message: "請輸入串流URL", trigger: "blur" },
      ],
    };

    const openAddModal = () => {
      formState.title = "新增攝影機";
      formState.id = null;
      formState.name = "";
      formState.description = "";
      formState.username = "";
      formState.password = "";
      formState.manufacturer = "";
      formState.model = "";
      formState.region = null;
      formState.streamUri = "";
      modal.value = true;
    };
    const openEditModal = (id) => {
      formState.title = "編輯攝影機";
      const tar = tableData.value.find((el) => el.Id === id);
      formState.id = tar.Id;
      formState.name = tar.Name;
      formState.description = tar.Description;
      formState.username = tar.UserName;
      formState.password = tar.Password;
      formState.manufacturer = tar.Manufacturer;
      formState.model = tar.Model;
      formState.region = tar.RegionList[tar.RegionList.length - 1].Id;
      formState.streamUri = tar.ProfileUrl;
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
            await dispatch("cctv/deleteCCTV", id);
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
          await dispatch("cctv/editCCTV", toRaw(formState));
          title = "修改成功";
        } else {
          await dispatch("cctv/addCCTV", toRaw(formState));
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

    const CCTVModal = ref(false);
    const currCCTV = ref([]);
    const currCCTVName = ref("");

    const openCCTVModal = ({ Id, Name }) => {
      currCCTV.value = [Id];
      currCCTVName.value = Name;
      CCTVModal.value = true;
    };

    const closeCCTVModal = () => {
      CCTVModal.value = false;
    };
    return {
      permission,
      SHOW_PARENT,
      loading,
      locations,
      filterFormState,
      searching,
      search,
      modal,
      formState,
      rules,
      init,
      importCCTV,
      columns,
      tableData,
      submitable,
      labelCol,
      wrapperCol,
      openAddModal,
      openEditModal,
      closeModal,
      submitForm,
      CCTVModal,
      currCCTV,
      currCCTVName,
      closeCCTVModal,
    };
  },
});
