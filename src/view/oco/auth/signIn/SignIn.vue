<template>
  <a-row justify="center">
    <a-col :xxl="6" :xl="12" :md="12" :sm="18">
      <AuthWrapper>
        <div class="ninjadash-authentication-top">
          <h2 class="ninjadash-authentication-top__title" @dblclick="showBuildInfo">登入系統</h2>
        </div>
        <div class="ninjadash-authentication-content">
          <a-form @finish="handleSubmit" :model="formState" layout="vertical">
            <a-form-item name="username" label="帳號">
              <a-input type="text" v-model:value="formState.acc" />
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
<script src="./index.js"></script>
