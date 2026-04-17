import { defineComponent, onMounted, reactive, toRaw, ref, watch } from "vue";
import { getCctvStreamInfo } from "@/composable/cctvCache";
import { useModalDrag } from "@/composable/modalDrag";
import Go2rtcVideoPlayer from "@/components/oco/util/Go2rtcVideoPlayer.vue";

export default defineComponent({
  components: { Go2rtcVideoPlayer },
  props: {
    cctv: {
      type: Array,
      default: () => [],
    },
    dontShowOnAlarm: {
      type: Boolean,
      default: false,
    },
    alarm: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["changeAlarmSetting"],
  async setup(props, { emit }) {
    const streams = reactive({});
    const alarmShow = ref(false);

    async function resolveStreams(cctvIds) {
      for (const key in streams) delete streams[key];
      if (!cctvIds || cctvIds.length === 0) return;
      for (const id of cctvIds) {
        const info = await getCctvStreamInfo(id);
        if (info) {
          streams[id] = info;
        }
      }
    }

    onMounted(() => {
      useModalDrag(".cctv-modal, .cctv-modal-wrap");
      alarmShow.value = props.dontShowOnAlarm;
      resolveStreams(toRaw(props.cctv));
    });

    watch(
      () => props.cctv,
      (newIds, oldIds) => {
        const newRaw = toRaw(newIds);
        const oldRaw = toRaw(oldIds);
        if (JSON.stringify(newRaw) === JSON.stringify(oldRaw)) return;
        resolveStreams(newRaw);
      },
      { deep: true }
    );

    const onDontShowChanged = (e) => {
      emit("changeAlarmSetting", e.target.checked);
    };

    const onPlayerError = (cctvId, err) => {
      console.warn(`CCTV 播放器錯誤 (${cctvId}):`, err?.message || err);
    };

    return { streams, alarmShow, onDontShowChanged, onPlayerError };
  },
});
