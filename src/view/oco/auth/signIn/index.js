import { computed, reactive, ref, defineComponent, watch } from "vue";
import { useStore } from "vuex";
import { AuthWrapper } from "./style";
import { useRoute, useRouter } from "vue-router";
import { Auth0Lock } from "auth0-lock";
import { auth0options } from "@/config/auth0";
import ModalHelper from "@/utility/modalHelper";

const domain = process.env.VUE_APP_AUTH0_DOMAIN;
const clientId = process.env.VUE_APP_AUTH0_CLIENT_ID;

const SignIn = defineComponent({
  name: "SignIn",
  components: { AuthWrapper },
  setup() {
    const { state, dispatch } = useStore();
    const isLoading = computed(() => state.auth.loading);

    const checked = ref(null);
    const router = useRouter();
    const route = useRoute();

    const handleSubmit = async () => {
      try {
        await dispatch("auth/login", formState);
        router.push("/");
      } catch (err) {
        ModalHelper.error({
          title: "登入錯誤",
          content: err.message,
        });
      }
    };
    const onChange = (checked) => {
      checked.value = checked;
    };

    const formState = reactive({
      acc: "",
      password: "",
      id: "",
    });

    watch(
      () => route.params.id,
      (newId) => {
        formState.id = String(newId ?? "").trim();
      },
      { immediate: true }
    );

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
