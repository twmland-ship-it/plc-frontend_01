import { defineComponent, ref } from "vue";
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    processName: {
      type: String,
      required: true,
    },
    handleClose: {
      type: Function,
      required: true,
    },
    handleOk: {
      type: Function,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const inputName = ref("");
    return { inputName };
  },
});
