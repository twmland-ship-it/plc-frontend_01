<template>
  <sdModal :title="title" :visible="visible" @cancel="handleClose">
    <a-tabs v-model:activeKey="activeTab">
      <a-tab-pane key="1" tab="基礎設定" :forceRender="true">
        <a-form ref="form" :model="formState" labelAlign="left" :rules="rules">
          <a-row :gutter="10">
            <a-col :span="24">
              <a-form-item
                :labelCol="{ sm: 4 }"
                :wrapperCol="{ sm: 20 }"
                :autoLink="false"
                label="程序名稱"
                name="name"
              >
                <a-input v-model:value="formState.name" />
              </a-form-item>
            </a-col>

            <a-col :span="12">
              <a-form-item
                :labelCol="{ sm: 8 }"
                :wrapperCol="{ sm: 16 }"
                label="偵測測點"
                name="detectTagId"
              >
                <TagFilter
                  :multiple="false"
                  :value="formState.detectTagId"
                  @setSingleTag="setTag"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="卸載設定" :forceRender="true">
        <SettingForm
          :dataSource="uninstallData"
          :columns="uninstallColumns"
          @addTag="addUninstallTag"
          @changeData="editUninstallTag"
          @deleteTag="deleteUninstallTag"
        />
      </a-tab-pane>
      <a-tab-pane key="3" tab="加載設定" :forceRender="true">
        <SettingForm
          :dataSource="installData"
          :columns="installColumns"
          @addTag="addInstallTag"
          @changeData="editInstallTag"
          @deleteTag="deleteInstallTag"
        />
      </a-tab-pane>
    </a-tabs>
    <a-row :gutter="10" justify="center">
      <a-col>
        <a-button type="primary" ghost style="height: 40px" @click="handleClose"
          >取消</a-button
        >
      </a-col>
      <a-col>
        <a-button
          type="primary"
          style="height: 40px"
          :disabled="loading"
          @click="submit"
        >
          儲存 <a-spin v-show="loading" size="small"
        /></a-button>
      </a-col>
    </a-row>
  </sdModal>
</template>
<script src="./main.js"></script>
