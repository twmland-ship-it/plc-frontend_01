<template>
  <sdModal
    v-if="visible"
    :title="title || '即時需量測點'"
    :visible="visible"
    :maskClosable="false"
    :onCancel="handleClose"
    :confirmLoading="loading"
    :width="900"
  >
    <a-space direction="vertical" style="width:100%">
      <!-- 兩欄式：左側已選、右側候選 -->
      <a-row :gutter="16">
        <a-col :span="12">
          <div style="font-weight:600; margin-bottom:6px">
            已選定測點（{{ pickedTags.length }}）
          </div>
          <div style="border:1px solid #eee; border-radius:4px; min-height:220px; max-height:300px; overflow:auto; padding:8px">
            <div v-if="pickedTags.length === 0" style="color:#aaa">尚未選擇任何測點</div>
            <div v-for="t in pickedTags" :key="t.id" class="selected-item" style="display:flex; align-items:center; justify-content:space-between; padding:4px 6px; border:1px solid #f0f0f0; border-radius:4px; margin-bottom:6px">
              <span>{{ t.name }}</span>
              <a-button type="link" danger size="small" @click="removeTag(t.id)">移除</a-button>
            </div>
          </div>
        </a-col>
        <a-col :span="12">
          <div style="font-weight:600; margin-bottom:6px">候選測點清單</div>
          <div style="border:1px solid #eee; border-radius:4px; min-height:220px; max-height:300px; overflow:auto; padding:8px">
            <a-spin v-if="!allTags || allTags.length===0"></a-spin>
            <div v-for="opt in candidateTags" :key="opt.id"
                 :style="{opacity: opt.disabled?0.45:1, cursor: opt.disabled?'not-allowed':'pointer', padding:'4px 6px', border:'1px solid #f0f0f0', borderRadius:'4px', marginBottom:'6px'}"
                 @click="!opt.disabled && addTag(opt)">
              {{ opt.name }}<span v-if="opt.disabled" style="color:#fa8c16">（僅接受 kW/mW）</span>
            </div>
          </div>
          <div style="margin-top:6px; color:#999; font-size:12px">僅 kW / mW 會被接受，其他單位將被自動忽略。</div>
        </a-col>
      </a-row>
    </a-space>

    <a-form :wrapper-col="{ span: 24 }">
      <a-form-item :wrapper-col="{ span: 24 }">
        <a-space>
          <a-button @click="handleClose">取消</a-button>
          <a-button @click="reset">重設</a-button>
          <a-button type="primary" :loading="submitting" @click="submit">確定</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </sdModal>
</template>
<script src="./main.js"></script>

