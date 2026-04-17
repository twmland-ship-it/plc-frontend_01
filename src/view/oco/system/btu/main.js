import { Main } from "../../styled";
import { defineComponent, onMounted, ref } from "vue";
import Meter from "./meter/Index.vue";
import Calculate from "./calculate/Index.vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    Main,
    Meter,
    Calculate,
  },
  setup() {
    const { dispatch } = useStore();

    onMounted(async () => {
      await Promise.all([dispatch("btu/getMeterList")]);
    });
    const activeTab = ref("1");

    return {
      activeTab,
    };
  },
});
