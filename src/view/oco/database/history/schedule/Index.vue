<template>
  <div>
    <sdModal
      v-if="modal"
      title="設定排程"
      :visible="modal"
      :onCancel="closeModal"
    >
      <a-form>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="基礎設定" :forceRender="true">
            <BasicSetting
              :endTimeOptions="endTimeOptions"
              :repeatOptions="repeatOptions"
              :formState="formState"
              :rules="rules"
              @update="updateBasicForm"
            ></BasicSetting>
          </a-tab-pane>
          <a-tab-pane key="2" tab="查詢設定" :forceRender="true">
            <sdCards>
              <HistoryFilter
                :formState="searchFormState"
                :usePeriod="true"
                @update="updateSearchForm"
              />
            </sdCards>
          </a-tab-pane>
        </a-tabs>
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
              :disabled="submitingForm"
              @click.prevent="submitForm"
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
        :handleAdd="openAddModal"
        :handleDataSearch="search"
      />
    </sdCards>
  </div>
</template>
<script src="./main.js"></script>
