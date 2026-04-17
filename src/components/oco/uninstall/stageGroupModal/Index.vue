<template>
  <sdModal
    v-if="visible"
    :title="title || '階段管理'"
    :visible="visible"
    :maskClosable="false"
    :onCancel="handleClose"
    :confirmLoading="loading"
    :width="900"
  >
    <div style="margin-bottom: 12px; color: #888">
      新增/編輯/刪除階段。StageCode 限 1/2/3。編輯時 StageCode 唯讀。
    </div>

    <a-space direction="vertical" style="width:100%">
      <a-table :data-source="stageRows" :columns="columns" rowKey="StageId" size="small" />

      <a-divider />

      <!-- 設備與值設定入口 -->
      <div style="display:flex;align-items:center;gap:8px">
        <a-select v-model:value="selectedStageForTag" style="width: 260px" placeholder="選擇階段進行設備與值設定">
          <a-select-option v-for="s in stages" :key="s.StageId" :value="s.StageId">
            {{ s.StageName }} (Code={{ s.StageCode }})
          </a-select-option>
        </a-select>
        <a-button @click="openStageTagClick" :disabled="!selectedStageForTag">設備與值設定</a-button>
      </div>

      <a-divider />

      <a-form layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="動作">
          <a-radio-group v-model:value="form.ModifyMode">
            <a-radio :value="1">新增</a-radio>
            <a-radio :value="3" :disabled="!form.StageId">編輯</a-radio>
            <a-radio :value="4" :disabled="!form.StageId">刪除</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="StageId" v-if="form.ModifyMode !== 1">
          <a-select v-model:value="form.StageId" style="width: 260px" placeholder="選擇要編輯/刪除的階段">
            <a-select-option v-for="s in stages" :key="s.StageId" :value="s.StageId">
              {{ s.StageName }} (Code={{ s.StageCode }})
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="StageCode">
          <a-select v-model:value="form.StageCode" style="width: 160px" :disabled="form.ModifyMode !== 1">
            <a-select-option :value="1">1</a-select-option>
            <a-select-option :value="2">2</a-select-option>
            <a-select-option :value="3">3</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="StageName">
          <a-input v-model:value="form.StageName" style="width: 280px" />
        </a-form-item>

        <a-form-item label="UnloadULmt (kW)">
          <a-input v-model:value="form.UnloadULmt" style="width: 180px" :disabled="true" placeholder="由契約容量%換算顯示" />
        </a-form-item>

        <a-form-item label="LoadLLmt (kW)">
          <a-input-number v-model:value="form.LoadLLmt" :min="0" :step="1" style="width: 180px" />
        </a-form-item>

        <a-form-item label="UnloadAlarmTagId">
          <a-input-number v-model:value="form.UnloadAlarmTagId" :min="0" style="width: 220px" />
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 24 }">
          <a-space>
            <a-button @click="handleClose">取消</a-button>
            <a-button type="primary" :loading="submitting" @click="submit">送出</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-space>
  </sdModal>
</template>
<script src="./main.js"></script>

