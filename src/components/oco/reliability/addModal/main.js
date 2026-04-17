import { defineComponent, computed, ref } from "vue";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import { useStore } from "vuex";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import GroupFilter from "@/components/oco/form/groupFilter/Index.vue";
export default defineComponent({
  components: {
    LevelSelect,
    TagFilter,
    GroupFilter,
  },
  props: {
    formState: {
      required: true,
      type: Object,
    },
    modal: {
      type: Boolean,
      default: false,
    },
    closeModal: {
      type: Function,
      required: true,
    },
  },
  setup(props, { emit }) {
    const { state } = useStore();
    const loading = computed(() => state.alarm.loading);
    const formRef = ref();
    const labelCol = {
      lg: 8,
      md: 9,
      xs: 24,
    };
    const wrapperCol = {
      lg: 16,
      md: 15,
      xs: 24,
    };

    const rules = {
      name: [
        {
          required: true,
          trigger: "blur",
          message: "請輸入",
        },
      ],
      count: [
        {
          required: true,
          message: "請輸入",
          trigger: "blur",
        },
        {
          trigger: "blur",
          pattern: /^\d+$/,
          message: "請輸入數字",
        },
      ],
    };

    const searchTypeOptions = [
      {
        id: "1",
        name: "依測點",
      },
      {
        id: "2",
        name: "依群組",
      },
    ];
    const setTags = (data) => {
      emit(
        "setTags",
        data.map((el) => el.id)
      );
    };

    const setGroups = (data) => {
      emit(
        "setGroups",
        data.map((el) => el.id)
      );
    };

    const submit = () => {
      emit("submit");
    };

    const changeSearchType = () => {
      emit("changeSearchType");
    };

    return {
      loading,
      formRef,
      labelCol,
      wrapperCol,
      rules,
      searchTypeOptions,
      setTags,
      setGroups,
      submit,
      changeSearchType,
    };
  },
});
