import { defineComponent, onMounted, reactive, ref, toRaw } from "vue";
import { useStore } from "vuex";
import SettingForm from "@/components/oco/form/uninstall-tag/Index.vue";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import { Modal } from "ant-design-vue";
export default defineComponent({
  components: {
    SettingForm,
    TagFilter,
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    processId: {
      type: String,
      default: null,
    },
    visible: {
      type: Boolean,
      required: true,
    },
    handleClose: {
      type: Function,
      required: true,
    },

    loading: {
      type: Boolean,
      required: true,
    },
  },

  setup(props) {
    const { dispatch } = useStore();
    const activeTab = ref("1");

    const form = ref(null);
    const formState = reactive({
      name: "",
      detectTagId: null,
    });

    const setTag = (data) => {
      formState.detectTagId = data.value;
    };

    const rules = {
      name: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
      detectTagId: [{ required: true, message: "請選擇測點", trigger: "blur" }],
    };

    onMounted(async () => {
      if (props.processId) {
        const res = await dispatch(
          "uninstall/getProcessDetail",
          props.processId
        );
        uninstallData.value = res.unInstall;
        installData.value = res.install;
        formState.name = res.name;
        formState.detectTagId = res.target.id;
      }
    });

    const uninstallColumns = [
      {
        title: "測點名稱",
        dataIndex: "name",
      },
      {
        title: "卸載閥值",
        dataIndex: "value",
        editable: true,
      },
      {
        title: "送出訊號值",
        dataIndex: "signalValue",
        editable: true,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "70px",
      },
    ];

    const uninstallData = ref([]);
    const addUninstallTag = (tags) => {
      uninstallData.value = [
        ...uninstallData.value,
        ...tags.map((el) => ({ ...el, value: "", signalValue: "" })),
      ];
    };

    const editUninstallTag = ({ id, key, value }) => {
      uninstallData.value.find((el) => el.id === id)[key] = value;
    };

    const deleteUninstallTag = (id) => {
      uninstallData.value.splice(
        uninstallData.value.indexOf(
          uninstallData.value.find((el) => el.id === id)
        ),
        1
      );
    };

    const installColumns = [
      {
        title: "測點名稱",
        dataIndex: "name",
      },
      {
        title: "加載閥值",
        dataIndex: "value",
        editable: true,
      },
      {
        title: "送出訊號值",
        dataIndex: "signalValue",
        editable: true,
      },
      {
        title: "操作",
        dataIndex: "action",
        width: "70px",
      },
    ];
    const installData = ref([]);
    const addInstallTag = (tags) => {
      installData.value = [
        ...installData.value,
        ...tags.map((el) => ({ ...el, value: "", signalValue: "" })),
      ];
    };

    const editInstallTag = ({ id, key, value }) => {
      installData.value.find((el) => el.id === id)[key] = value;
    };

    const deleteInstallTag = (id) => {
      installData.value.splice(
        installData.value.indexOf(installData.value.find((el) => el.id === id)),
        1
      );
    };

    function validateTagValue(arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].value === "" || arr[i].signalValue === "") {
          return false;
        }
      }
      return true;
    }

    const submit = async () => {
      try {
        let failedArr = [];
        await form.value.validateFields().catch(() => {
          failedArr.push("基礎設定");
          return;
        });

        if (!validateTagValue(uninstallData.value)) {
          failedArr.push("卸載設定");
        }

        if (!validateTagValue(installData.value)) {
          failedArr.push("加載設定");
        }

        if (failedArr.length > 0) {
          let str = "";
          failedArr.forEach((el) => (str += `"${el}" `));
          str += `尚未設置完成`;
          Modal.error({
            title: "請將欄位填寫完整",
            content: str,
          });
          return;
        }

        const { name, detectTagId } = formState;
        const params = {
          name,
          detectTagId,
          uninstallData: toRaw(uninstallData.value),
          installData: toRaw(installData.value),
        };

        let title = "";
        if (props.processId) {
          title = "修改成功";
          await dispatch("uninstall/editProcess", params);
        } else {
          title = "新增成功";
          await dispatch("uninstall/addProcess", params);
        }
        props.handleClose();
        Modal.success({
          title,
        });
      } catch (err) {
        props.handleClose();
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    return {
      activeTab,
      form,
      formState,
      setTag,
      rules,
      uninstallColumns,
      uninstallData,
      addUninstallTag,
      editUninstallTag,
      deleteUninstallTag,
      installColumns,
      installData,
      addInstallTag,
      editInstallTag,
      deleteInstallTag,
      submit,
    };
  },
});
