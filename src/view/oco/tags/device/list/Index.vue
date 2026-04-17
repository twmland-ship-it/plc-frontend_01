<template>
  <sdModal
    v-if="compareModal"
    :title="`${compareFormState.name} 選擇測點`"
    :visible="compareModal"
    style="width: 100%"
    :onCancel="closeCompareModal"
  >
    <a-checkbox v-model:checked="showSelected">只顯示勾選</a-checkbox>
    <DataTables
      :filterOption="true"
      :filterOnchange="true"
      :tableData="compareTableData"
      :columns="compareColumns"
      :defaultSelected="compareSelected"
      :handleDataSearch="searchCompareTable"
      @onSelectChange="setTags"
    />
    <a-row :gutter="[5, 20]" align="center" style="margin-top: 1rem">
      <a-col>
        <sdButton
          class="act-btn"
          type="light"
          @click.prevent="closeCompareModal"
        >
          取消
        </sdButton>
      </a-col>
      <a-col>
        <sdButton
          class="act-btn"
          type="primary"
          :disabled="loading"
          @click.prevent="compareSubmit"
        >
          儲存
          <a-spin v-show="loading" size="small" />
        </sdButton>
      </a-col>
    </a-row>
  </sdModal>
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
      <a-form-item label="狀態" name="status">
        <a-radio-group
          v-model:value="formState.status"
          :options="statusOptions"
        />
      </a-form-item>
      <a-form-item label="名稱" name="name">
        <a-input v-model:value="formState.name" placeholder="名稱"> </a-input>
      </a-form-item>
      <a-form-item label="說明" name="description">
        <a-input v-model:value="formState.description" placeholder="說明">
        </a-input>
      </a-form-item>
      <a-form-item :autoLink="false" label="地區" name="regionId">
        <a-tree-select
          v-model:value="formState.regionId"
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
      </a-form-item>
      <a-form-item :autoLink="false" label="裝置分類" name="classId">
        <a-tree-select
          v-model:value="formState.classId"
          style="width: 300px"
          :tree-data="deviceClassOptions"
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

      <a-form-item label="Channel" name="channel">
        <a-select v-model:value="formState.channel">
          <a-select-option
            v-for="channel in channelOptions"
            :value="channel.Id"
            :key="channel.Id"
          >
            {{ channel.Name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        v-for="v in config[checkChannelType]"
        :key="v.value"
        :labelCol="{ sm: 8 }"
        :wrapperCol="{ sm: 16 }"
        :label="v.label"
        :name="v.value"
      >
        <a-select v-if="v.type === 'select'" v-model:value="formState[v.value]">
          <a-select-option v-for="k in v.options" :value="k.Id" :key="k.Id">
            {{ k.Name }}
          </a-select-option>
        </a-select>
        <a-input v-if="v.type === 'input'" v-model:value="formState[v.value]">
        </a-input>
      </a-form-item>
      <a-row :gutter="[0, 20]">
        <a-col
          :lg="{ span: 16, offset: 8 }"
          :md="{ span: 15, offset: 9 }"
          :xs="{ span: 24, offset: 0 }"
        >
          <a-space>
            <sdButton
              class="act-btn"
              type="primary"
              :disabled="loading"
              html-type="submit"
            >
              儲存
              <a-spin v-show="loading" size="small" />
            </sdButton>
            <sdButton class="act-btn" type="light" @click.prevent="closeModal">
              取消
            </sdButton>
          </a-space>
        </a-col>
      </a-row>
    </a-form>
  </sdModal>
  <Search>
    <a-collapse v-model:activeKey="collapseKey">
      <a-collapse-panel key="1" header="條件篩選">
        <a-space direction="vertical" size="middle">
          地區:
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

          裝置分類:
          <a-tree-select
            v-model:value="filterFormState.class"
            style="width: 300px"
            :tree-data="deviceClassOptions"
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

          Channel:
          <a-select
            v-model:value="filterFormState.targetChannel"
            style="width: 150px"
          >
            <a-select-option :value="null">無</a-select-option>
            <a-select-option
              v-for="channel in channelOptions"
              :value="channel.Id"
              :key="channel.Id"
            >
              {{ channel.Name }}
            </a-select-option>
          </a-select>
        </a-space>
      </a-collapse-panel>
    </a-collapse>
  </Search>
  <sdCards>
    <a-spin v-if="loading"></a-spin>
    <DataTables
      :filterOption="true"
      :filterOnchange="true"
      :tableData="data"
      :columns="columns"
      :rowSelection="false"
      :addOption="permission.create"
      :handleDataSearch="search"
      :handleAdd="openAddModal"
    />
  </sdCards>
</template>
<script src="./main.js"></script>
