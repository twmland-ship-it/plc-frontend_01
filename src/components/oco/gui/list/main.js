import {
  defineComponent,
  ref,
  computed,
  reactive,
  onBeforeUnmount,
  onMounted,
  watch,
} from "vue";
import { guiWrap, modalWrap } from "./style";
import { useStore } from "vuex";
import { Modal, notification } from "ant-design-vue";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import SettingForm from "@/components/oco/form/uninstall-tag/Index.vue";
import { usePermission } from "@/composable/permission";
import { allEnableProps } from "@/composable/options";
import { useTagSignalConnection } from "@/composable/tagSignalConnection";
export default defineComponent({
  components: {
    guiWrap,
    modalWrap,
    LevelSelect,
    SettingForm,
  },

  setup() {
    const { permission } = usePermission();
    const { dispatch, state } = useStore();
    const loading = computed(() => state.gui.loading);

    const allDevice = computed(() =>
      state.gui.guiDetail.DataContentJson
        ? JSON.parse(state.gui.guiDetail.DataContentJson)
        : ""
    );
    const allTagProperties = ref();
    onMounted(async () => {
      if (allDevice.value !== "") {
        const allTagList = [
          ...new Set(
            [].concat(
              ...allDevice.value.map((el) => el.tags.map((el) => el.id))
            )
          ),
        ];
        if (allTagList.length > 0) {
          allTagProperties.value = await dispatch(
            "tags/fetchAdditionProps",
            allTagList
          );
        }
      }
    });
    const subTitle = ref(null);

    const modal = ref(false);
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

    const formState = reactive({
      id: null,
      name: null,
      tags: [],
    });

    const formColumns = [
      {
        title: "測點名稱",
        dataIndex: "name",
      },
      {
        title: "顯示屬性",
        dataIndex: "property",
        selectable: true,
        options: allEnableProps,
        width: 200,
      },
      {
        title: "顯示標題",
        dataIndex: "title",
        editable: true,
        width: "150px",
      },
      {
        title: "單位",
        dataIndex: "unit",
        editable: true,
        width: "150px",
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "70px",
      },
    ];

    const currentValues = ref([]);
    const parsePageTagPayload = (sourceData) => {
      try {
        const root = typeof sourceData === "string" ? JSON.parse(sourceData) : sourceData;
        const pageTagJson = root?.PageTagJson;
        if (!pageTagJson) return [];
        return typeof pageTagJson === "string" ? JSON.parse(pageTagJson) : pageTagJson;
      } catch (err) {
        console.warn("[PageTag] parse payload failed:", err?.message || err);
        return [];
      }
    };
    let pendingListRaf = null;
    let latestListSources = null;
    const updateCurrentValues = (sourceData) => {
      latestListSources = parsePageTagPayload(sourceData);
      if (pendingListRaf) return;
      pendingListRaf = requestAnimationFrame(() => {
        pendingListRaf = null;
        if (latestListSources) {
          currentValues.value = Array.isArray(latestListSources) ? latestListSources : [];
          latestListSources = null;
        }
      });
    };
    const pageId = computed(() => state.gui.guiDetail.ItemId);
    const { cleanup, refreshTenantBinding } = useTagSignalConnection(
      pageId,
      updateCurrentValues
    );

    watch(pageId, async (nextPageId, previousPageId) => {
      if (!nextPageId || nextPageId === previousPageId) {
        return;
      }

      await refreshTenantBinding(pageId);
    });

    onBeforeUnmount(() => {
      cleanup();
    });

    const getCurrentValue = computed(() => (id) => {
      return (
        currentValues.value.find((el) => el.TagId === id)?.TagRealvalue ??
        "沒有值"
      );
    });

    const getTagProperty = computed(() => (id, property) => {
      return allTagProperties.value &&
        allTagProperties.value[id] &&
        allTagProperties.value[id][property]
        ? allTagProperties.value[id][property]
        : "屬性未設定";
    });

    const rules = {
      name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
    };

    const addTag = (tags) => {
      formState.tags = [
        ...formState.tags,
        ...tags.map((el) => ({
          id: el.id,
          name: el.name,
          property: null,
          title: "",
          unit: "",
        })),
      ];
    };

    const editTag = ({ id, key, value }) => {
      formState.tags.find((el) => el.id === id)[key] = value;
    };

    const deleteTag = (id) => {
      formState.tags.splice(
        formState.tags.indexOf(formState.tags.find((el) => el.id === id)),
        1
      );
    };

    const openAddModal = async () => {
      try {
        formState.id = null;
        formState.name = null;
        formState.tags = [];
        modal.value = true;
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };
    const closeAddModal = () => {
      modal.value = false;
    };

    const submitForm = async () => {
      try {
        let title = "";
        if (formState.id) {
          title = "修改成功";
          await dispatch("gui/editList", formState);
        } else {
          title = "新增成功";
          await dispatch("gui/addList", formState);
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

    const openEditModal = async (id) => {
      try {
        formState.id = id;
        const tar = allDevice.value.find((el) => el.id === id);
        formState.name = tar.name;
        formState.tags = tar.tags;
        modal.value = true;
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const deleteGroup = (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("gui/deleteList", id);
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
      allDevice,
      getCurrentValue,
      getTagProperty,
      subTitle,
      modal,
      wrapperCol,
      labelCol,
      formState,
      formColumns,
      rules,
      addTag,
      editTag,
      deleteTag,
      openAddModal,
      closeAddModal,
      submitForm,
      openEditModal,
      deleteGroup,
    };
  },
});
