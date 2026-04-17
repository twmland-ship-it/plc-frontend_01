<template>
  <a-spin v-if="loading" />
  <sdModal
    v-if="modal"
    :title="settings.title"
    :visible="modal"
    :onCancel="closeModal"
  >
    <a-form
      :model="settings"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
      labelAlign="left"
      @finish="saveSetting"
    >
      <a-form-item label="BTU名稱" name="name">
        <a-input v-model:value="settings.name"> </a-input>
      </a-form-item>

      <a-form-item label="地區" name="region">
        <a-select v-model:value="settings.region">
          <a-select-option v-for="v in regionOptions" :key="v.Id" :value="v.Id">
            {{ v.Name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="用電單位" name="unit">
        <a-select v-model:value="settings.unit" :options="unitOptions">
        </a-select>
      </a-form-item>
      <a-form-item label="用電量測點" name="usage">
        <TagFilter
          :multiple="false"
          :value="settings.usage"
          @setSingleTag="setUsage"
        ></TagFilter>
      </a-form-item>
      <Notice :content="noticeContent"></Notice>
      <a-row :gutter="[5, 10]" align="center" style="margin-top: 1rem">
        <a-col>
          <sdButton
            class="act-btn"
            type="primary"
            htmlType="submit"
            :disabled="loading"
          >
            儲存
            <a-spin v-show="loading" size="small" />
          </sdButton>
        </a-col>
        <a-col>
          <sdButton class="act-btn" type="light" @click="closeModal">
            取消
          </sdButton>
        </a-col>
      </a-row>
    </a-form>
  </sdModal>
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
</template>
<script src="./main.js"></script>
