<template>
  <div>
    <sdPageHeader
      title="權限設定"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '人員' }, { breadcrumbName: '權限設定' }]"
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
          <div style="margin-bottom: 12px; color: #8c8c8c">
            主分類已預設展開，可直接勾選子功能，例如「系統-電力卸載」。
          </div>
          <a-table
            :columns="permissionColumns"
            :data-source="permissionTable"
            :pagination="false"
            :rowKey="(record) => record.id"
            :expandedRowKeys="expandedRowKeys"
            :childrenColumnName="'sub'"
            @expand="expandRow"
          >
            <template #bodyCell="{ text, record, column }">
              <p v-if="column.key === 'name'">{{ text }}</p>
              <a-checkbox
                v-if="column.key === 'view' && hasOption(record.id, 'r')"
                :checked="record.view"
                @change="changeCheckbox($event, { id: record.id, value: 'r' })"
              ></a-checkbox>
              <a-checkbox
                v-if="column.key === 'add' && hasOption(record.id, 'c')"
                :checked="record.add"
                @change="changeCheckbox($event, { id: record.id, value: 'c' })"
              ></a-checkbox>
              <a-checkbox
                v-if="column.key === 'edit' && hasOption(record.id, 'u')"
                :checked="record.edit"
                @change="changeCheckbox($event, { id: record.id, value: 'u' })"
              ></a-checkbox>
              <a-checkbox
                v-if="column.key === 'delete' && hasOption(record.id, 'd')"
                :checked="record.delete"
                @change="changeCheckbox($event, { id: record.id, value: 'd' })"
              ></a-checkbox>
            </template>
          </a-table>

          <a-row :gutter="[10, 10]" justify="center" style="margin-top: 1rem">
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
