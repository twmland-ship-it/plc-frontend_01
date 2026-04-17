import { Main } from "../../styled";
import { defineComponent, onMounted, ref } from "vue";
import { FormWrap, BillWrap } from "./style";
import Setting from "./setting/Index.vue";
import Calculate from "./calculate/Index.vue";
import Schedule from "./schedule/Index.vue";
import BillList from "./billlist/Index.vue";
import Meter from "./meter/Index.vue";
import Fee from "./fee/Index.vue";
import Output from "./output/Index.vue";
import Holiday from "./holiday/Index.vue";
import Anomaly from "./anomaly/Index.vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    Main,
    FormWrap,
    BillWrap,
    Setting,
    Calculate,
    Schedule,
    BillList,
    Meter,
    Fee,
    Output,
    Holiday,
    Anomaly,
  },
  setup() {
    const { dispatch } = useStore();

    onMounted(async () => {
      await Promise.all([
        dispatch("bill/getSettingList"),
        dispatch("bill/getMeterList"),
      ]);
    });
    const activeTab = ref("1");

    return {
      activeTab,
    };
  },
});
