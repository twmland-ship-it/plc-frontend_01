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
          <a-form-item label="名稱" name="name">
            <a-input v-model:value="formState.name" placeholder="名稱">
            </a-input>
          </a-form-item>
          <a-row>
            <a-col
              :lg="{ span: 16, offset: 8 }"
              :md="{ span: 15, offset: 9 }"
              :xs="{ span: 24, offset: 0 }"
            >
              <div>
                <sdButton class="act-btn" type="primary" html-type="submit">
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
      title="地區"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '測點' }, { breadcrumbName: '地區' }]"
    ></sdPageHeader>
    <Main>
      <sdCards title="地區列表">
        <a-spin v-if="loading" />
        <DataTables
          v-if="!loading"
          :filterOption="true"
          :filterOnchange="true"
          :tableData="tableData"
          :columns="columns"
          :rowSelection="false"
          :addOption="permission.create"
          :backOption="isChild"
          :handleAdd="openAddModal"
          :handleDataSearch="search"
          :handleBack="goBack"
          :backTitle="backTitle"
        />
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
