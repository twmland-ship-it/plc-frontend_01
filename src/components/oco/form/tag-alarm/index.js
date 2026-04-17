import { useStore } from "vuex";
import { defineComponent, inject, onMounted, ref } from "vue";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { computed } from "@vue/reactivity";
export default defineComponent({
  props: {
    alarmFormState: {
      type: Object,
      default: null,
    },
    type: {
      type: Number,
      default: 1,
    },
    statusOptions: {
      type: Array,
      default: () => [],
    },
    exceptionUntilOptions: {
      type: Array,
      default: () => [],
    },
    exceptionActionOptions: {
      type: Array,
      default: () => [],
    },
    digitalAlarmValueOptions: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    QuillEditor,
  },
  setup() {
    const { dispatch, state } = useStore();
    const form = inject("alarmForm");
    const alarmRules = {
      content: [{ required: true, message: "請輸入說明", trigger: "blur" }],
      exceptionStartAt: [
        { required: true, message: "請選擇", trigger: "blur" },
      ],
      exceptionEndAt: [{ required: true, message: "請選擇", trigger: "blur" }],
      exceptionUntil: [{ required: true, message: "請選擇", trigger: "blur" }],
      exceptionAction: [{ required: true, message: "請選擇", trigger: "blur" }],
    };

    const notifyGroupOptions = computed(() => state.notify.groupInitData);
    const exceptionStatusOptions = [
      {
        value: true,
        label: "啟用",
      },
      {
        value: false,
        label: "停用",
      },
    ];
    onMounted(async () => {
      dispatch("notify/getGroupsAndOptions");
      const res = await dispatch("gui/getAllPages");
      const addDisabledProperty = (treeData) => {
        return treeData.map((node) => {
          const newNode = { ...node };
          if (node.Category === 2) {
            newNode.disabled = true;
          }
          if (node.Children) {
            newNode.Children = addDisabledProperty(node.Children);
          }
          return newNode;
        });
      };
      pageOptions.value = addDisabledProperty(res.data);
    });
    const pageOptions = ref([]);
    return {
      form,
      alarmRules,
      notifyGroupOptions,
      exceptionStatusOptions,
      pageOptions,
    };
  },
});
