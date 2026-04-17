import { defineComponent, ref, computed, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  props: {
    visible: { type: Boolean, required: true },
    loading: { type: Boolean, required: true },
    summaryId: { type: [String, Number], required: true },
    selectedTagIds: { type: Array, default: () => [] },
    handleClose: { type: Function, required: true },
    title: { type: String, default: "" },
  },
  setup(props) {
    const store = useStore();
    const submitting = ref(false);

    // 本地維持「目前選擇」與「初始選擇」各一份
    const selectedIds = ref([]);
    const initialSelectedIds = ref([]);

    const pickedTags = ref([]); // array of { id, name }

    const allTags = computed(() => store.state.tags?.tagInitData || []);

    const isKWorMW = (unit) => {
      if (!unit) return false;
      const u = String(unit).toLowerCase();
      return u === "kw" || u === "mw";
    };
    // 候選清單（排除已選），非 kW/mW 置為 disabled 並於 UI 禁用
    const candidateTags = computed(() => {
      const idSet = new Set(selectedIds.value);
      return (allTags.value || []).map((t) => {
        const id = t?.Id || t?.id;
        const name = t?.Name || t?.name;
        const unit = t?.MeasurementUnit || t?.Unit || t?.unit;
        return { id, name, disabled: !isKWorMW(unit) };
      }).filter((it) => !idSet.has(it.id));
    });

    const addTag = (opt) => {
      if (!opt || !opt.id) return;
      if (selectedIds.value.includes(opt.id)) return;
      selectedIds.value = [...selectedIds.value, opt.id];
      pickedTags.value = [...pickedTags.value, { id: opt.id, name: opt.name }];
    };

    const removeTag = (id) => {
      const set = new Set(selectedIds.value);
      set.delete(id);
      selectedIds.value = Array.from(set);
      pickedTags.value = pickedTags.value.filter((t) => t.id !== id);
    };


    // 依 props 與 tags 初始化（或當抽屜重新打開/標籤載入完成時）
    const hydrateFromProps = () => {
      const ids = Array.isArray(props.selectedTagIds) ? [...props.selectedTagIds] : [];
      selectedIds.value = ids;
      initialSelectedIds.value = [...ids];
      // 建立 pickedTags 以便使用者直接按「確定」也能提交目前狀態
      const idSet = new Set(ids);
      pickedTags.value = (allTags.value || [])
        .filter((t) => idSet.has(t?.Id || t?.id))
        .map((t) => ({ id: t?.Id || t?.id, name: t?.Name || t?.name }));
    };

    watch(
      () => [props.visible, allTags.value?.length],
      () => {
        if (props.visible) hydrateFromProps();
      }
    );

    const onSetTags = (tags) => {
      // tags: [{ id, name }]
      pickedTags.value = Array.isArray(tags) ? tags : [];
      selectedIds.value = pickedTags.value.map((t) => t.id);
    };

    const reset = () => {
      selectedIds.value = [...initialSelectedIds.value];
      const idSet = new Set(selectedIds.value);
      pickedTags.value = (allTags.value || [])
        .filter((t) => idSet.has(t?.Id || t?.id))
        .map((t) => ({ id: t?.Id || t?.id, name: t?.Name || t?.name }));
    };

    const submit = async () => {
      try {
        // 二次確認
        // 使用瀏覽器確認窗即可，避免額外引入 UI 依賴
        if (!window.confirm("確定要儲存目前的即時需量測點設定嗎？")) return;

        submitting.value = true;
        // map to ids, but filter by unit kW/mW
        const idSet = new Set((pickedTags.value || []).map((t) => t.id));
        const validIds = [];
        for (const tag of allTags.value) {
          if (idSet.has(tag?.Id || tag?.id)) {
            if (isKWorMW(tag?.MeasurementUnit || tag?.Unit || tag?.unit)) {
              validIds.push(tag?.Id || tag?.id);
            }
          }
        }
        await store.dispatch("uninstall/setConsumableTags", {
          SummaryId: props.summaryId,
          ElectricPowerConsumableTagIdList: validIds,
        });
        props.handleClose && props.handleClose();
      } catch (err) {
        console.error(err);
      } finally {
        submitting.value = false;
      }
    };

    return {
      submitting,
      selectedIds,
      pickedTags,
      allTags,
      candidateTags,
      addTag,
      removeTag,
      onSetTags,
      reset,
      submit,
    };
  },
});

