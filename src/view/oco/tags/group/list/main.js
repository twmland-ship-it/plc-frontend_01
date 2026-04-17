import { useStore } from "vuex";
import {
  computed,
  defineComponent,
  reactive,
  ref,
  toRaw,
  onMounted,
  watch,
} from "vue";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import GroupFilter from "@/components/oco/form/groupFilter/Index.vue";
import DataTables from "@/components/table/DataTable.vue";
import { ActionSpan, Search } from "./style";
import { Modal, notification } from "ant-design-vue";
import draggable from "vuedraggable";
import {
  faHandPointer,
  faLongArrowAltLeft,
} from "@fortawesome/free-solid-svg-icons";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  components: {
    LevelSelect,
    DataTables,
    draggable,
    TagFilter,
    GroupFilter,
    Search,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();

    onMounted(async () => {
      const res = await dispatch("group/getAllGroupsAndOptions");
      groupClassOptions.value = res.groupClass;
      locations.value = res.locations;
    });
    const loading = computed(() => state.group.loading);
    const locations = ref([]);
    const groupClassOptions = ref([]);
    const collapseKey = ref("1");

    const filterFormState = reactive({
      region: null,
      groupClass: null,
      text: "",
    });

    const callFilter = () => {
      const schemes = [
        {
          type: "text",
          target: filterFormState.text,
        },
        {
          type: "list",
          target: filterFormState.region ? filterFormState.region : null,
          source: "GroupSetting.RegionListDirectLineElderList",
          sourceProp: "Id",
        },
        {
          type: "list",
          target: filterFormState.groupClass
            ? filterFormState.groupClass
            : null,
          source: "GroupSetting.GroupCategoryDirectLineElderList",
          sourceProp: "Id",
        },
      ];
      dispatch("group/filterGroupTable", schemes);
    };
    watch(() => filterFormState, callFilter, { deep: true });
    watch(() => state.group.groupInitData, callFilter, { deep: true });
    const search = (e) => {
      filterFormState.text = e.target.value;
    };

    const columns = [
      {
        title: "名稱",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
        fixed: "left",
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
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const tableData = ref([]);
    watch(
      () => state.group.groupTableData,
      async (newValue) => {
        if (newValue.length > 0) {
          tableData.value = newValue.map((el) => {
            const groupClass =
              el.GroupSetting.GroupCategoryDirectLineElderList.map(
                (el2) => el2[el2.length - 1].Id
              );
            return {
              // ...el,
              id: el.Id,
              name: el.Name,
              groupClass,
              description: el.Description,
              locationId:
                el.GroupSetting.RegionListDirectLineElderList[
                  el.GroupSetting.RegionListDirectLineElderList.length - 1
                ].Id,
              locationName: el.GroupSetting.RegionListDirectLineElderList.map(
                (el) => el.Name
              ).join(" > "),

              tagList: el.ContentSetting?.TagList,
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
          tableData.value = [];
        }
      },
      { deep: true }
    );

    const modal = ref(false);
    const activeTab = ref("1");
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
      title: null,
      id: null,
      name: null,
      class: [],
      description: null,
      region: null,
      tags: [],
    });
    const rules = {
      name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
      description: [{ required: true, message: "請輸入說明", trigger: "blur" }],
      region: [{ required: true, message: "請選擇", trigger: "blur" }],
    };

    const openAddModal = () => {
      formState.title = "新增群組";
      formState.id = null;
      formState.name = null;
      formState.class = [];
      formState.region = null;
      formState.description = null;
      formState.tags = [];
      modal.value = true;
    };

    const openEditModal = (id) => {
      const { name, groupClass, description, tagList, locationId } =
        tableData.value.find((el) => el.id === id);
      formState.title = "編輯群組";
      formState.id = id;
      formState.name = name;
      formState.class = groupClass;
      formState.description = description;
      formState.region = locationId;
      formState.tags = tagList.map((el) => el.Id);
      modal.value = true;
    };

    const closeModal = () => {
      modal.value = false;
    };

    const submitForm = async () => {
      try {
        let title;
        if (formState.id) {
          await dispatch("group/editGroup", {
            ...toRaw(formState),
            tags: formState.tags,
          });
          title = "修改成功";
        } else {
          await dispatch("group/addGroup", {
            ...toRaw(formState),
            tags: formState.tags,
          });
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
            await dispatch("group/deleteGroup", id);
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

    const setTags = (data) => {
      formState.tags = data.map((el) => el.id);
    };

    return {
      permission,
      loading,
      collapseKey,
      locations,
      groupClassOptions,
      filterFormState,
      columns,
      tableData,
      search,
      modal,
      activeTab,
      labelCol,
      wrapperCol,
      formState,
      rules,
      openAddModal,
      closeModal,
      submitForm,
      setTags,
      faHandPointer,
      faLongArrowAltLeft,
    };
  },
});
