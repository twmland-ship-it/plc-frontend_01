import { defineComponent, ref } from "vue";
import TagList from "./list/Index.vue";
import TagClass from "./class/Index.vue";
import { Main } from "../../styled";
export default defineComponent({
  components: {
    TagList,
    Main,
    TagClass,
  },
  setup() {
    const activeTab = ref("1");
    return { activeTab };
  },
});
