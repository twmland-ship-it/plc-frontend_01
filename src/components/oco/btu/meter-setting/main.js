import { defineComponent, reactive, ref, onMounted, computed } from "vue";
import { TagList, Wrap, SelectedList } from "./style";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";
import { useModalDrag } from "@/composable/modalDrag";
export default defineComponent({
  props: {
    selectedMeters: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    TagList,
    Wrap,
    SelectedList,
  },

  setup(props, { emit }) {
    const { dispatch, state } = useStore();
    const tagSearching = ref(false);

    // 初始化拖曳功能
    useModalDrag('.tag-filter-modal');
    onMounted(async () => {
      const res = await Promise.all([
        dispatch("btu/getMeterList"),
        dispatch("tags/getTagsRegions"),
      ]);
      try {
        locations.value = res[1];
        formState.tags = props.selectedMeters.map(
          (el) =>
            meterOptions.value.find((element) => element.value === el) ?? {
              value: null,
              label: "BTU錶不存在",
            }
        );
      } catch (err) {
        Modal.error({
          title: "錯誤",
          content: err.message,
        });
      }
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

    const locations = ref([]);

    const meterOptions = computed(() => {
      if (formState.regionId) {
        const res = state.btu.metersInitData.filter(
          (el) => el.region === formState.regionId
        );
        return res.map((el) => {
          return {
            value: el.id,
            label: el.name,
          };
        });
      } else {
        return state.btu.metersInitData.map((el) => {
          return {
            value: el.id,
            label: el.name,
          };
        });
      }
    });

    const setAllSelected = () => {
      formState.meters = [
        ...formState.meters,
        ...JSON.parse(JSON.stringify(meterOptions.value)),
      ];
    };

    const formState = reactive({
      regionId: null,
      meters: [],
    });

    const isExistInSelectedMeters = (data) => {
      const res = formState.meters.find((el) => el.value === data.value);
      return res;
    };

    const setMeters = (data) => {
      const isExist = formState.meters.find((el) => el.value === data.value);
      if (isExist) {
        const index = formState.meters.indexOf(isExist);
        formState.meters.splice(index, 1);
      } else {
        formState.meters.push(data);
      }
    };

    const submit = () => {
      formState.regionId = null;
      emit("setMeters", formState.meters);
      modal.value = false;
    };

    const removeMeter = (meter) => {
      const index = formState.meters.findIndex((el) => el.value === meter.value);
      if (index > -1) {
        formState.meters.splice(index, 1);
      }
    };

    const clearAllMeters = () => {
      formState.meters = [];
    };
    const modal = ref(false);
    const openModal = () => {
      formState.meters = props.selectedMeters.map(
        (el) =>
          meterOptions.value.find((element) => element.value === el.value) ?? {
            value: null,
            label: "BTU不存在",
          }
      );
      modal.value = true;
    };
    const closeModal = () => {
      formState.regionId = null;
      if (
        JSON.stringify(formState.meters) !==
        JSON.stringify(props.selectedMeters)
      ) {
        Modal.confirm({
          title: "提示",
          content: "BTU將不會選定，確定關閉？",
          onOk() {
            modal.value = false;
          },
        });
      } else {
        modal.value = false;
      }
    };
    return {
      tagSearching,
      labelCol,
      wrapperCol,
      meterOptions,
      locations,
      setAllSelected,
      formState,
      isExistInSelectedMeters,
      setMeters,
      removeMeter,
      clearAllMeters,
      modal,
      openModal,
      closeModal,
      submit,
    };
  },
});
