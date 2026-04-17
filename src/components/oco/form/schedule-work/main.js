import { useStore } from "vuex";
import { computed, defineComponent, reactive, inject } from "vue";
import DataTables from "@/components/table/DataTable.vue";
export default defineComponent({
  components: {
    DataTables,
  },
  props: {
    seasonOptions: {
      type: Array,
      required: true,
    },
    endTimeOptions: {
      type: Array,
      required: true,
    },
    repeatOptions: {
      type: Array,
      required: true,
    },
    monthAdditionOptions: {
      type: Array,
      required: true,
    },
    formState: {
      type: Object,
      required: true,
    },
    rules: {
      type: Object,
      required: true,
    },
  },
  setup(_, { emit }) {
    const { state } = useStore();
    const loading = computed(() => state.schedule.loading);
    const form = inject("workBasicForm");
    const labelCol = {
      lg: 6,
      md: 9,
      xs: 24,
    };

    const wrapperCol = {
      lg: 18,
      md: 15,
      xs: 24,
    };

    const radioStyle = reactive({
      display: "flex",
      marginTop: "0.2rem",
    });

    const changeStartTime = () => {
      emit("changeStartTime");
    };

    const changeRepeat = () => {
      emit("changeRepeat");
    };

    return {
      loading,
      form,
      labelCol,
      wrapperCol,
      radioStyle,
      changeStartTime,
      changeRepeat,
    };
  },
});
