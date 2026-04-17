import { defineComponent, reactive, ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { Modal, notification } from "ant-design-vue";

export default defineComponent({
  props: {
    visible: { type: Boolean, required: true },
    loading: { type: Boolean, required: true },
    summary: {
      type: Object,
      default: () => ({
        Id: null,
        Name: "",
        Mode: 1,
        ContinuedSecond: 0,
        IsLoad: false,
        ContractCapacity: 1,
      }),
    },
    handleClose: { type: Function, required: true },
  },
  setup(props) {
    const { dispatch } = useStore();
    const formRef = ref(null);
    const formState = reactive({
      Id: null,
      Name: "",
      Mode: 1,
      ContinuedSecond: 0,
      IsLoad: false,
      ContractCapacity: 1,
    });

    watch(
      () => props.summary,
      (s) => {
        formState.Id = s?.Id ?? null;
        formState.Name = s?.Name ?? "";
        formState.Mode = s?.Mode ?? s?.ModeCode ?? 1;
        formState.ContinuedSecond = s?.ContinuedSecond ?? s?.ContinueSeconds ?? 0;
        formState.IsLoad = s?.IsLoad ?? false;
        formState.ContractCapacity = s?.ContractCapacity ?? 1;
      },
      { immediate: true, deep: true }
    );

    const labelCol = { lg: 7, md: 8, xs: 24 };
    const wrapperCol = { lg: 17, md: 16, xs: 24 };

    const isEdit = computed(() => !!formState.Id);

    const submit = async () => {
      try {
        await formRef.value?.validate?.();
        if (isEdit.value) {
          await dispatch("uninstall/editSummary", {
            Id: formState.Id,
            Name: formState.Name,
            Mode: formState.Mode,
            ContinuedSecond: formState.ContinuedSecond,
            IsLoad: formState.IsLoad,
            ContractCapacity: formState.ContractCapacity,
          });
          notification.success({ message: "修改成功" });
        } else {
          await dispatch("uninstall/createSummary", {
            Name: formState.Name,
            Mode: formState.Mode,
            ContinuedSecond: formState.ContinuedSecond,
            IsLoad: formState.IsLoad,
            ContractCapacity: formState.ContractCapacity,
          });
          notification.success({ message: "新增成功" });
        }
        props.handleClose();
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err?.response?.data?.Message || err?.message || String(err),
        });
      }
    };

    return { formRef, formState, labelCol, wrapperCol, isEdit, submit };
  },
});
