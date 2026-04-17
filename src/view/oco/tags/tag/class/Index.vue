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
          <a-form-item label="分類名稱" name="name">
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
                  html-type="button"
                  @click.stop="closeModal"
                >
                  取消
                </sdButton>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </ModalWrap>
    </sdModal>

    <sdCards title="分類列表">
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
        :handleBack="goBack"
        :handleAdd="openAddModal"
        :handleDataSearch="search"
        :backTitle="backTitle"
      />
    </sdCards>
  </div>
</template>
<script src="./main.js"></script>
