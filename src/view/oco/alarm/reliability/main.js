import {
  defineComponent,
  computed,
  onMounted,
  ref,
  nextTick,
  reactive,
  toRaw,
} from "vue";
import { Main } from "../../styled";
import { useStore } from "vuex";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import Chart from "@/components/utilities/chartjs";
import AddModal from "@/components/oco/reliability/addModal/Index.vue";
import DetailModal from "@/components/oco/reliability/detailModal/Index.vue";
import { CardWrap } from "./style";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
import dayjs from "dayjs";
export default defineComponent({
  components: {
    Main,
    LevelSelect,
    Chart,
    CardWrap,
    AddModal,
    DetailModal,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    onMounted(async () => {
      await dispatch("alarm/getReliabilityGroups");
      nextTick(() => {
        showChart.value = true;
      });
    });
    const showChart = ref(false);
    const loading = computed(() => state.alarm.loading);
    const groups = computed(() =>
      state.alarm.reliabilityGroup.map((el) => ({
        ...el,
        resetTime: el.FaultToleranceResetTime
          ? dayjs(el.FaultToleranceResetTime).format("YYYY-MM-DD HH:mm:ss")
          : "未重置",
        datasets: [
          {
            id: el.Id,
            name: el.Name,
            label: "故障",
            data: [
              el.TotalFaultCount,
              el.FaultToleranceCount > el.TotalFaultCount
                ? el.FaultToleranceCount - el.TotalFaultCount
                : 0,
            ],
            backgroundColor: ["#FF8000", "#66B2FF", "#5840FF"],
          },
        ],
      }))
    );
    const label = ["警報發生次數", "剩餘次數"];
    const options = {
      borderWidth: 2,
      maintainAspectRatio: true,
      responsive: true,
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        labels: {
          display: false,
        },
      },
      animation: {
        animateScale: true,
        animateRotate: true,
      },
      onClick: async (e) => {
        const tar = e.chart.data.datasets[0];
        await dispatch("alarm/fetchReliabilityDetail", tar.id);
        detailModalTitle.value = `${tar.name} 詳情`;
        detailModal.value = true;
      },
    };

    const modal = ref(false);

    const formState = reactive({
      title: "",
      id: null,
      name: null,
      tags: [],
      groups: [],
      count: null,
    });

    const openAddModal = () => {
      const formObj = {
        title: "新增圖表",
        id: null,
        name: null,
        tags: [],
        groups: [],
        count: null,
      };
      Object.assign(formState, formObj);
      modal.value = true;
    };

    const openEditModal = ({
      Id,
      Name,
      TagGroups,
      Tags,
      FaultToleranceCount,
    }) => {
      formState.title = "編輯圖表";
      formState.id = Id;
      formState.name = Name;
      formState.tags = Tags;
      formState.groups = TagGroups;
      formState.count = FaultToleranceCount;
      modal.value = true;
    };

    const closeAddModal = () => {
      modal.value = false;
    };

    const changeSearchType = () => {
      formState.data = [];
    };

    const setTags = (data) => {
      formState.tags = data;
    };

    const setGroups = (data) => {
      formState.groups = data;
    };

    const resetCount = (id) => {
      Modal.confirm({
        title: "確認重置?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("alarm/resetReliabiliyCount", id);
            notification.success({
              mesaage: "重置成功",
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

    const submitGroup = async () => {
      try {
        let title;
        if (formState.id) {
          await dispatch("alarm/editReliabiliyGroup", toRaw(formState));
          title = "修改成功";
        } else {
          await dispatch("alarm/addReliabiliyGroup", toRaw(formState));
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

    const deleteGroup = (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("alarm/deleteReliabiliyGroup", id);
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

    const detailModal = ref(false);
    const detailModalTitle = ref("");
    const closeDetailModal = () => {
      detailModal.value = false;
    };

    return {
      permission,
      showChart,
      loading,
      groups,
      label,
      options,
      modal,
      formState,
      openAddModal,
      openEditModal,
      closeAddModal,
      changeSearchType,
      setTags,
      setGroups,
      resetCount,
      submitGroup,
      deleteGroup,
      detailModal,
      detailModalTitle,
      closeDetailModal,
    };
  },
});
