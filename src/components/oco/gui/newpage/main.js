import { defineComponent, onMounted } from "vue";
import { contentWrap } from "./style";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    contentWrap,
  },

  setup() {
    const { state } = useStore();

    onMounted(() => {
      openTab();
    });

    const openTab = () => {
      const urls = state.gui.guiDetail.DataContentJson
        ? state.gui.guiDetail.DataContentJson.split(",")
        : [];
      for (let i = 0; i < urls.length; i++) {
        const newTab = window.open(urls[i], i);
        if (newTab) {
          newTab.focus();
        }
      }
    };

    return {
      openTab,
    };
  },
});
