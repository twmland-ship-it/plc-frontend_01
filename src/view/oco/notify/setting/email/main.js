import { defineComponent, reactive, toRaw, computed, watch } from "vue";
import { useStore } from "vuex";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
export default defineComponent({
  props: {
    setting: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();

    const labelCol = {
      lg: 6,
      md: 9,
      xs: 24,
    };

    const wrapperCol = {
      lg: 18,
      md: 15,
      xs: 24,
    };
    const protocolOptions = computed(() => {
      console.log("protocolList:", state.notify.protocolList); // 除錯用
      return state.notify.protocolList;
    });

    const formState = reactive({
      address: "",
      port: "",
      username: "",
      password: "",
      protocol: "",
    });

    // 監聽SMTP設定變化，當API載入完成後自動更新表單
    watch(
      () => state.notify.SMTPSetting,
      (newSetting) => {
        if (newSetting && Object.keys(newSetting).length > 0) {
          const { smtpAddress, smptPort, username, password, protocol } = newSetting;
          Object.assign(formState, {
            address: smtpAddress || "",
            port: smptPort || "",
            username: username || "",
            password: password || "",
            protocol: protocol !== undefined ? protocol : "", // 保持原始值（數字）
          });
          console.log("更新表單資料:", formState); // 除錯用
          console.log("protocol值:", protocol, "類型:", typeof protocol); // 除錯用
        }
      },
      { immediate: true, deep: true }
    );

    const rules = {
      address: [{ required: true, trigger: "blur", message: "請輸入網域名稱" }],
      port: [
        { required: true, trigger: "blur", message: "請輸入通信埠" },
        { pattern: /^\d+$/, trigger: "blur", message: "通信埠必須為數字" }
      ],
      username: [
        { required: true, trigger: "blur", message: "請輸入送件者電子郵件信箱" },
        { type: "email", trigger: "blur", message: "請輸入有效的電子郵件格式" }
      ],
      password: [
        { required: true, trigger: "blur", message: "請輸入送件者電子郵件密碼" },
      ],
      protocol: [
        { required: true, trigger: "change", message: "請選擇通訊協定" },
      ],
    };

    const submit = async () => {
      try {
        console.log("開始提交表單:", toRaw(formState)); // 除錯用
        await dispatch("notify/editSMTPSetting", toRaw(formState));
        notification.success({
          message: "修改成功",
        });
      } catch (err) {
        console.error("提交表單錯誤:", err); // 除錯用
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };
    return { permission, labelCol, wrapperCol, formState, rules, submit, protocolOptions };
  },
});
