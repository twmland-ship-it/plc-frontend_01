<template>
  <div>
    <a-card title="假日列表" :bordered="false">
      <div class="action-buttons">
        <a-space>
          <span>年份：</span>
          <a-select v-model:value="selectedYear" style="width: 120px" @change="handleYearChange" placeholder="請選擇年份">
            <a-select-option v-for="year in years" :key="year" :value="year">
              {{ year }}
            </a-select-option>
          </a-select>
          <a-button type="primary" @click="handleExport">匯出</a-button>
          <a-upload
            name="file"
            :before-upload="handleBeforeUpload"
            :show-upload-list="false"
            @change="handleImportChange"
            :customRequest="() => {}"
          >
            <a-button type="primary">
              <import-outlined />
              匯入
            </a-button>
          </a-upload>
        </a-space>
      </div>
      <a-table :columns="columns" :data-source="holidays" :loading="loading" row-key="date" />
    </a-card>
  </div>
</template>

<script src="./main.js"></script>

<style scoped>
.action-buttons {
  margin-bottom: 16px;
}
</style> 