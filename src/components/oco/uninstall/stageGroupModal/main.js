import { defineComponent, computed, reactive, ref, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    visible: { type: Boolean, required: true },
    loading: { type: Boolean, required: true },
    summaryId: { type: [String, Number], required: true },
    stages: { type: Array, default: () => [] },
    handleClose: { type: Function, required: true },
    title: { type: String, default: "" },
    openStageTag: { type: Function, required: false },
  },
  setup(props) {
    const store = useStore();
    const submitting = ref(false);

    const labelCol = { lg: 6, md: 8, xs: 24 };
    const wrapperCol = { lg: 18, md: 16, xs: 24 };

    const columns = [
      { title: "StageCode", dataIndex: "StageCode", key: "StageCode" },
      { title: "StageName", dataIndex: "StageName", key: "StageName" },
      { title: "LoadLLmt", dataIndex: "LoadLLmt", key: "LoadLLmt" },
      { title: "UnloadULmt", dataIndex: "UnloadULmt", key: "UnloadULmt" },
    ];

    const stageRows = computed(() => (props.stages || []).map(s => ({
      StageId: s?.StageId ?? s?.Id ?? s?.StageDetailId,
      StageCode: s?.StageCode,
      StageName: s?.StageName,
      LoadLLmt: s?.LoadLLmt,
      UnloadULmt: s?.UnloadULmt,
    })));

    const form = reactive({
      ModifyMode: 1,
      StageId: null,
      StageCode: null,
      StageName: "",
      UnloadULmt: null,
      LoadLLmt: null,
      UnloadAlarmTagId: null,
    });

    // for StageTagModal
    const selectedStageForTag = ref(null);
    const openStageTagClick = () => {
      if (!props.openStageTag || !selectedStageForTag.value) return;
      const s = (props.stages || []).find(x => (x?.StageId ?? x?.Id ?? x?.StageDetailId) === selectedStageForTag.value);
      if (!s) return;
      const sdid = s?.StageDetailId ?? s?.StageId ?? s?.Id;
      props.openStageTag({ SummaryId: props.summaryId, StageDetailId: sdid, Stage: s });
    };

    watch(() => form.StageId, (sid) => {
      if (!sid) return;
      const s = (props.stages || []).find(x => (x?.StageId ?? x?.Id ?? x?.StageDetailId) === sid);
      if (s) {
        form.StageCode = s.StageCode;
        form.StageName = s.StageName;
        form.UnloadULmt = s.UnloadULmt;
        form.LoadLLmt = s.LoadLLmt;
        form.UnloadAlarmTagId = s.UnloadAlarmTagId ?? null;
      }
    });

    const submit = async () => {
      try {
        submitting.value = true;
        const payload = {
          ModifyMode: form.ModifyMode,
          SummaryId: props.summaryId,
          StageId: form.StageId,
          StageCode: form.StageCode,
          StageName: form.StageName,
          UnloadULmt: form.UnloadULmt,
          LoadLLmt: form.LoadLLmt,
          UnloadAlarmTagId: form.UnloadAlarmTagId,
        };
        await store.dispatch("uninstall/editStageGroup", payload);
        props.handleClose && props.handleClose();
      } catch (err) {
        console.error(err);
      } finally {
        submitting.value = false;
      }
    };

    return {
      submitting,
      labelCol,
      wrapperCol,
      columns,
      stageRows,
      form,
      submit,

      selectedStageForTag,
      openStageTagClick,
    };
  },
});

