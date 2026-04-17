<template>
  <div>
    <a-row justify="center">
      <a-col :xs="24" :md="12">
        <sdCards title="SMTP Server 設定">
          <a-form
            :model="formState"
            labelAlign="left"
            :rules="rules"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
            @finish="submit"
          >
            <a-form-item label="網域名稱" name="address">
              <a-input v-model:value="formState.address" placeholder="例如: smtp.gmail.com" />
            </a-form-item>
            <a-form-item label="通信埠" name="port">
              <a-input v-model:value="formState.port" placeholder="例如: 587" />
            </a-form-item>
            <a-form-item label="送件者電子郵件信箱" name="username">
              <a-input v-model:value="formState.username" placeholder="例如: sender@example.com" />
            </a-form-item>
            <a-form-item label="送件者電子郵件密碼" name="password">
              <a-input-password v-model:value="formState.password" placeholder="請輸入密碼" />
            </a-form-item>
            <a-form-item label="通訊協定" name="protocol">
              <a-select
                v-model:value="formState.protocol"
                placeholder="請選擇通訊協定"
                :show-search="false"
              >
                <a-select-option
                  v-for="protocol in protocolOptions"
                  :key="protocol.Id"
                  :value="protocol.Id"
                  :label="protocol.Name"
                >
                  {{ protocol.Name }}
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-row justify="end">
              <a-button
                v-if="permission.update"
                type="primary"
                html-type="submit"
                style="height: 45px"
              >
                儲存
              </a-button>
            </a-row>
          </a-form>
        </sdCards>
      </a-col>
    </a-row>
  </div>
</template>
<script src="./main.js"></script>
