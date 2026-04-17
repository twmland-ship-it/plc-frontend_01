<template>
  <div>
    <sdPageHeader
      title="發送通知"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '通知' }, { breadcrumbName: '發送通知' }]"
    ></sdPageHeader>
    <Main>
      <sdModal
        v-if="modal"
        title="發送訊息"
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
          <a-form-item label="訊息內容" name="content">
            <a-textarea
              v-model:value="formState.content"
              placeholder="訊息內容"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-form-item>
          <a-form-item label="發送群組" name="groups">
            <a-select
              v-model:value="formState.groups"
              mode="multiple"
              optionFilterProp="label"
            >
              <a-select-option
                v-for="v in groupOptions"
                :key="v.id"
                :label="v.name"
                :value="v.id"
              >
                {{ v.name }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-row :gutter="[10, 10]" justify="center">
            <a-col>
              <a-button
                html-type="submit"
                type="primary"
                style="height: 40px"
                :disabled="loading"
                >發送<a-spin v-if="loading" size="small"
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
      <sdCards title="發送紀錄">
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
