<template>
  <div style="padding: 20px;">
    <h2>Email設定測試頁面</h2>
    <div style="max-width: 600px;">
      <NotifyEmail />
    </div>
  </div>
</template>

<script>
import { defineComponent, onMounted } from "vue";
import { useStore } from "vuex";
import NotifyEmail from "./oco/notify/setting/email/Index.vue";

export default defineComponent({
  name: "TestEmailSetting",
  components: {
    NotifyEmail,
  },
  setup() {
    const { dispatch } = useStore();
    
    onMounted(async () => {
      try {
        await dispatch("notify/getSMTPSetting");
      } catch (err) {
        console.error("載入SMTP設定失敗:", err);
      }
    });

    return {};
  },
});
</script>
