import { defineComponent, ref, computed, reactive, onMounted } from "vue";
import { useStore } from "vuex";
import DataTables from "@/components/table/DataTable.vue";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import GroupFilter from "@/components/oco/form/groupFilter/Index.vue";
import { Modal } from "ant-design-vue";
import { Main, ActionSpan } from "../../styled";
import { useTimeFormatter } from "@/composable/formatter";
import { usePermission } from "@/composable/permission";
import CommonSearch from "@/components/oco/util/commonSearch/Index.vue";
import dayjs from "dayjs";
import { useTagInfo } from "@/composable/tagInfo";
export default defineComponent({
  components: {
    Main,
    DataTables,
    TagFilter,
    GroupFilter,
    CommonSearch,
  },

  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.database.loading);

    onMounted(async () => {
      await Promise.all([
        dispatch("database/getRuntimeCommonSearch"),
        dispatch("tags/getAllTagsAndOptions"),
      ]);
    });

    const commonSearchList = computed(
      () => state.database.runtimeCommonSearchList
    );

    const addSearchModal = ref(false);
    const addSearchFormState = reactive({
      name: "",
    });

    const openAddSearchModal = () => {
      addSearchModal.value = true;
    };
    const closeAddSearchModal = () => {
      addSearchModal.value = false;
    };

    const addSearch = async () => {
      try {
        let newObj = Object.assign({}, formState);
        Object.assign(newObj, addSearchFormState);
        await dispatch(
          "database/addRuntimeCommonSearch",
          JSON.stringify(newObj)
        );
        addSearchModal.value = false;
        Modal.success({
          title: "新增成功",
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const deleteCommonSearch = async (id) => {
      await dispatch("database/deleteRuntimeCommonSearch", id);
    };

    const useSearch = (data) => {
      const availableTags = Array.isArray(data?.tags) ? data.tags : [];
      const visibleTags = availableTags.filter((tag) => {
        const usage = getRuntimeTagUsage(tag.id);
        return usage === "Status";
      });
      const hiddenTags = availableTags.filter((tag) => {
        const usage = getRuntimeTagUsage(tag.id);
        return usage !== "Status";
      });

      formState.tags = visibleTags;

      if (hiddenTags.length > 0) {
        Modal.info({
          title: "已隱藏不支援測點",
          content: `運轉時數只會顯示狀態測點，已自動隱藏：${hiddenTags
            .map((tag) => useTagInfo(tag.id, "Name") || tag.name || tag.id)
            .join("、")}`,
        });
      }
    };

    const labelCol = {
      lg: 2,
      md: 9,
      xs: 24,
    };

    const wrapperCol = {
      lg: 6,
      md: 15,
      xs: 24,
    };

    const formState = reactive({
      tags: [],
    });

    const setTags = (value) => {
      formState.tags = value;
    };

    const availableRuntimeTagCount = computed(
      () =>
        state.tags.tagInitData.filter((tag) => {
          const usage = tag.Usage ?? tag.TagUsage ?? null;
          return usage === "Status";
        }).length
    );

    const submitable = computed(() => formState.tags.length !== 0);
    const getRuntimeTagUsage = (tagId) =>
      useTagInfo(tagId, "Usage") ?? useTagInfo(tagId, "TagUsage") ?? null;

    const invalidRuntimeTags = computed(() =>
      formState.tags.filter((tag) => {
        const usage = getRuntimeTagUsage(tag.id);
        return usage !== "Status";
      })
    );
    const searching = ref(false);

    const showTable = ref(false);

    const data = computed(() => {
      const res = state.database.runtimeTableData.map((el) => {
        return {
          ...el,
          description: useTagInfo(el.TagId, "Description"),
          resetTime: dayjs(el.ResetTime).format("YYYY-MM-DD HH:mm:ss"),
          value: useTimeFormatter(el.AccumulateSeconds),
          action: (
            <ActionSpan>
              {permission.update ? (
                <span onClick={() => resetRuntime(el.TagId)}>
                  <unicon name="redo"></unicon>
                </span>
              ) : null}
            </ActionSpan>
          ),
        };
      });
      return res;
    });

    const columns = [
      {
        title: "名稱",
        dataIndex: "TagName",
        key: "TagName",
        sorter: (a, b) => a.TagName.localeCompare(b.TagName),
      },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        sorter: (a, b) => a.description.localeCompare(b.description),
      },
      {
        title: "上次重置時間",
        dataIndex: "resetTime",
        key: "resetTime",
      },
      {
        title: "運轉時數",
        dataIndex: "value",
        key: "value",
        align: "right",
        sorter: (a, b) => a.AccumulateSeconds - b.AccumulateSeconds,
      },
      {
        title: "重置",
        dataIndex: "action",
        key: "action",
      },
    ];

    const resetRuntime = async (id) => {
      Modal.confirm({
        title: "確認重置?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("database/resetRuntime", id);
            Modal.success({
              content: "重置成功",
            });
          } catch (err) {
            Modal.error({
              title: "發生錯誤",
              content: err.message,
            });
          }
          submit();
        },
      });
    };

    const submit = async () => {
      if (invalidRuntimeTags.value.length > 0) {
        Modal.error({
          title: "發生錯誤",
          content: `運轉時數只支援狀態測點，請重新選擇：${invalidRuntimeTags.value
            .map((tag) => useTagInfo(tag.id, "Name") || tag.name || tag.id)
            .join("、")}`,
        });
        return;
      }

      try {
        searching.value = true;
        await dispatch("database/getRuntimeData", formState);
        searching.value = false;
        showTable.value = true;
      } catch (err) {
        searching.value = false;
        Modal.error({
          title: "發生錯誤",
          content: err?.response?.data?.Message || err.message,
        });
      }
    };

    const search = (e) => {
      dispatch("database/filterRuntimeTable", e.target.value);
    };

    return {
      commonSearchList,
      addSearchModal,
      addSearchFormState,
      openAddSearchModal,
      closeAddSearchModal,
      addSearch,
      deleteCommonSearch,
      useSearch,
      permission,
      labelCol,
      wrapperCol,
      formState,
      setTags,
      submitable,
      availableRuntimeTagCount,
      searching,
      showTable,
      data,
      loading,
      columns,
      submit,
      search,
    };
  },
});
