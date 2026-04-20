import { Main } from "../../styled.js";
import { computed, defineComponent, onBeforeUnmount, onMounted } from "vue";
import { useStore } from "vuex";
import UninstallList from "@/components/oco/uninstall/list/Index.vue";

const AUTO_REFRESH_INTERVAL_MS = 10_000;

export default defineComponent({
  components: {
    Main,
    UninstallList,
  },
  setup() {
    const { state, dispatch } = useStore();
    const fetching = computed(() => !!state.uninstall.fetching);
    let timerId = null;

    const refresh = async (isPoll) => {
      await dispatch("uninstall/getData", { isPoll });
    };

    const onVisibilityChange = async () => {
      if (document.hidden) return;
      if (state.uninstall.fetching) return;
      await refresh(true);
    };

    onMounted(async () => {
      await refresh(false);
      timerId = window.setInterval(async () => {
        if (document.hidden) return;
        if (state.uninstall.fetching) return;
        await refresh(true);
      }, AUTO_REFRESH_INTERVAL_MS);
      document.addEventListener("visibilitychange", onVisibilityChange);
    });

    onBeforeUnmount(() => {
      if (timerId) {
        clearInterval(timerId);
        timerId = null;
      }
      document.removeEventListener("visibilitychange", onVisibilityChange);
    });

    return {
      fetching,
    };
  },
});
