<template>
  <div>
    <sdModal
      v-if="modal"
      title="設定假日"
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
        <a-form-item label="季節/區間名稱" name="name">
          <a-input v-model:value="formState.name" placeholder="請輸入名稱" />
        </a-form-item>
        <a-form-item label="日期區間" name="period">
          <a-range-picker
            v-model:value="formState.period"
            :format="dateFormat"
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
  </div>
</template>
<script src="./main.js"></script>
