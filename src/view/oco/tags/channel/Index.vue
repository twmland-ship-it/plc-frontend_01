<template>
  <div>
    <sdModal
      v-if="modal"
      :title="formState.title"
      :visible="modal"
      :onCancel="closeModal"
    >
      <ModalWrap>
        <a-form
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          :rules="rules"
          labelAlign="left"
          @finish="submit"
        >
          <a-form-item label="狀態" name="status">
            <a-radio-group
              v-model:value="formState.status"
              :options="statusOptions"
            />
          </a-form-item>
          <a-form-item label="Channel名稱" name="name">
            <a-input v-model:value="formState.name" placeholder="名稱">
            </a-input>
          </a-form-item>
          <a-form-item label="Channel Driver" name="type">
            <a-select ref="select" v-model:value="formState.type">
              <a-select-option
                v-for="v in typeOptions"
                :key="v.Code"
                :value="v.Code"
                >{{ v.Name }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="資料獲取方式" name="data">
            <a-select ref="select" v-model:value="formState.data">
              <a-select-option
                v-for="v in dataOptions"
                :key="v.Code"
                :value="v.Code"
                >{{ v.Name }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="說明" name="description">
            <a-input v-model:value="formState.description" placeholder="說明">
            </a-input>
          </a-form-item>
          <a-row>
            <a-col
              :lg="{ span: 16, offset: 8 }"
              :md="{ span: 15, offset: 9 }"
              :xs="{ span: 24, offset: 0 }"
            >
              <div>
                <sdButton
                  class="act-btn"
                  type="primary"
                  html-type="submit"
                  :disabled="loading"
                >
                  儲存
                  <a-spin v-show="loading" size="small" />
                </sdButton>
                <sdButton
                  class="act-btn"
                  type="light"
                  @click.prevent="closeModal"
                >
                  取消
                </sdButton>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </ModalWrap>
    </sdModal>
    <sdPageHeader
      title="通道"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '測點' }, { breadcrumbName: '通道' }]"
    ></sdPageHeader>
    <Main>
      <sdCards title="通道列表">
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
