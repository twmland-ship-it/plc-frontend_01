<template>
  <div>
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
          <a-input v-model:value="formState.name" placeholder="名稱"> </a-input>
        </a-form-item>
        <a-form-item label="說明" name="description">
          <a-input v-model:value="formState.description" placeholder="說明">
          </a-input>
        </a-form-item>

        <a-form-item label="地區" name="region">
          <a-tree-select
            v-model:value="formState.region"
            :tree-data="locations"
            allow-clear
            :field-names="{
              children: 'ChildList',
              label: 'Name',
              value: 'Id',
            }"
            :show-checked-strategy="SHOW_PARENT"
            placeholder="請選擇"
            tree-node-filter-prop="label"
          />
        </a-form-item>
        <a-form-item label="串流網址" name="streamUri">
          <a-input v-model:value="formState.streamUri"> </a-input>
        </a-form-item>
        <a-form-item label="使用者帳號" name="username">
          <a-input v-model:value="formState.username"> </a-input>
        </a-form-item>
        <a-form-item label="使用者密碼" name="password">
          <a-input v-model:value="formState.password"> </a-input>
        </a-form-item>

        <a-form-item label="製造商" name="manufacturer">
          <a-input v-model:value="formState.manufacturer"> </a-input>
        </a-form-item>
        <a-form-item label="型號" name="model">
          <a-input v-model:value="formState.model"> </a-input>
        </a-form-item>

        <a-row align="center" justify="center" :gutter="10">
          <a-col>
            <sdButton
              class="act-btn"
              type="primary"
              html-type="submit"
              :disabled="loading"
            >
              儲存
              <a-spin v-show="loading" size="small" />
            </sdButton>
          </a-col>
          <a-col>
            <sdButton
              class="act-btn"
              html-type="submit"
              type="light"
              @click.prevent="closeModal"
            >
              取消
            </sdButton>
          </a-col>
        </a-row>
      </a-form>
    </sdModal>
    <sdModal
      v-if="CCTVModal"
      :title="`${currCCTVName}`"
      :visible="CCTVModal"
      :onCancel="closeCCTVModal"
    >
      <cctvStream :cctv="currCCTV"></cctvStream>
    </sdModal>
    <sdPageHeader
      title="CCTV"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '系統' }, { breadcrumbName: 'CCTV' }]"
    ></sdPageHeader>
    <Main>
      <sdCards title="條件篩選">
        <p>地區:</p>
        <a-tree-select
          v-model:value="filterFormState.region"
          style="width: 300px"
          :tree-data="locations"
          allow-clear
          :field-names="{
            children: 'ChildList',
            label: 'Name',
            value: 'Id',
          }"
          :show-checked-strategy="SHOW_PARENT"
          placeholder="請選擇"
          tree-node-filter-prop="label"
        />
      </sdCards>
      <sdCards>
        <a-spin v-if="loading"></a-spin>
        <DataTables
          v-if="init"
          :filterOption="true"
          :filterOnchange="true"
          :tableData="tableData"
          :columns="columns"
          :rowSelection="false"
          :addOption="permission.create"
          :importOption="permission.create"
          :handleImport="importCCTV"
          :handleDataSearch="search"
          :handleAdd="openAddModal"
        />
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
