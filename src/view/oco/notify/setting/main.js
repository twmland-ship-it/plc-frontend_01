import { Main } from "../../styled";
import { defineComponent, onMounted, ref } from "vue";
import NotifyLine from "./Line/Index.vue";
import NotifyEmail from "./email/Index.vue";
import { useStore } from "vuex";
export default defineComponent({
  components: {
    Main,
    NotifyLine,
    NotifyEmail,
  },
  setup() {
    const { dispatch } = useStore();
    const activeTab = ref("1");
    onMounted(async () => {
      await Promise.all([
        dispatch("notify/getLineService"),
        dispatch("notify/getSMTPSetting"),
      ]);
    });

    return { activeTab };
  },
});
