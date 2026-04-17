import { defineComponent, ref, computed, inject } from "vue";
import { DeleteSpan, AddBtn } from "./style";
import { useStore } from "vuex";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import { Modal } from "ant-design-vue";
import { useTagInfo } from "@/composable/tagInfo";
export default defineComponent({
  components: {
    DeleteSpan,
    AddBtn,
    TagFilter,
  },
  props: {
    expFormstate: {
      type: Object,
      default: null,
    },
    expressionTypeOptions: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const { state } = useStore();
    const form = inject("expForm");
    const loading = computed(() => state.tags.loading);
    const statusOptions = [
      {
        value: true,
        label: "啟用",
      },
      {
        value: false,
        label: "停用",
      },
    ];

    const expressionContent = computed(() => {
      return props.expFormstate.content
        ? props.expFormstate.content.replace(/@([^@]*)@/g, (match, id) => {
            return useTagInfo(id, "Name")
              ? `@${useTagInfo(id, "Name")}@`
              : match;
          })
        : "";
    });

    const currentTag = ref([]);

    const removeTag = (itemid) => {
      emit("removeTag", itemid);
    };

    const setTags = (data) => {
      currentTag.value = data.map((el) => el.id);
    };
    const addTag = () => {
      if (
        props.expFormstate.tags &&
        props.expFormstate.tags.find((el) =>
          currentTag.value.find((el2) => el2 === el)
        )
      ) {
        Modal.error({
          content: "測點已存在",
        });
        return;
      }
      emit("addTag", currentTag.value);
    };

    const editContent = (event) => {
      emit("editContent", event.target.value);
    };

    return {
      form,
      loading,
      statusOptions,
      expressionContent,
      currentTag,
      removeTag,
      setTags,
      addTag,
      editContent,
      useTagInfo,
    };
  },
});
