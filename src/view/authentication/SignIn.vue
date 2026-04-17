<template>
  <a-row justify="center">
    <a-col :xxl="6" :xl="12" :md="12" :sm="18">
      <sdModal
        title="Information Modal"
        :color="false"
        type="primary"
        :onOk="handleOk"
        :visible="true"
        :onCancel="handleCancel"
      >
        <p>
          When requiring users to interact with the application, but without
          jumping to a new page and interrupting the user's workflow, you can
          use Modal to create a new floating layer over the current page to get
          user feedback or display information. Additionally
        </p>
      </sdModal>
      <AuthWrapper>
        <div class="ninjadash-authentication-top">
          <h2 class="ninjadash-authentication-top__title">登入系統</h2>
        </div>
        <div class="ninjadash-authentication-content">
          <a-form @finish="handleSubmit" :model="formState" layout="vertical">
            <a-form-item name="username" label="帳號">
              <a-input type="email" v-model:value="formState.acc" />
            </a-form-item>
            <a-form-item name="password" initialValue="123456" label="密碼">
              <a-input
                type="password"
                v-model:value="formState.password"
                placeholder="Password"
              />
            </a-form-item>
            <!-- <div class="ninjadash-auth-extra-links">
              <a-checkbox @change="onChange">Keep me logged in</a-checkbox>
              <router-link class="forgot-pass-link" to="/auth/forgotPassword">
                Forgot password?
              </router-link>
            </div> -->
            <a-form-item>
              <sdButton class="btn-signin" htmlType="submit" type="primary">
                {{ isLoading ? "請稍等..." : "登入" }}
              </sdButton>
            </a-form-item>
          </a-form>
        </div>
      </AuthWrapper>
    </a-col>
  </a-row>
</template>
<script>
import { computed, reactive, ref, defineComponent } from "vue";
import { useStore } from "vuex";
import { AuthWrapper } from "./style";
// import { useRouter } from "vue-router";
import { Auth0Lock } from "auth0-lock";
import { auth0options } from "@/config/auth0";

const domain = process.env.VUE_APP_AUTH0_DOMAIN;
const clientId = process.env.VUE_APP_AUTH0_CLIENT_ID;

const SignIn = defineComponent({
  name: "SignIn",
  components: { AuthWrapper },
  setup() {
    const { state, dispatch } = useStore();
    const isLoading = computed(() => state.auth.loading);
    const checked = ref(null);
    // const router = useRouter();

    const handleSubmit = async () => {
      await dispatch("auth/login", {
        acc: formState.acc,
        pass: formState.password,
      });
      // router.push("/");
    };
    const onChange = (checked) => {
      checked.value = checked;
    };

    const formState = reactive({
      acc: "",
      password: "",
    });

    const lock = new Auth0Lock(clientId, domain, auth0options);

    lock.on("authenticated", (authResult) => {
      lock.getUserInfo(authResult.accessToken, (error) => {
        if (error) {
          return;
        }

        handleSubmit();
        lock.hide();
      });
    });

    return {
      isLoading,
      checked,
      handleSubmit,
      onChange,
      formState,
      lock,
    };
  },
});

export default SignIn;
</script>
