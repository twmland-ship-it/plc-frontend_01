<template>
  <div>
    <h3>整合報表產生</h3>
    <a-form layout="inline">
      <a-form-item label="開始日期">
        <a-date-picker 
          v-model:value="startDate" 
          format="YYYY-MM-DD" 
          placeholder="請選擇開始日期"
        />
      </a-form-item>
      <a-form-item label="結束日期">
        <a-date-picker 
          v-model:value="endDate" 
          format="YYYY-MM-DD" 
          placeholder="請選擇結束日期"
        />
      </a-form-item>
      <a-form-item>
        <a-button 
          type="primary" 
          :loading="loading" 
          @click="handleExport"
        >
          執行整合報表
        </a-button>
      </a-form-item>
    </a-form>
    
    <a-divider />
    
    <!-- 成功訊息 -->
    <a-alert 
      v-if="result" 
      :message="result" 
      type="success" 
      show-icon 
      closable
      @close="result = ''"
    />
    
    <!-- 錯誤訊息 -->
    <a-alert 
      v-if="error" 
      :message="error" 
      type="error" 
      show-icon 
      closable
      @close="error = ''"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { DataService } from '@/config/dataService/dataService'

// 響應式資料
const startDate = ref()
const endDate = ref()
const loading = ref(false)
const result = ref('')
const error = ref('')

// API 主機位址
//const exportApiHost = process.env.VUE_APP_EXPORT_API_HOST || '/exportApi'

// 驗證日期選擇
const validateDates = () => {
  if (!startDate.value) {
    message.warning('請選擇開始日期')
    return false
  }
  
  if (!endDate.value) {
    message.warning('請選擇結束日期')
    return false
  }
  
  if (startDate.value.isAfter(endDate.value)) {
    message.warning('開始日期不能晚於結束日期')
    return false
  }
  
  return true
}

// 執行整合報表
const handleExport = async () => {
  // 清除之前的訊息
  result.value = ''
  error.value = ''
  
  // 驗證日期
  if (!validateDates()) {
    return
  }
  
  loading.value = true
  
  try {
    const start = startDate.value.format('YYYY-MM-DD')
    const end = endDate.value.format('YYYY-MM-DD')
    const url = `http://localhost:5146/integrated-report/process/date-range?startDate=${start}&endDate=${end}`
    console.log('API URL:', url)
    
    await DataService.post(url)
    
    result.value = '整合報表產生成功！'
    message.success('整合報表產生成功！')
    
  } catch (e) {
    const errorMessage = e.response?.data?.message || e.message || '報表產生失敗，請稍後再試'
    error.value = errorMessage
    message.error(errorMessage)
    
  } finally {
    loading.value = false
  }
}
</script>