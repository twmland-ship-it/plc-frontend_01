import { defineComponent, inject, reactive, watch, ref, onMounted } from "vue";
import EventForm from "@/components/oco/form/uninstall-tag/Index.vue";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    EventForm,
    TagFilter,
  },
  props: {
    eventFormState: {
      type: Object,
      default: null,
    },
  },
  setup(props, { emit }) {
    const { dispatch } = useStore();
    onMounted(async () => {
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
    const eventTypeOptions = ref([
      {
        id: 1,
        name: "無",
      },
      {
        id: 2,
        name: "送出訊號",
      },
      {
        id: 3,
        name: "手動輸入",
      },
      {
        id: 4,
        name: "跳轉頁面",
      },
    ]);

    const formRef = inject("eventFormRef");
    const formState = reactive({
      eventType: 1,
      eventTagsData: [],
      eventTargetTagId: null,
      eventTargetTagName: null,
      link: null,
    });
    Object.assign(formState, props.eventFormState);

    const eventColumns = [
      {
        title: "測點名稱",
        dataIndex: "name",
      },

      {
        title: "送出訊號值",
        editable: true,
        dataIndex: "signalValue",
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "70px",
      },
    ];

    const rules = {
      eventTargetTagId: [
        {
          required: true,
          message: "請輸入目標測點",
          trigger: "blur",
        },
      ],
      link: [
        {
          required: true,
          message: "請選擇目標頁面",
          trigger: "blur",
        },
      ],
    };

    const addEventTag = (tags) => {
      formState.eventTagsData = [
        ...formState.eventTagsData,
        ...tags.map((el) => ({ ...el, signalValue: "" })),
      ];
    };

    const editEventTag = ({ id, key, value }) => {
      formState.eventTagsData.find((el) => el.id === id)[key] = value;
    };

    const deleteEventTag = (id) => {
      formState.eventTagsData.splice(
        formState.eventTagsData.indexOf(
          formState.eventTagsData.find((el) => el.id === id)
        ),
        1
      );
    };

    const setTargetTag = ({ value, label }) => {
      formState.eventTargetTagId = value;
      formState.eventTargetTagName = label;
    };

    watch(
      () => formState,
      () => {
        emit("submit", formState);
      },
      { deep: true }
    );

    return {
      pageOptions,
      eventTypeOptions,
      formRef,
      formState,
      eventColumns,
      rules,
      addEventTag,
      editEventTag,
      deleteEventTag,
      setTargetTag,
    };
  },
});
