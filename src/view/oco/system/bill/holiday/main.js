import { ref, onMounted, defineComponent } from 'vue';
import { message } from 'ant-design-vue';
import { getHolidayYears, exportHolidays, importHolidays } from '@/config/dataService/holidayService';

export default defineComponent({
  setup() {
    const selectedYear = ref(new Date().getFullYear());
    const years = ref([]);
    const holidays = ref([]);
    const loading = ref(false);
    const lastUploadedFileId = ref(null); // To prevent duplicate uploads

    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
      },
    ];

    const generateYearRange = (start, end) => {
      const years = [];
      for (let year = end; year >= start; year--) {
        years.push(year);
      }
      return years;
    };

    const fetchYears = async () => {
      // Per user request, generate a fixed year range from 2020 to 2100
      years.value = generateYearRange(2020, 2100);
      
      const currentYear = new Date().getFullYear();
      if (years.value.includes(currentYear)) {
        selectedYear.value = currentYear;
      } else if (years.value.length > 0) {
        selectedYear.value = years.value[0];
      }
      
      await fetchHolidays();
    };

    const fetchHolidays = async () => {
      if (!selectedYear.value) return;
      loading.value = true;
      try {
        // 根據 API 規格，GET /holidays 返回所有年份的假日資料
        // 我們需要過濾出所選年份的假日
        const response = await getHolidayYears();
        console.log('假日 API 回應:', response);
        
        if (response.data && response.data.Detail && response.data.Detail.Holidays) {
          // 找到所選年份的假日資料
          const yearData = response.data.Detail.Holidays.find(h => h.Year === selectedYear.value);
          
          if (yearData && yearData.Dates) {
            // 將日期陣列轉換為表格格式
            holidays.value = yearData.Dates.map(date => ({
              date: date,
            }));
          } else {
            holidays.value = [];
          }
        } else {
          holidays.value = [];
        }
      } catch (error) {
        console.error('取得假日列表失敗:', error);
        message.error('取得假日列表失敗');
        holidays.value = [];
      } finally {
        loading.value = false;
      }
    };

    const handleYearChange = (year) => {
      selectedYear.value = year;
      fetchHolidays();
    };

    const handleExport = async () => {
      if (!selectedYear.value) {
        message.warn('請先選擇年份');
        return;
      }
      
      if (!holidays.value || holidays.value.length === 0) {
        message.warn('沒有假日資料可以匯出');
        return;
      }
      
      try {
        // 傳入當前的假日資料進行匯出
        await exportHolidays(selectedYear.value, holidays.value);
        message.success(`已開始匯出 ${selectedYear.value} 年的假日列表`);
      } catch (error) {
        message.error('匯出失敗');
      }
    };

    const handleBeforeUpload = (file) => {
      const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      if (!isXlsx) {
        message.error('您只能上傳 .xlsx 檔案!');
      }
      return isXlsx;
    };

    const handleImportChange = async (info) => {
      // We only trigger the upload when the file is added, and use the raw file object.
      if (info.file.status === 'uploading' || info.file.status === 'done') {
        // Use a flag to prevent multiple uploads for the same file
        if (info.file.uid && lastUploadedFileId.value === info.file.uid) {
            return;
        }
        lastUploadedFileId.value = info.file.uid;

        if (info.file.originFileObj) {
            try {
                await importHolidays(selectedYear.value, info.file.originFileObj);
                message.success(`${info.file.name} 檔案匯入成功`);
                await fetchHolidays(); // Refresh the list after a successful import
            } catch (error) {
                message.error(`匯入失敗: ${error.message || '未知錯誤'}`);
            }
        }
      } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 檔案上傳處理失敗`);
      }
    };

    onMounted(() => {
      fetchYears();
    });

    return {
      selectedYear,
      years,
      holidays,
      loading,
      columns,
      handleYearChange,
      handleExport,
      handleImportChange,
      handleBeforeUpload
    };
  }
}); 