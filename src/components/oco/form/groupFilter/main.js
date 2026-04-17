import { defineComponent, reactive, ref, onMounted, computed } from "vue";
import { GroupList, Wrap, SelectedList } from "./style";
import { useStore } from "vuex";
import { useFilterData } from "@/composable/filter";
import { Modal } from "ant-design-vue";
import { useModalDrag } from "@/composable/modalDrag";
export default defineComponent({
  props: {
    selectedGroups: {
      type: Array,
      default: () => [],
    },
    groupsValueProp: {
      type: String,
      default: "id",
    },
    groupsLabelProp: {
      type: String,
      default: "name",
    },
  },
  components: {
    GroupList,
    Wrap,
    SelectedList,
  },

  setup(props, { emit }) {
    const { dispatch, state } = useStore();
    const groupSearching = ref(false);

    // 初始化拖曳功能
    useModalDrag('.tag-filter-modal');
    onMounted(async () => {
      const res = await dispatch("group/getAllGroupsAndOptions");

      locations.value = res.locations;
      groupClassOptions.value = res.groupClass;
    });

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
    const showNameOptions = [
      {
        id: "1",
        name: "描述+名稱",
      },
      {
        id: "2",
        name: "描述",
      },
      {
        id: "3",
        name: "名稱",
      },
    ];

    const locations = ref([]);
    const groupOptions = computed(() => {
      const schemes = [
        {
          type: "list",
          target: formState.regionId ? formState.regionId : null,
          source: "GroupSetting.RegionListDirectLineElderList",
          sourceProp: "Id",
        },
        {
          type: "list",
          target: formState.groupClass ? formState.groupClass : null,
          source: "GroupSetting.GroupCategoryDirectLineElderList",
          sourceProp: "Id",
        },
      ];
      const res = useFilterData(schemes, state.group.groupInitData);
      return res.map((el) => ({
        value: el.Id,
        label: el.Name,
        tags: el.ContentSetting.TagList,
      }));
    });
    const groupClassOptions = ref([]);
    const formState = reactive({
      regionId: null,
      groupClass: null,
      groups: [],
    });

    const isExistInSelectedGroups = (data) => {
      const res = formState.groups.find((el) => el.value === data.value);
      return res;
    };

    const setGroups = (data) => {
      const isExist = formState.groups.includes(data);
      if (isExist) {
        const index = formState.groups.indexOf(data);
        formState.groups.splice(index, 1);
      } else {
        formState.groups.push(data);
      }
    };

    const removeGroup = (group) => {
      const index = formState.groups.findIndex((el) => el.value === group.value);
      if (index > -1) {
        formState.groups.splice(index, 1);
      }
    };

    const clearAllGroups = () => {
      formState.groups = [];
    };

    const submit = () => {
      formState.regionId = null;
      formState.groupClass = null;
      const groups = formState.groups.map((el) => ({
        [props.groupsValueProp]: el.value,
        [props.groupsLabelProp]: el.label,
        tags: state.group.groupInitData.find((el2) => el2.Id === el.value)
          ?.ContentSetting.TagList,
      }));
      emit("setGroups", groups);
      modal.value = false;
    };

    // watch(
    //   () => formState.groups,
    //   () => {
    //     const groups = formState.groups.map((el) => ({
    //       [props.groupsValueProp]: el.value,
    //       [props.groupsLabelProp]: el.label,
    //       tags: el.tags,
    //     }));
    //     emit("setGroups", groups);
    //   },
    //   { deep: true }
    // );

    const modal = ref(false);
    const openModal = () => {
      formState.groups = props.selectedGroups.map(
        (el) =>
          groupOptions.value.find((element) => element.value === el) ?? {
            value: null,
            label: "群組不存在",
          }
      );
      modal.value = true;
    };
    const closeModal = () => {
      formState.regionId = null;
      formState.groupClass = null;
      if (
        JSON.stringify(formState.groups.map((el) => el.value)) !==
        JSON.stringify(props.selectedGroups)
      ) {
        Modal.confirm({
          title: "提示",
          content: "群組將不會選定，確定關閉？",
          onOk() {
            modal.value = false;
          },
        });
      } else {
        modal.value = false;
      }
    };
    return {
      groupSearching,
      labelCol,
      wrapperCol,
      showNameOptions,
      locations,
      groupClassOptions,
      groupOptions,
      formState,
      isExistInSelectedGroups,
      setGroups,
      removeGroup,
      clearAllGroups,
      modal,
      openModal,
      closeModal,
      submit,
    };
  },
});
