<template>
  <div>
    <sdPageHeader
      title="人員清單"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '人員' }, { breadcrumbName: '人員清單' }]"
    ></sdPageHeader>
    <Main>
      <sdModal
        v-if="modal"
        :title="formState.title"
        :visible="modal"
        :onCancel="closeModal"
      >
        <a-form
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
          labelAlign="left"
          @finish="submitForm"
        >
          <a-form-item label="名稱" name="name">
            <a-input v-model:value="formState.name" placeholder="請輸入名稱" />
          </a-form-item>
          <a-form-item label="Email" name="email">
            <a-input v-model:value="formState.email" placeholder="請輸入 Email" type="email" />
          </a-form-item>
          <a-form-item label="權限" name="permission">
            <a-select
              v-model:value="formState.permission"
              :placeholder="permissionOptions.length === 0 ? '載入權限選項中...' : '請選擇權限'"
              :loading="permissionOptions.length === 0"
            >
              <a-select-option
                v-for="v in permissionOptions"
                :key="v.id"
                :value="v.id"
              >
                {{ v.name }}
              </a-select-option>
              <a-select-option
                v-if="permissionOptions.length === 0"
                value=""
                disabled
              >
                無可用權限選項
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="密碼" name="password">
            <a-input-password
              v-model:value="formState.password"
              :placeholder="formState.id ? '留空則不修改密碼' : '請輸入密碼'"
              autocomplete="new-password"
            />
          </a-form-item>

          <a-row :gutter="[10, 10]" justify="center">
            <a-col>
              <a-button
                type="primary"
                ghost
                style="height: 40px"
                @click.prevent="closeModal"
                >取消</a-button
              >
            </a-col>

            <a-col>
              <a-button
                v-permission:disable="formState.id ? 'update' : 'create'"
                html-type="submit"
                type="primary"
                style="height: 40px"
                :disabled="loading"
                >儲存<a-spin v-if="loading" size="small"
              /></a-button>
            </a-col>
          </a-row>
        </a-form>
      </sdModal>
      <sdCards>
        <a-spin v-if="loading" />
        <DataTables
          v-if="!loading"
          :filterOption="true"
          :filterOnchange="true"
          :tableData="tableData"
          :columns="columns"
          :rowSelection="false"
          :addOption="permission.create"
          :editOption="permission.update"
          :deleteOption="permission.delete"
          :exportOption="permission.read"
          :handleAdd="openAddModal"
          :handleDataSearch="search"
        />
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
