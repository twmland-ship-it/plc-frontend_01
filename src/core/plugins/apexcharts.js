import VueApexCharts from 'vue3-apexcharts';
import app from '../../config/configApp';
import VCalendar from 'v-calendar';

// 檢查插件是否已經註冊，避免重複註冊
if (!app.config.globalProperties.$apexcharts) {
  app.config.globalProperties.$apexcharts = true;
  app.use(VueApexCharts);
}

if (!app.config.globalProperties.$calendar) {
  app.config.globalProperties.$calendar = true;
  app.use(VCalendar, {});
}
