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
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="群組設定">
            <a-form-item label="群組名稱" name="name">
              <a-input
                v-model:value="formState.name"
                name="name"
                placeholder="名稱"
              >
              </a-input>
            </a-form-item>
            <a-form-item :auto-link="true" label="群組分類" name="class">
              <a-tree-select
                v-model:value="formState.class"
                style="width: 100%"
                :tree-data="groupClassOptions"
                tree-checkable
                allow-clear
                :field-names="{
                  children: 'ChildList',
                  label: 'Name',
                  value: 'Id',
                }"
                placeholder="請選擇"
                tree-node-filter-prop="label"
              />
            </a-form-item>
            <a-form-item label="說明" name="description">
              <a-input v-model:value="formState.description" placeholder="說明">
              </a-input>
            </a-form-item>

            <a-form-item :auto-link="false" label="地區" name="region">
              <a-tree-select
                v-model:value="formState.region"
                style="width: 100%"
                :tree-data="locations"
                allow-clear
                :field-names="{
                  children: 'ChildList',
                  label: 'Name',
                  value: 'Id',
                }"
                placeholder="請選擇"
                tree-node-filter-prop="label"
              />
            </a-form-item>
          </a-tab-pane>
          <a-tab-pane key="2" tab="內容設定">
            <a-form-item label="測點">
              <TagFilter :selectedTags="formState.tags" @setTags="setTags" />
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <a-row justify="center">
          <a-space>
            <sdButton
              class="act-btn"
              type="primary"
              html-type="submit"
              :disabled="loading"
            >
              儲存
              <a-spin v-show="loading" size="small" />
            </sdButton>
            <sdButton class="act-btn" type="light" @click.prevent="closeModal">
              取消
            </sdButton>
          </a-space>
        </a-row>
      </a-form>
    </sdModal>

    <Search>
      <a-collapse v-model:activeKey="collapseKey">
        <a-collapse-panel key="1" header="條件篩選">
          <a-space direction="vertical" size="middle">
            選擇地區:
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
              placeholder="請選擇"
              tree-node-filter-prop="label"
            />

            群組分類:
            <a-tree-select
              v-model:value="filterFormState.groupClass"
              style="width: 300px"
              :tree-data="groupClassOptions"
              allow-clear
              :field-names="{
                children: 'ChildList',
                label: 'Name',
                value: 'Id',
              }"
              placeholder="請選擇"
              tree-node-filter-prop="label"
            />
          </a-space>
        </a-collapse-panel>
      </a-collapse>
    </Search>

    <DataTables
      :filterOption="true"
      :filterOnchange="true"
      :tableData="tableData"
      :columns="columns"
      :rowSelection="false"
      :addOption="permission.create"
      :handleAdd="openAddModal"
      :handleDataSearch="search"
    />
  </div>
</template>
<script src="./main.js"></script>
