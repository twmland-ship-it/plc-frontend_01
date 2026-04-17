<template>
  <div style="padding: 20px;">
    <h2>API 測試頁面</h2>
    
    <div style="margin-bottom: 20px;">
      <button @click="testRolesAPI" style="margin-right: 10px;">測試權限 API (/roles)</button>
      <button @click="testStaffAPI" style="margin-right: 10px;">測試人員 API (/staff-members)</button>
      <button @click="clearResults">清除結果</button>
    </div>
    
    <div v-if="loading" style="color: blue;">載入中...</div>
    
    <div v-if="results" style="margin-top: 20px;">
      <h3>API 調用結果：</h3>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">{{ results }}</pre>
    </div>
    
    <div v-if="error" style="margin-top: 20px; color: red;">
      <h3>錯誤：</h3>
      <pre style="background: #ffe6e6; padding: 10px; border-radius: 4px;">{{ error }}</pre>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { DataService } from '@/config/dataService/dataService';

export default {
  name: 'TestAPI',
  setup() {
    const loading = ref(false);
    const results = ref(null);
    const error = ref(null);
    
    const clearResults = () => {
      results.value = null;
      error.value = null;
    };
    
    const testRolesAPI = async () => {
      loading.value = true;
      clearResults();
      
      try {
        console.log('測試權限 API...');
        const response = await DataService.get('/roles');
        console.log('權限 API 回應:', response);
        results.value = JSON.stringify(response.data, null, 2);
      } catch (err) {
        console.error('權限 API 錯誤:', err);
        error.value = err.message || err.toString();
      } finally {
        loading.value = false;
      }
    };
    
    const testStaffAPI = async () => {
      loading.value = true;
      clearResults();
      
      try {
        console.log('測試人員 API...');
        const response = await DataService.get('/staff-members');
        console.log('人員 API 回應:', response);
        results.value = JSON.stringify(response.data, null, 2);
      } catch (err) {
        console.error('人員 API 錯誤:', err);
        error.value = err.message || err.toString();
      } finally {
        loading.value = false;
      }
    };
    
    return {
      loading,
      results,
      error,
      testRolesAPI,
      testStaffAPI,
      clearResults
    };
  }
};
</script>
