<template>
  <div>
    <sdModal title="刪除程序" :visible="visible" @cancel="handleClose">
      <a-space direction="vertical" style="width: 100%">
        <div>{{ `請輸入 "${processName}" :` }}</div>
        <a-input v-model:value="inputName" :placeholder="processName" />
        <a-row :gutter="[5, 5]" justify="end">
          <a-col>
            <a-button
              style="height: 40px"
              type="primary"
              ghost
              @click="handleClose"
              >取消
            </a-button>
          </a-col>
          <a-col>
            <a-button
              style="height: 40px"
              :disabled="inputName !== processName || loading"
              type="primary"
              danger
              @click="handleOk"
              >刪除程序
              <a-spin v-show="loading" size="small" />
            </a-button>
          </a-col>
        </a-row>
      </a-space>
    </sdModal>
  </div>
</template>
<script src="./main.js"></script>
