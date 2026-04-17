<template>
  <sdCards title="卸載程序">
    <a-spin v-if="loading"></a-spin>

    <template v-if="!loading && tableData.length === 0">
      <a-empty description="尚未設定卸載區域">
        <template #description>
          <span>尚未設定卸載區域</span>
        </template>
        <a-button type="primary" v-if="permission.create && canManage" @click="add">
          新增卸載區域
        </a-button>
      </a-empty>
    </template>

    <DataTables
      v-else
      :filterOption="true"
      :filterOnchange="true"
      :tableData="tableData"
      :columns="columns"
      :rowSelection="false"
      :addOption="permission.create && canManage"
      :handleDataSearch="search"
      :handleAdd="add"
    />
  </sdCards>
</template>
<script src="./main.js"></script>
