import { useStore } from "vuex";
import { computed, defineComponent, inject, ref } from "vue";
import LevelSelect from "@/components/oco/form/level-select/LevelSelect.vue";
import DeviceFilter from "@/components/oco/form/deviceFilter/Index.vue";
import CCTVFilter from "@/components/oco/form/cctvFilter/Index.vue";
import Notice from "@/components/oco/util/Notice.vue";
export default defineComponent({
  props: {
    formState: {
      type: Object,
      default: null,
    },
    typeOptions: {
      type: Array,
      default: () => [],
    },
    saveTypeOptions: {
      type: Array,
      default: () => [],
    },
    logTypeOptions: {
      type: Array,
      default: () => [],
    },
    unitOptions: {
      type: Array,
      default: () => [],
    },
    dataTypeOptions: {
      type: Array,
      default: () => [],
    },
    locations: {
      type: Array,
      default: () => [],
    },
    classOptions: {
      type: Array,
      default: () => [],
    },
  },
  components: { LevelSelect, DeviceFilter, CCTVFilter, Notice },
  setup(props, { emit }) {
    const noticeContent = ref(
      "定時:每整點固定分鐘儲存一次 \n &nbsp;&nbsp;&nbsp;&nbsp;例: 設定5分鐘則00:05 00:10開始儲存 \n 循環:即刻開始每固定分鐘儲存一次 \n &nbsp;&nbsp;&nbsp;&nbsp;例:設定5分鐘，現在時間為00:11，則00:1600:21儲存資料"
    );
    const { state } = useStore();
    const form = inject("form");
    const rules = {
      region: [{ required: true, message: "請選擇地區", trigger: "blur" }],
      device: [{ required: true, message: "請選擇裝置", trigger: "blur" }],
      name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
      description: [{ required: true, message: "請輸入說明", trigger: "blur" }],
      dataType: [{ required: true, message: "請選擇型別", trigger: "blur" }],
      valueMultiple: [
        { required: true, message: "請輸入數值", trigger: "blur" },
      ],
      valueAddress: [
        { required: true, message: "請輸入位址", trigger: "blur" },
      ],
      transferMax: [{ required: true, message: "請輸入數值", trigger: "blur" }],
      transferMin: [{ required: true, message: "請輸入數值", trigger: "blur" }],
      max: [{ required: true, message: "請輸入數值", trigger: "blur" }],
      min: [{ required: true, message: "請輸入數值", trigger: "blur" }],
      dataInterval: [
        { required: true, message: "請輸入數值", trigger: "blur" },
      ],
      logInterval: [
        {
          required: true,
          message: "請輸入數值",
          trigger: "blur",
        },
      ],
      initValue: [
        {
          required: true,
          message: "請輸入數值",
          trigger: "blur",
        },
      ],

      use: [{ required: true, message: "請選擇用途", trigger: "blur" }],
      // tagClass: [
      //   {
      //     required: true,
      //     validator: (rule, value, callback) => {
      //       if (value.length < 1) {
      //         callback("至少輸入一種分類");
      //       }
      //       callback();
      //     },
      //     message: "請選擇分類",
      //     trigger: "blur",
      //   },
      // ],
      unit: [{ required: true, message: "請選擇單位", trigger: "blur" }],
      // ignore: [{ required: true, message: "請輸入數值", trigger: "blur" }],
    };

    const loading = computed(() => state.tags.loading);

    const statusOptions = [
      {
        value: true,
        label: "啟用",
      },
      {
        value: false,
        label: "停用",
      },
    ];

    const retentiveOptions = [
      {
        value: true,
        label: "保持",
      },
      {
        value: false,
        label: "不保持",
      },
    ];

    const logOptions = [
      {
        value: true,
        label: "儲存",
      },
      {
        value: false,
        label: "不儲存",
      },
    ];

    const usageOptions = {
      Normal: "一般點",
      Alarm: "異常點",
      Status: "狀態點",
    };

    const closingContactOptions = {
      NO: "常開點",
      NC: "常閉點",
    };

    const setCCTV = (data) => {
      emit("setCCTV", data);
    };

    const setDevice = (data) => {
      emit("setDevice", data);
    };

    return {
      noticeContent,
      form,
      rules,
      loading,
      statusOptions,
      retentiveOptions,
      logOptions,
      usageOptions,
      closingContactOptions,
      setCCTV,
      setDevice,
    };
  },
});
