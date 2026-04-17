<template>
  <a-spin v-if="loading" />
  <sdModal
    v-if="modal"
    :title="settings.title"
    :visible="modal"
    :onCancel="closeModal"
  >
    <a-form
      :model="settings"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      labelAlign="left"
      :rules="rules"
      @finish="saveSetting"
    >
      <a-form-item label="電表名稱" name="name">
        <a-input v-model:value="settings.name" ref="autofocus" />
      </a-form-item>
      <a-form-item label="契約" name="contract">
        <a-select v-model:value="settings.contract" :options="contractOptions">
        </a-select>
      </a-form-item>
      <a-form-item label="地區" name="region">
        <a-select v-model:value="settings.region">
          <a-select-option v-for="v in regionOptions" :key="v.Id" :value="v.Id">
            {{ v.Name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="用電單位" name="unit">
        <a-select v-model:value="settings.unit" :options="unitOptions">
        </a-select>
      </a-form-item>
      <a-form-item label="用電量測點" name="electric">
        <TagFilter
          :multiple="false"
          :value="settings.electric"
          :title="`${settings.name} 選擇測點`"
          @setSingleTag="setElectric"
        ></TagFilter>
      </a-form-item>
      <a-form-item label="功率測點" name="power">
        <TagFilter
          :multiple="false"
          :value="settings.power"
          :title="`${settings.name} 選擇測點`"
          @setSingleTag="setPower"
        ></TagFilter>
      </a-form-item>
      <Notice :content="noticeContent"></Notice>
      <a-row :gutter="[5, 10]" align="center" style="margin-top: 1rem">
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
          <sdButton class="act-btn" type="light" @click="closeModal">
            取消
          </sdButton>
        </a-col>
      </a-row>
    </a-form>
  </sdModal>
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
</template>
<script src="./main.js"></script>
