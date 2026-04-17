import { Main } from "../../styled";
import { defineComponent, onMounted, ref } from "vue";
import Calculate from "./calculate/Index.vue";
import Schedule from "./schedule/Index.vue";
import BillList from "./billlist/Index.vue";
import Meter from "./meter/Index.vue";
import Fee from "./fee/Index.vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    Main,
    Calculate,
    Schedule,
    BillList,
    Meter,
    Fee,
  },
  setup() {
    const { dispatch } = useStore();

    onMounted(async () => {
      await Promise.all([dispatch("waterbill/getMeterList")]);
    });
    const activeTab = ref("1");

    return {
      activeTab,
    };
  },
});
