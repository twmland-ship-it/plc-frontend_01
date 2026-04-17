import { defineComponent, ref, computed } from "vue";
import VueTypes from "vue-types";
// import { TreeSelect } from "ant-design-vue";
export default defineComponent({
  name: "LevelSelect",
  props: {
    selectedValue: {
      type: Object,
      default: null,
    },
    group: VueTypes.array,
    nullOption: {
      type: Boolean,
      default: false,
    },
    childName: {
      type: String,
      default: "name",
    },
    childProp: {
      type: String,
      default: "children",
    },
  },
  setup(props, { emit }) {
    // const SHOW_PARENT = TreeSelect.SHOW_PARENT;
    const selected = ref(props.selectedValue || {});
    const levels = ref(
      props.selectedValue
        ? Array.from(Array(Object.keys(props.selectedValue).length).keys())
        : [0]
    );

    const data = computed(() => {
      if (props.group) return props.group;
      return [];
    });
    const getNextLevel = (level) => {
      if (level === 0) {
        return data.value;
      }
      const parentLevel = levels.value[level - 1];
      const parentRegion = JSON.parse(selected.value[parentLevel]);
      if (
        parentRegion &&
        parentRegion[props.childProp] &&
        parentRegion[props.childProp].length > 0
      ) {
        return parentRegion[props.childProp];
      }
      return [];
    };

    const handleChange = (level) => {
      const index = levels.value.indexOf(level);
      for (let i = index + 1; i < levels.value.length; i++) {
        delete selected.value[i];
      }
      levels.value.splice(index + 1, levels.value.length - (index + 1));
      if (!selected.value[level]) {
        const returnValue =
          levels.value.length > 1
            ? selected.value[levels.value.length - 2]
            : null;
        emit("change", JSON.parse(returnValue), selected.value);
      } else {
        emit(
          "change",
          JSON.parse(selected.value[levels.value.length - 1]),
          selected.value
        );
        const toJson = JSON.parse(selected.value[level]);
        if (toJson[props.childProp]) {
          levels.value.push(level + 1);
        }
      }
    };
    return {
      // SHOW_PARENT,
      selected,
      levels,
      getNextLevel,
      handleChange,
    };
  },
});
