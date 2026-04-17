import { defineComponent, reactive, ref } from "vue";
import { ActionSpan } from "./style";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import GroupFilter from "@/components/oco/form/groupFilter/Index.vue";
import draggable from "vuedraggable";
export default defineComponent({
  components: { ActionSpan, TagFilter, draggable, GroupFilter },
  props: {
    dataSource: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
  },
  emits: ["addTag", "changeData", "deleteTag"],
  setup(props, { emit }) {
    const labelCol = {
      lg: 4,
      md: 9,
      xs: 24,
    };
    const wrapperCol = {
      lg: 20,
      md: 15,
      xs: 24,
    };
    const filterFormState = reactive({
      tag: [],
      group: [],
    });

    const setTags = (data) => {
      filterFormState.tag = data;
      addTag();
    };

    const setGroups = (data) => {
      filterFormState.group = data;
      addTag();
    };

    const addTag = () => {
      const groupTags = [].concat(
        ...filterFormState.group.map((el) => {
          return el.tags.map((tag) => ({ id: tag.Id, name: tag.Name }));
        })
      );

      const groupSet = new Set(groupTags.map((item) => item.id));
      const union = groupTags.concat(
        filterFormState.tag.filter((item) => !groupSet.has(item.id))
      );
      const allTags = union.reduce((a, b) => {
        !props.dataSource.find((el) => el.id === b.id) ? a.push(b) : a;
        return a;
      }, []);

      emit("addTag", allTags);
    };

    const isSort = ref(false);

    const changeData = (e, data) => {
      emit("changeData", { ...data, value: e.target.value });
    };

    const changeSelect = (e, data) => {
      emit("changeData", { ...data, value: e });
    };

    const deleteTag = (id) => {
      emit("deleteTag", id);
    };

    return {
      setTags,
      setGroups,
      addTag,
      labelCol,
      wrapperCol,
      filterFormState,
      isSort,
      changeData,
      changeSelect,
      deleteTag,
    };
  },
});
