<template>
  <div>
    <sdModal
      v-if="modal"
      :title="formState.title"
      :visible="modal"
      :onCancel="closeModal"
    >
      <a-row
        v-if="formState.mode === 'create'"
        :gutter="10"
        align="middle"
        style="margin-bottom: 1rem"
      >
        <a-col :span="24" :sm="3" :md="2">年:</a-col>
        <a-col :span="24" :sm="9" :md="5">
          <a-input v-model:value="formState.year" type="number"></a-input>
        </a-col>
        <a-col :span="24" :sm="3" :md="2">月:</a-col>
        <a-col :span="24" :sm="9" :md="5">
          <a-input v-model:value="formState.month" type="number"></a-input>
        </a-col>
      </a-row>
      <a-col :span="24" style="margin-bottom: 1rem">(請填入含稅價格)</a-col>
      <a-row :gutter="10" align="middle">
        <a-col :span="6"> 基本費(依口徑): </a-col>
        <a-col :span="18">
          <a-input v-model:value="formState.basicFee"></a-input>
        </a-col>
      </a-row>
      <a-row :gutter="10" style="margin-top: 1rem">
        <a-col :span="6"> 段別 </a-col>
        <a-col :span="6"> 每度單價 </a-col>
        <a-col :span="6"> 實用度數 </a-col>
        <a-col :span="6"> 累進差額 </a-col>
      </a-row>
      <a-row
        v-for="(v, i) in formState.detail"
        :key="i"
        :gutter="10"
        align="middle"
        style="margin-top: 1rem"
      >
        <a-col :span="6"> 第{{ i + 1 }}段 </a-col>
        <a-col :span="6">
          <a-input v-model:value="v.Fee"></a-input>
        </a-col>
        <a-col :span="6">
          <a-input v-model:value="v.FromDegree"></a-input>
        </a-col>
        <a-col :span="6">
          <a-input v-model:value="v.AccumulatedDifference"></a-input>
        </a-col>
      </a-row>
      <a-button
        type="primary"
        ghost
        style="width: 100%; margin-top: 1rem; height: 45px; margin-bottom: 1rem"
        @click="addLevel"
      >
        新增段別 +
      </a-button>
      <a-row :gutter="[5, 10]" align="center">
        <a-col>
          <sdButton
            class="act-btn"
            type="primary"
            html-type="submit"
            :disabled="loading"
            @click="submit"
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
    </sdModal>
    <DataTables
      v-if="!loading"
      :filterOption="false"
      :filterOnchange="true"
      :tableData="tableData"
      :columns="columns"
      :rowSelection="false"
      :addOption="permission.create"
      :handleAdd="openAddModal"
    />
  </div>
</template>
<script src="./main.js"></script>
