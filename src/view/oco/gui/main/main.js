import { defineComponent, ref, computed, watch, onMounted } from "vue";
import { Main } from "../../styled";
import { guiWrap, modalWrap } from "./style";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { Modal } from "ant-design-vue";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import GuiList from "@/components/oco/gui/list/Index.vue";
import GuiPicture from "@/components/oco/gui/picture/Index.vue";
import GuiIframe from "@/components/oco/gui/iframe/Index.vue";
import GuiNewPage from "@/components/oco/gui/newpage/Index.vue";
export default defineComponent({
  components: {
    GuiList,
    GuiPicture,
    GuiIframe,
    GuiNewPage,
    Main,
    guiWrap,
    modalWrap,
    LevelSelect,
  },
  setup() {
    // const reload = inject("reload");
    const route = useRoute();
    const { dispatch, state } = useStore();
    const init = ref(false);
    const loading = computed(() => state.gui.loading);
    const router = useRouter();
    const title = ref("頁面標題");
    const guiType = ref();
    const showDevice = ref(false);

    onMounted(async () => {
      try {
        await Promise.all([dispatch("gui/fetchGuiDetail", route.params.id)]);
        guiType.value = state.gui.guiDetail.Category;
        title.value = state.gui.guiDetail.Name;
        init.value = true;
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
        router.push("/");
      }
    });

    watch(
      () => route.params.id,
      async () => {
        try {
          if (route.name === "gui-main") {
            init.value = false;
            await dispatch("gui/fetchGuiDetail", route.params.id);
            guiType.value = state.gui.guiDetail.Category;
            title.value = state.gui.guiDetail.Name;
            init.value = true;
          }
        } catch (err) {
          Modal.error({
            title: "發生錯誤",
            content: err.message,
          });
          router.push("/");
        }
      }
    );

    return {
      init,
      loading,
      showDevice,
      title,
      guiType,
    };
  },
});
