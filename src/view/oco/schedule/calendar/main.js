import { Main } from "../../styled";
import { defineComponent, ref } from "vue";
import holiday from "./holiday/Index.vue";
import season from "./season/Index.vue";
export default defineComponent({
  components: {
    Main,
    holiday,
    season,
  },
  setup() {
    const activeTab = ref("1");
    return { activeTab };
  },
});
