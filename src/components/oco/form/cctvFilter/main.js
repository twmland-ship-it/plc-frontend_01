import { defineComponent, reactive, ref, onMounted, watch } from "vue";
import { Wrap, CCTVList, SelectedList } from "./style";
import { useStore } from "vuex";
import { useFilterData } from "@/composable/filter";
import { Modal } from "ant-design-vue";
import { useModalDrag } from "@/composable/modalDrag";
export default defineComponent({
  props: {
    values: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    Wrap,
    CCTVList,
    SelectedList,
  },

  setup(props, { emit }) {
    const { dispatch, state } = useStore();

    // 初始化拖曳功能
    useModalDrag('.tag-filter-modal');

    onMounted(async () => {
      const res = await dispatch("cctv/getAllCCTVAndOptions");
      CCTVOptions.value = res.CCTVList.map((el) => ({
        value: el.Id,
        label: el.Name,
      }));
      locations.value = res.locations;
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

    const CCTVOptions = ref([]);
    const locations = ref([]);
    const formState = reactive({
      regionId: null,
      cctvs: [],
    });

    watch(
      () => formState,
      () => {
        const schemes = [
          {
            type: "list",
            target: formState.regionId ? formState.regionId : null,
            source: "RegionList",
            sourceProp: "Id",
          },
        ];
        const res = useFilterData(schemes, state.cctv.initData).map((el) => ({
          value: el.Id,
          label: el.Name,
        }));
        CCTVOptions.value = res;
      },
      { deep: true }
    );

    // watch(
    //   () => props.values,
    //   () => {
    //     formState.cctvs = props.values.map(
    //       (el) =>
    //         CCTVOptions.value.find((element) => element.value === el) ?? {
    //           value: null,
    //           label: "測點不存在",
    //         }
    //     );
    //   }
    // );

    const modal = ref(false);
    const openModal = () => {
      formState.cctvs = props.values.map(
        (el) =>
          CCTVOptions.value.find((element) => element.value === el) ?? {
            value: null,
            label: "CCTV不存在",
          }
      );
      modal.value = true;
    };
    const closeModal = () => {
      formState.regionId = null;
      if (
        JSON.stringify(formState.cctvs.map((el) => el.value)) !==
        JSON.stringify(props.values)
      ) {
        Modal.confirm({
          title: "提示",
          content: "CCTV將不會選定，確定關閉？",
          onOk() {
            modal.value = false;
          },
        });
      } else {
        modal.value = false;
      }
    };

    const setCCTV = () => {
      formState.regionId = null;
      emit("setCCTV", formState.cctvs);
      modal.value = false;
    };

    const isExistInSelectedCCTVs = (data) => {
      const res = formState.cctvs.find((el) => el.value === data.value);
      return res;
    };

    const setCCTVs = (data) => {
      const isExist = formState.cctvs.find((el) => el.value === data.value);
      if (isExist) {
        const index = formState.cctvs.indexOf(isExist);
        formState.cctvs.splice(index, 1);
      } else {
        formState.cctvs.push(data);
      }
    };

    const removeCCTV = (cctv) => {
      const index = formState.cctvs.findIndex((el) => el.value === cctv.value);
      if (index > -1) {
        formState.cctvs.splice(index, 1);
      }
    };

    const clearAllCCTVs = () => {
      formState.cctvs = [];
    };

    return {
      labelCol,
      wrapperCol,
      CCTVOptions,
      locations,
      formState,
      modal,
      openModal,
      closeModal,
      setCCTV,
      isExistInSelectedCCTVs,
      setCCTVs,
      removeCCTV,
      clearAllCCTVs,
    };
  },
});
