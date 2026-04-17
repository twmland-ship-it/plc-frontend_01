import { Main } from "../../styled.js";
import { defineComponent, ref } from "vue";
import DeviceList from "./list/Index.vue";
import DeviceClass from "./class/Index.vue";
export default defineComponent({
  components: { DeviceList, DeviceClass, Main },
  setup() {
    const activeTab = ref("1");

    return {
      activeTab,
    };
  },
});
