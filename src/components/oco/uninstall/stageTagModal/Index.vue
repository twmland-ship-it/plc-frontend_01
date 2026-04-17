<template>
  <sdModal
    v-if="visible"
    :title="title || '階段設備與值設定'"
    :visible="visible"
    :maskClosable="false"
    :onCancel="handleClose"
    :confirmLoading="loading"
    :width="1100"
  >
    <a-space direction="vertical" style="width:100%">
      <a-form layout="horizontal" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="階段">
          <div style="padding-top:4px">{{ stageLabel }}</div>
        </a-form-item>

        <a-form-item label="自動帶入 LoadValue">
          <a-switch v-model:checked="autoCompute" />
        </a-form-item>

        <!-- 兩欄式：左已選（含輸入欄位），右候選清單 -->
        <a-form-item :wrapper-col="{ span: 24 }">
          <a-row :gutter="16">
            <!-- 左：已選設備與值 -->
            <a-col :span="13">
              <div style="font-weight:600; margin-bottom:6px">已選定測點（{{ rows.length }}）</div>
              <div style="border:1px solid #eee; border-radius:4px; min-height:240px; max-height:420px; overflow:auto; padding:8px">
                <div v-if="rows.length === 0" style="color:#aaa">尚未選擇任何測點</div>
                <div v-for="r in rows" :key="r._k" style="border:1px solid #f0f0f0; border-radius:4px; padding:8px; margin-bottom:8px">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px">
                    <div style="font-weight:500; white-space:normal; word-break:break-word;" :title="r.tagName || ('TagId: ' + r.TagId)">{{ r.tagName || ('TagId: ' + r.TagId) }}</div>
                    <a-button type="link" danger size="small" @click="removeRow(r._k)">移除</a-button>
                  </div>
                  <a-row :gutter="8">
                    <a-col :span="8">
                      <div style="color:#888; font-size:12px">UnloadValue</div>
                      <a-input-number v-model:value="r.UnloadValue" style="width:100%" @change="() => onUnloadChange(r)" />
                    </a-col>
                    <a-col :span="8">
                      <div style="color:#888; font-size:12px">LoadValue</div>
                      <a-input-number v-model:value="r.LoadValue" style="width:100%" />
                    </a-col>
                    <a-col :span="8">
                      <div style="color:#888; font-size:12px">IntervalSecondsForLoad</div>
                      <a-input-number v-model:value="r.IntervalSecondsForLoad" :min="0" style="width:100%" />
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-col>

            <!-- 右：候選測點清單 -->
            <a-col :span="11">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px">
                <div style="font-weight:600">候選測點清單</div>
                <a-input-search v-model:value="searchText" allowClear size="small" style="width: 220px" placeholder="搜尋名稱/描述" />
              </div>
              <div style="border:1px solid #eee; border-radius:4px; min-height:240px; max-height:420px; overflow:auto; padding:8px">
                <a-spin v-if="!displayedCandidateTags || displayedCandidateTags.length===0"></a-spin>
                <div v-for="opt in displayedCandidateTags" :key="opt.id"
                     :title="opt.name"
                     :style="{cursor:'pointer', padding:'4px 6px', border:'1px solid #f0f0f0', borderRadius:'4px', marginBottom:'6px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}"
                     @click="addCandidate(opt)">
                  {{ opt.name }}
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item :wrapper-col="{ span: 24 }">
          <a-space>
            <a-button @click="handleClose">取消</a-button>
            <a-button @click="reset">重設</a-button>
            <a-button type="primary" :loading="submitting" @click="submit">確定</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-space>
  </sdModal>
</template>
<script src="./main.js"></script>

