import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { message } from "ant-design-vue";

let keySeq = 1;
const newRow = (partial = {}) => ({ _k: keySeq++, TagId: null, UnloadValue: null, LoadValue: null, IntervalSecondsForLoad: null, tagName: "", ...partial });

export default defineComponent({
  props: {
    visible: { type: Boolean, required: true },
    loading: { type: Boolean, required: true },
    summaryId: { type: [String, Number], required: true },
    stageDetailId: { type: [String, Number], default: null },
    stage: { type: Object, default: null },
    handleClose: { type: Function, required: true },
    title: { type: String, default: "" },
  },
  setup(props) {
    const store = useStore();
    const submitting = ref(false);

    const labelCol = { lg: 6, md: 8, xs: 24 };
    const wrapperCol = { lg: 18, md: 16, xs: 24 };

    const autoCompute = ref(true);
    const stageId = ref(props.stageDetailId || null);

    const rows = ref([]); // 已選（左欄）
    const initialRows = ref([]); // 預載狀態（供重設）

    const allTags = computed(() => store.state.tags?.tagInitData || []);
    const tagNameById = (id) => {
      const t = (allTags.value || []).find((x) => (x?.Id || x?.id) === id);
      const name = t?.Name || t?.name;
      const desc = t?.Description || t?.description;
      return desc ? `${name}(${desc})` : (name || String(id || ""));
    };
    // 若候選清單尚未載入，開啟時嘗試載入一次
    watch(
      () => props.visible,
      async (vis) => {
        if (vis && (!allTags.value || allTags.value.length === 0)) {
          try {
            await store.dispatch("tags/getAllTagsAndOptions");
          } catch (e) {
            console.warn("tags/getAllTagsAndOptions failed", e);
          }
        }
      }
    );


    const hydrateFromProps = () => {
      const tagList = props.stage?.TagList || [];
      const mapped = (tagList || []).map((t) => newRow({
        TagId: t?.TagId,
        UnloadValue: t?.UnloadValue ?? null,
        LoadValue: t?.LoadValue ?? null,
        IntervalSecondsForLoad: t?.IntervalSecondsForLoad ?? null,
        tagName: tagNameById(t?.TagId),
      }));
      initialRows.value = mapped;
      rows.value = mapped.map((r) => ({ ...r, _k: keySeq++ }));
    };

    watch(
      () => [props.visible, props.stageDetailId, allTags.value?.length],
      () => {
        if (props.visible) {
          if (props.stageDetailId) stageId.value = props.stageDetailId;
          hydrateFromProps();
        }
      }
    );

    const selectedIds = computed(() => new Set((rows.value || []).map((r) => r.TagId)));

    const candidateTags = computed(() => {
      return (allTags.value || [])
        .map((t) => ({ id: t?.Id || t?.id, name: tagNameById(t?.Id || t?.id) }))
        .filter((opt) => !selectedIds.value.has(opt.id));
    });

    const searchText = ref("");
    const displayedCandidateTags = computed(() => {
      const q = (searchText.value || "").trim().toLowerCase();
      if (!q) return candidateTags.value;
      return candidateTags.value.filter((x) => x.name?.toLowerCase().includes(q));
    });

    const addCandidate = (opt) => {
      if (!opt || !opt.id) return;
      if (selectedIds.value.has(opt.id)) return;
      rows.value = [...rows.value, newRow({ TagId: opt.id, tagName: opt.name })];
    };

    const removeRow = (k) => (rows.value = rows.value.filter((r) => r._k !== k));

    const reset = () => {
      rows.value = initialRows.value.map((r) => ({ ...r, _k: keySeq++ }));
    };

    const onUnloadChange = (r) => {
      if (!autoCompute.value) return;
      const v = Number(r.UnloadValue);
      if (Number.isFinite(v)) {
        r.LoadValue = -v; // 反向值
      }
    };

    const submit = async () => {
      try {
        if (!window.confirm("確定要儲存目前的設備與值設定嗎？")) return;
        submitting.value = true;
        if (!stageId.value) throw new Error("請輸入 StageDetailId");
        const TagList = rows.value
          .filter((r) => r.TagId)
          .map((r) => ({
            TagId: r.TagId,
            UnloadValue: r.UnloadValue,
            LoadValue: r.LoadValue,
            IntervalSecondsForLoad: r.IntervalSecondsForLoad,
          }));
        await store.dispatch("uninstall/editStageTag", {
          StageDetailId: stageId.value,
          SummaryId: props.summaryId,
          TagList,
        });
        message.success("已儲存階段設備與值");
        props.handleClose && props.handleClose();
      } catch (err) {
        console.error(err);
      } finally {
        submitting.value = false;
      }
    };

    const stageLabel = computed(() => {
      const s = props.stage || {};
      const code = s?.StageCode ?? null;
      const name = s?.StageName ?? null;
      if (code && name) return `${code} - ${name}`;
      if (name) return name;
      if (code) return `Stage ${code}`;
      return String(stageId.value ?? "");
    });

    return {
      submitting,
      labelCol,
      wrapperCol,
      autoCompute,
      stageId,
      stageLabel,
      rows,
      candidateTags,
      searchText,
      displayedCandidateTags,
      addCandidate,
      removeRow,
      onUnloadChange,
      reset,
      submit,
    };
  },
});

