import { defineComponent } from "vue";
import { useStore } from "vuex";
import { ChartContainer } from "./style";
import Chart from "@/components//utilities/chartjs";
import dayjs from "dayjs";
export default defineComponent({
  props: {
    tagId: {
      type: String,
      default: null,
    },
  },
  components: {
    Chart,
    ChartContainer,
  },
  async setup(props) {
    const { dispatch } = useStore();
    const res = await dispatch("gui/getGuiTagTrend", props.tagId);
    const first20 = res.slice(0, 20);
    const labels = first20.map((el) =>
      dayjs(el.Time).format("YYYY-MM-DD HH:mm:ss")
    );
    const datasets = [
      {
        label: "測點值",
        data: first20.map((el) => el.Value),
        borderColor: "#FF8000",
        backgroundColor: "#FF8000",
      },
    ];
    const options = {
      responsive: true,
      maintainAspectRatio: false,

      layout: {
        padding: {
          left: "-10",
          right: 0,
          top: 0,
          bottom: 0,
        },
      },
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return value;
            },
          },
        },
      },
    };
    return {
      labels,
      datasets,
      options,
    };
  },
});
