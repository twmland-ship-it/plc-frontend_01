import { defineComponent, ref, onBeforeUnmount } from "vue";
import GroupList from "./list/Index.vue";
import GroupClass from "./class/Index.vue";
import { Main } from "../../styled";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    GroupList,
    Main,
    GroupClass,
  },
  setup() {
    const { dispatch } = useStore();
    const activeTab = ref("1");

    onBeforeUnmount(() => {
      dispatch("group/resetGroupState");
    });
    return { activeTab };
  },
});
