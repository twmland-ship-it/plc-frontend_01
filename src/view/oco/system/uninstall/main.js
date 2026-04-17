import { Main } from "../../styled.js";
import { computed, defineComponent, onMounted, ref } from "vue";
import DataTables from "@/components/table/DataTable.vue";
import { useStore } from "vuex";
import UninstallList from "@/components/oco/uninstall/list/Index.vue";
import DeleteModal from "@/components/oco/uninstall/deleteModal/Index.vue";
import AddModal from "@/components/oco/uninstall/addModal/Index.vue";
import SummaryModal from "@/components/oco/uninstall/summaryModal/Index.vue";
import ConsumableTagsDrawer from "@/components/oco/uninstall/consumableTagsDrawer/Index.vue";
import StageGroupModal from "@/components/oco/uninstall/stageGroupModal/Index.vue";
import StageTagModal from "@/components/oco/uninstall/stageTagModal/Index.vue";
import { Modal, notification } from "ant-design-vue";
export default defineComponent({
  components: {
    Main,
    DataTables,
    UninstallList,
    DeleteModal,
    AddModal,
    SummaryModal,
    ConsumableTagsDrawer,
    StageGroupModal,
    StageTagModal,
  },
  setup() {
    const { state, dispatch } = useStore();
    const loading = computed(() => state.uninstall.loading);

    onMounted(async () => {
      await dispatch("uninstall/getData");
    });

    const addModal = ref(false);
    const openAddModal = () => {
      addModal.value = true;
    };
    const closeAddModal = () => {
      addModal.value = false;
    };

    // 新 Summary Modal（create/edit）
    const summaryVisible = ref(false);
    const selectedSummary = ref({
      Id: null,
      Name: "",
      Mode: 1,
      ContinuedSecond: 0,
      IsLoad: false,
      ContractCapacity: 1,
    });
    const openAddSummary = () => {
      selectedSummary.value = {
        Id: null,
        Name: "",
        Mode: 1,
        ContinuedSecond: 0,
        IsLoad: false,
        ContractCapacity: 1,
      };
      summaryVisible.value = true;
    };
    const openEditSummary = (summary) => {
      selectedSummary.value = summary || {
        Id: null,
        Name: "",
        Mode: 1,
        ContinuedSecond: 0,
        IsLoad: false,
        ContractCapacity: 1,
      };
      summaryVisible.value = true;
    };
    const closeSummaryModal = () => {
      summaryVisible.value = false;
    };

    const editId = ref(null);
    const editModal = ref(false);
    const openEditModal = (id) => {
      editId.value = id;
      editModal.value = true;
    };
    const closeEditModal = () => {
      editModal.value = false;
    };

    const deleteModal = ref(false);
    const deleteProcessName = ref("");
    const deleteProcessId = ref("");

    const openDeleteModal = ({ id, name }) => {
      deleteProcessName.value = name;
      deleteProcessId.value = id;
      deleteModal.value = true;
    };

    const closeDeleteModal = () => {
      deleteModal.value = false;
    };

    const deleteProcess = async () => {
      try {
        await dispatch("uninstall/deleteSummary", { Id: deleteProcessId.value });
        deleteModal.value = false;
        notification.success({
          message: "刪除成功",
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    // 即時需量測點 Drawer
    const tagsDrawerVisible = ref(false);
    const summaryIdForTags = ref(null);
    const selectedTagIdsForTags = ref([]);
    const openConsumableTags = ({ Id, selectedTagIds = [] }) => {
      summaryIdForTags.value = Id ?? null;
      selectedTagIdsForTags.value = Array.isArray(selectedTagIds) ? selectedTagIds : [];
      tagsDrawerVisible.value = true;
    };
    const closeConsumableTags = () => {
      tagsDrawerVisible.value = false;
    };

    // 階段管理 Modal
    const stageGroupVisible = ref(false);
    const stageGroupContext = ref({ SummaryId: null, StageDetailList: [] });
    const openStageGroup = ({ SummaryId, StageDetailList }) => {
      stageGroupContext.value = { SummaryId, StageDetailList: StageDetailList || [] };
      stageGroupVisible.value = true;
    };
    const closeStageGroup = () => {
      stageGroupVisible.value = false;
    };

    // 階段設備與值 Modal
    const stageTagVisible = ref(false);
    const stageTagContext = ref({ SummaryId: null, StageDetailId: null, Stage: null });
    const openStageTag = ({ SummaryId, StageDetailId, Stage = null }) => {
      stageTagContext.value = { SummaryId, StageDetailId, Stage };
      stageTagVisible.value = true;
    };
    const closeStageTag = () => {
      stageTagVisible.value = false;
    };


    return {
      loading,
      addModal,
      openAddModal,
      closeAddModal,

      summaryVisible,
      selectedSummary,
      openAddSummary,
      openEditSummary,
      closeSummaryModal,

      // 即時需量測點
      tagsDrawerVisible,
      summaryIdForTags,
      selectedTagIdsForTags,
      openConsumableTags,
      closeConsumableTags,

      // 階段管理
      stageGroupVisible,
      stageGroupContext,
      openStageGroup,
      closeStageGroup,

      // 階段設備與值
      stageTagVisible,
      stageTagContext,
      openStageTag,
      closeStageTag,


      editId,
      editModal,
      openEditModal,
      closeEditModal,
      deleteModal,
      deleteProcessName,
      openDeleteModal,
      closeDeleteModal,
      deleteProcess,
    };
  },
});
