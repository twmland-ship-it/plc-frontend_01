<template>
  <div>
    <sdPageHeader
      title="工作排程"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '排程' }, { breadcrumbName: '工作排程' }]"
    ></sdPageHeader>
    <Main>
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
                :seasonOptions="seasonOptions"
                :endTimeOptions="endTimeOptions"
                :repeatOptions="repeatOptions"
                :monthAdditionOptions="monthAdditionOptions"
                :formState="formState"
                :rules="rules"
                @changeRepeat="changeRepeat"
                @changeStartTime="changeStartTime"
              ></BasicSetting>
            </a-tab-pane>
            <a-tab-pane key="2" tab="測點設定" :forceRender="true">
              <TagSetting
                :dataSource="tagSettingData"
                :columns="tagSettingColumns"
                @addTag="addTag"
                @changeData="editTag"
                @deleteTag="deleteTag"
              ></TagSetting>
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
    </Main>
  </div>
</template>
<script src="./main.js"></script>
