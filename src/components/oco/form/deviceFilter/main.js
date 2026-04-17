import {
  defineComponent,
  reactive,
  ref,
  onMounted,
  watch,
  computed,
} from "vue";
import { DeviceList, Wrap, SelectedDevice } from "./style";
import { useStore } from "vuex";
import { useModalDrag } from "@/composable/modalDrag";
import { useFilterData } from "@/composable/filter";
import { Modal } from "ant-design-vue";
export default defineComponent({
  props: {
    value: {
      type: String,
      default: null,
    },
  },
  components: {
    DeviceList,
    Wrap,
    SelectedDevice,
  },

  setup(props, { emit }) {
    const { dispatch, state } = useStore();
    const deviceSearching = ref(false);

    // 初始化拖曳功能
    useModalDrag('.tag-filter-modal');
    onMounted(async () => {
      const res = await dispatch("device/getAllDeviceAndOptions");
      const options = state.device.deviceInitData.map((el) => ({
        value: el.DeviceId,
        label: el.DeviceName,
      }));
      deviceOptions.value = options;
      deviceClassOptions.value = res.deviceClassOptions;
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
    const deviceName = computed(
      () =>
        state.device.deviceInitData.find((el) => el.DeviceId === props.value)
          ?.DeviceName
    );

    const deviceOptions = ref([]);
    const deviceClassOptions = ref([]);
    const locations = ref([]);
    const formState = reactive({
      regionId: null,
      deviceClass: null,
      device: {
        value: null,
        label: "裝置不存在",
      },
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
          {
            type: "list",
            target: formState.deviceClass ? formState.deviceClass : null,
            source: "DeviceCategoryList",
            sourceProp: "Id",
          },
        ];
        const res = useFilterData(schemes, state.device.deviceInitData).map(
          (el) => ({
            value: el.DeviceId,
            label: el.DeviceName,
          })
        );
        deviceOptions.value = res;
      },
      { deep: true }
    );

    const modal = ref(false);
    const openModal = () => {
      formState.device = deviceOptions.value.find(
        (element) => element.value === props.value
      ) ?? {
        value: null,
        label: "裝置不存在",
      };
      modal.value = true;
    };
    const closeModal = () => {
      formState.regionId = null;
      formState.deviceClass = null;
      if (formState.device.value !== props.value) {
        Modal.confirm({
          title: "提示",
          content: "裝置將不會選定，確定關閉？",
          onOk() {
            modal.value = false;
          },
        });
      } else {
        modal.value = false;
      }
    };

    const setDevice = () => {
      formState.regionId = null;
      formState.deviceClass = null;
      emit("setDevice", formState.device);
      modal.value = false;
    };

    const selectDevice = (device) => {
      formState.device = device;
    };

    const clearDevice = () => {
      formState.device = {
        value: null,
        label: "裝置不存在",
      };
    };
    return {
      deviceSearching,
      labelCol,
      wrapperCol,
      deviceName,
      deviceOptions,
      deviceClassOptions,
      locations,
      formState,
      modal,
      openModal,
      closeModal,
      setDevice,
      selectDevice,
      clearDevice,
    };
  },
});
