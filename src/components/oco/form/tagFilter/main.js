import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  computed,
  watchEffect,
} from "vue";
import { TagList, Wrap, MultiSelector, SelectedList } from "./style";
import { useStore } from "vuex";
import { useFilterData } from "@/composable/filter";
import { Modal } from "ant-design-vue";
import { useModalDrag } from "@/composable/modalDrag";
export default defineComponent({
  props: {
    title: {
      type: String,
      default: null,
    },
    selectedTags: {
      type: Array,
      default: () => [],
    },
    tagsValueProp: {
      type: String,
      default: "id",
    },
    tagsLabelProp: {
      type: String,
      default: "name",
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    value: {
      type: String,
      default: null,
    },
    allowedUsages: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TagList,
    Wrap,
    MultiSelector,
    SelectedList,
  },

  setup(props, { emit }) {
    const { dispatch, state } = useStore();
    const tagSearching = ref(false);

    // 初始化拖曳功能
    useModalDrag('.tag-filter-modal');
    onMounted(async () => {
      try {
        const res = await dispatch("tags/getAllTagsAndOptions");
        tagClassOptions.value = res.tagClass;
        locations.value = res.locations;
      } catch (err) {
        Modal.error({
          title: "錯誤",
          content: err.message,
        });
      }
    });

    const singleTagText = computed(() => {
      return state.tags.tagInitData.find(
        (element) => element.Id === props.value
      )?.Name;
    });
    const allowedUsageText = computed(() => props.allowedUsages.join(" / "));
    const isUsageRestricted = computed(() => props.allowedUsages.length > 0);

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
        name: "說明+名稱",
      },
      {
        id: "2",
        name: "說明",
      },
      {
        id: "3",
        name: "名稱",
      },
    ];

    const locations = ref([]);

    const tagsOptions = ref([]);
    const tagClassOptions = ref([]);
    const formState = reactive({
      regionId: null,
      tagClass: null,
      showName: "1",
      searchText: "",
      tags: [],
      tagForSingle: {
        value: null,
        label: "測點不存在",
      },
    });

    const formatTagLabel = (tag) => {
      if (!tag) return "測點不存在";

      if (formState.showName == "1") {
        return `${tag.Name}(${tag.Description})`;
      }

      if (formState.showName == "2") {
        return tag.Description;
      }

      return tag.Name;
    };

    const getTagUsage = (tag) => {
      if (!tag) return null;

      return tag.Usage ?? tag.TagUsage ?? null;
    };

    watchEffect(() => {
      const schemes = [
        {
          type: "list",
          target: formState.regionId ? formState.regionId : null,
          source: "RegionList",
          sourceProp: "Id",
        },
        {
          type: "list",
          target: formState.tagClass ? formState.tagClass : null,
          source: "TagCategoryList",
          sourceProp: "Id",
        },
        {
          type: "text",
          target: formState.searchText,
        },
      ];
      const allTags = state.tags.tagInitData ?? [];
      let res = useFilterData(schemes, allTags);

      if (props.allowedUsages.length > 0) {
        res = res.filter((tag) => props.allowedUsages.includes(getTagUsage(tag)));
      }

      formState.tags = formState.tags.map((el) => {
        const tar = allTags.find((element) => element.Id === el.value);

        return {
          value: el.value,
          label: formatTagLabel(tar),
        };
      });

      tagsOptions.value = res.map((el) => {
        return {
          value: el.Id,
          label: formatTagLabel(el),
        };
      });
    });

    const availableTagCount = computed(() => tagsOptions.value.length);

    const isExistInSelectedTags = (data) => {
      const res = formState.tags.find((el) => el.value === data.value);
      return res;
    };

    const setTags = (data) => {
      const isExist = formState.tags.find((el) => el.value === data.value);
      if (isExist) {
        const index = formState.tags.indexOf(isExist);
        formState.tags.splice(index, 1);
      } else {
        formState.tags.push(data);
      }
    };

    const removeTag = (tag) => {
      const index = formState.tags.findIndex((el) => el.value === tag.value);
      if (index > -1) {
        formState.tags.splice(index, 1);
      }
    };

    const clearAllTags = () => {
      formState.tags = [];
    };
    // watch(
    //   () => props.value,
    //   () => {
    //     formState.tagForSingle = tagsOptions.value.find(
    //       (element) => element.value === props.value
    //     ) ?? {
    //       value: null,
    //       label: "測點不存在",
    //     };
    //   }
    // );

    // watch(
    //   () => props.selectedTags,
    //   () => {
    //     formState.tags = props.selectedTags.map(
    //       (el) =>
    //         tagsOptions.value.find((element) => element.value === el) ?? {
    //           value: null,
    //           label: "測點不存在",
    //         }
    //     );
    //   },
    //   {
    //     deep: true,
    //   }
    // );

    // watch(
    //   () => formState.tags,
    //   () => {
    //     const tags = formState.tags.map((el) => ({
    //       [props.tagsValueProp]: el.value,
    //       [props.tagsLabelProp]: el.label,
    //     }));
    //     emit("setTags", tags);
    //   },
    //   { deep: true }
    // );

    // watch(
    //   () => formState.tagForSingle,
    //   () => {
    //     if (formState.tagForSingle) {
    //       emit("setSingleTag", formState.tagForSingle);
    //     } else {
    //       emit("setSingleTag", { value: null, label: "測點不存在" });
    //     }
    //   },
    //   { deep: true }
    // );

    const modal = ref(false);
    const openModal = () => {
      if (props.multiple) {
        formState.tags = props.selectedTags
          .map((el) =>
            tagsOptions.value.find((element) => element.value === el) ?? null
          )
          .filter(Boolean);
      } else {
        formState.tagForSingle = tagsOptions.value.find(
          (element) => element.value === props.value
        ) ?? {
          value: null,
          label: "測點不存在",
        };
      }

      modal.value = true;
    };
    const closeModal = () => {
      formState.regionId = null;
      formState.tagClass = null;
      formState.showName = "1";
      formState.searchText = "";
      if (
        JSON.stringify(formState.tags.map((el) => el.value)) !==
          JSON.stringify(props.selectedTags) ||
        formState.tagForSingle?.value !== props.value
      ) {
        Modal.confirm({
          title: "提示",
          content: "測點將不會選定，確定關閉？",
          onOk() {
            modal.value = false;
          },
        });
      } else {
        modal.value = false;
      }
    };

    const submit = () => {
      formState.regionId = null;
      formState.tagClass = null;
      formState.showName = "1";
      formState.searchText = "";
      if (props.multiple) {
        const tags = formState.tags.map((el) => ({
          [props.tagsValueProp]: el.value,
          [props.tagsLabelProp]: el.label,
        }));
        emit("setTags", tags);
      } else {
        if (formState.tagForSingle) {
          emit("setSingleTag", formState.tagForSingle);
        } else {
          emit("setSingleTag", { value: null, label: "測點不存在" });
        }
      }
      modal.value = false;
    };

    return {
      tagSearching,
      singleTagText,
      labelCol,
      wrapperCol,
      showNameOptions,
      allowedUsageText,
      isUsageRestricted,
      availableTagCount,
      tagsOptions,
      tagClassOptions,
      locations,
      formState,
      isExistInSelectedTags,
      setTags,
      removeTag,
      clearAllTags,
      modal,
      openModal,
      closeModal,
      submit,
    };
  },
});
