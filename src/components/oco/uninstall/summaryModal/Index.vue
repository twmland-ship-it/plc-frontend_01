<template>
  <sdModal
    v-if="visible"
    :title="summary?.Id ? '編輯卸載區域' : '新增卸載區域'"
    :visible="visible"
    :maskClosable="false"
    :onCancel="handleClose"
    :confirmLoading="loading"
    :width="520"
  >
    <a-form :model="formState" :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left" ref="formRef">
      <a-form-item label="名稱" name="Name" :rules="[{ required: true, message: '請輸入名稱' }]">
        <a-input v-model:value="formState.Name" placeholder="請輸入卸載區域名稱" />
      </a-form-item>
      <a-form-item label="模式代碼" name="Mode" :rules="[{ required: true, message: '請輸入模式代碼' }]">
        <a-input-number v-model:value="formState.Mode" :min="0" style="width: 100%" placeholder="請輸入 Mode（數字）" />
      </a-form-item>
      <a-form-item label="確認秒數" name="ContinuedSecond" :rules="[{ required: true, message: '請輸入確認秒數' }]">
        <a-input-number v-model:value="formState.ContinuedSecond" :min="0" style="width: 100%" placeholder="請輸入 0 或正整數" />
      </a-form-item>
      <a-form-item label="是否加載" name="IsLoad" :rules="[{ required: true, message: '請設定是否加載' }]">
        <a-switch v-model:checked="formState.IsLoad" checked-children="加載" un-checked-children="不加載" />
      </a-form-item>
      <a-form-item label="卸載需量(kW)" name="ContractCapacity" :rules="[{ required: true, message: '請輸入卸載需量' }]">
        <a-input-number v-model:value="formState.ContractCapacity" :min="1" style="width: 100%" placeholder="請輸入大於 0 的數值" />
      </a-form-item>
    </a-form>

    <a-form :wrapper-col="{ span: 24 }">
      <a-form-item :wrapper-col="{ span: 24 }">
        <a-space>
          <a-button @click="handleClose">取消</a-button>
          <a-button type="primary" :loading="loading" @click="submit">儲存</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </sdModal>
</template>
<script src="./main.js"></script>
