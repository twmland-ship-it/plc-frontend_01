<template>
  <div>
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
        <a-form-item label="服務名稱" name="name">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item label="client_id" name="clientId">
          <a-input v-model:value="formState.clientId" />
        </a-form-item>
        <a-form-item label="client_secret" name="clientSecret">
          <a-input v-model:value="formState.clientSecret" />
        </a-form-item>
        <a-row :gutter="[10, 10]" justify="center">
          <a-col>
            <a-button
              html-type="submit"
              type="primary"
              style="height: 40px"
              :disabled="loading"
              >儲存<a-spin v-if="loading" size="small"
            /></a-button>
          </a-col>
          <a-col>
            <a-button
              type="primary"
              ghost
              style="height: 40px"
              @click.prevent="closeModal"
              >取消</a-button
            >
          </a-col>
        </a-row>
      </a-form>
    </sdModal>
    <sdCards title="服務列表">
      <a-spin v-if="loading" />
      <DataTables
        v-if="!loading"
        :filterOption="true"
        :filterOnchange="true"
        :tableData="tableData"
        :columns="columns"
        :rowSelection="false"
        :addOption="permission.create"
        :handleAdd="openAddModal"
        :handleDataSearch="search"
      />
    </sdCards>
  </div>
</template>
<script src="./main.js"></script>
