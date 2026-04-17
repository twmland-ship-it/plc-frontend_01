import { defineComponent, ref, computed } from "vue";
import { useStore } from "vuex";
import { Main } from "../../styled";
import Search from "./search/Index.vue";
import Schedule from "./schedule/Index.vue";
import Download from "./download/Index.vue";
export default defineComponent({
  components: {
    Main,
    Search,
    Schedule,
    Download,
  },
  setup() {
    const { state } = useStore();
    const loading = computed(() => state.database.loading);
    const activeTab = ref("1");

    return {
      activeTab,
      loading,
    };
  },
});
