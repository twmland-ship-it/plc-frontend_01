import { DataService } from './dataService';
import { message } from 'ant-design-vue';
import * as XLSX from 'xlsx';

// 根據您提供的 API 規格，目前只有這些端點：
// GET /api/holidays - 查詢假日集合列表
// POST /api/holiday/{year}/export - 匯出假日列表檔案
// POST /api/holiday/{year}/import - 匯入假日列表檔案

const getHolidayYears = () => {
  // 現在後端 API 已經實作，使用真實的 API 呼叫
  return DataService.get('/api/holidays');
};

const exportHolidays = (year, holidayData) => {
  // 後端 API 還沒實作，先使用模擬功能
  // TODO: 當後端 API 實作完成後，改為呼叫 POST /api/holiday/{year}/export
  return new Promise((resolve) => {
    // 模擬檔案下載
    setTimeout(() => {
      // 使用傳入的假日資料，而不是寫死的資料
      if (!holidayData || !Array.isArray(holidayData) || holidayData.length === 0) {
        // 如果沒有資料，顯示錯誤訊息
        // message.error('沒有假日資料可以匯出'); // Temporarily disable for smoother user experience
        resolve({ success: false });
        return;
      }
      
      try {
        // 準備 Excel 資料
        const excelData = [
          ['Date'], // 標題列
          ...holidayData.map(h => {
            const dateParts = h.date.split('-'); // YYYY-MM-DD
            if (dateParts.length === 3) {
              return [`${dateParts[1]}-${dateParts[2]}`]; // MM-DD
            }
            return [h.date]; // Fallback
          })
        ];
        
        // 建立工作簿
        const workbook = XLSX.utils.book_new();
        
        // 建立工作表
        const worksheet = XLSX.utils.aoa_to_sheet(excelData);
        
        // 設定欄寬
        worksheet['!cols'] = [
          { width: 15 }, // 日期欄寬
        ];
        
        // 將工作表加入工作簿
        XLSX.utils.book_append_sheet(workbook, worksheet, `${year}年假日列表`);
        
        // 產生 XLSX 檔案
        const excelBuffer = XLSX.write(workbook, { 
          bookType: 'xlsx', 
          type: 'array',
          bookSST: false
        });
        
        // 建立 Blob
        const blob = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        // 觸發下載
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Holidays_${year}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        resolve({ success: true });
      } catch (error) {
        console.error('產生 Excel 檔案失敗:', error);
        message.error('產生 Excel 檔案失敗');
        resolve({ success: false });
      }
    }, 1000);
  });
};

const importHolidays = (year, file) => {
  // Switch to real API call
  const formData = new FormData();
  formData.append('File', file);

  // When using FormData with axios, do not manually set the Content-Type header.
  // The browser will automatically set it to 'multipart/form-data' with the correct boundary.
  return DataService.post(`/api/holiday/${year}/import`, formData);
};

export { getHolidayYears, exportHolidays, importHolidays }; 