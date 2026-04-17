<template>
  <div>
    <!-- 非時間電價標題 -->
    <div class="title-header">
      <h2>非時間電價</h2>
      <div class="unit-label">單位：元</div>
    </div>

    <!-- 表格容器置中 -->
    <div style="display: flex; justify-content: center;">
      <table style="border-collapse: collapse; font-size: 16px; text-align: center; border: 2px solid #000;">
      <thead>
        <tr>
          <th colspan="4" style="border: 1px solid #000; padding: 8px; background-color: #90EE90; text-align: center;">分類</th>
          <th style="border: 1px solid #000; padding: 8px; background-color: #90EE90;">夏月</th>
          <th style="border: 1px solid #000; padding: 8px; background-color: #90EE90;">非夏月</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td rowspan="3" style="border: 1px solid #000; padding: 8px; background-color: #F0F8E8; vertical-align: middle; text-align: center;">基<br>本<br>電<br>費</td>
          <td colspan="3" style="border: 1px solid #000; padding: 8px; background-color: #F0F8E8;">裝置契約</td>
          <td style="border: 1px solid #000; padding: 8px;"><input v-model="formState.summer.deviceContract" style="border: 1px solid #ccc; padding: 4px; text-align: center; width: 100%; box-sizing: border-box;" /></td>
          <td style="border: 1px solid #000; padding: 8px;"><input v-model="formState.noSummer.deviceContract" style="border: 1px solid #ccc; padding: 4px; text-align: center; width: 100%; box-sizing: border-box;" /></td>
        </tr>
        <tr>
          <td rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #F0F8E8; font-size: 12px; vertical-align: middle; text-align: center;">需量契約</td>
          <td style="border: 1px solid #000; padding: 4px; background-color: #F0F8E8; font-size: 12px;">經常契約</td>
          <td rowspan="2" style="border: 1px solid #000; padding: 4px; background-color: #F0F8E8; font-size: 12px; vertical-align: middle; text-align: center;">每瓩每月</td>
          <td style="border: 1px solid #000; padding: 8px;"><input v-model="formState.summer.demandContractRegular" style="border: 1px solid #ccc; padding: 4px; text-align: center; width: 100%; box-sizing: border-box;" /></td>
          <td style="border: 1px solid #000; padding: 8px;"><input v-model="formState.noSummer.demandContractRegular" style="border: 1px solid #ccc; padding: 4px; text-align: center; width: 100%; box-sizing: border-box;" /></td>
        </tr>
        <tr>
          <td style="border: 1px solid #000; padding: 4px; background-color: #F0F8E8; font-size: 12px;">非夏月契約</td>
          <td style="border: 1px solid #000; padding: 8px;"><input v-model="formState.summer.demandContractNonSummer" style="border: 1px solid #ccc; padding: 4px; text-align: center; width: 100%; box-sizing: border-box;" /></td>
          <td style="border: 1px solid #000; padding: 8px;"><input v-model="formState.noSummer.demandContractNonSummer" style="border: 1px solid #ccc; padding: 4px; text-align: center; width: 100%; box-sizing: border-box;" /></td>
        </tr>

        <tr>
          <td colspan="3" style="border: 1px solid #000; padding: 8px; background-color: #F0F8E8; text-align: center;">流動電費</td>
          <td style="border: 1px solid #000; padding: 8px; background-color: #F0F8E8;">每度</td>
          <td style="border: 1px solid #000; padding: 8px;"><input v-model="formState.summer.mobileRate" style="border: 1px solid #ccc; padding: 4px; text-align: center; width: 100%; box-sizing: border-box;" /></td>
          <td style="border: 1px solid #000; padding: 8px;"><input v-model="formState.noSummer.mobileRate" style="border: 1px solid #ccc; padding: 4px; text-align: center; width: 100%; box-sizing: border-box;" /></td>
        </tr>
      </tbody>
      </table>
    </div>

    <!-- 日期區間設定和電價實施設定 -->
    <div style="display: flex; justify-content: center; margin-top: 20px; gap: 20px;">
      <!-- 夏月期間設定 -->
      <div style="border: 1px solid #ccc; padding: 15px; border-radius: 5px; background-color: #f9f9f9;">
        <div style="margin-bottom: 10px; font-weight: bold; text-align: center;">夏月期間設定</div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <span>夏月：</span>
          <input
            v-model="startMonth"
            type="number"
            min="1"
            max="12"
            style="border: 1px solid #ccc; padding: 4px; width: 50px; text-align: center;"
          />
          <span>月</span>
          <input
            v-model="startDay"
            type="number"
            min="1"
            max="31"
            style="border: 1px solid #ccc; padding: 4px; width: 50px; text-align: center;"
          />
          <span>日 至 </span>
          <input
            v-model="endMonth"
            type="number"
            min="1"
            max="12"
            style="border: 1px solid #ccc; padding: 4px; width: 50px; text-align: center;"
          />
          <span>月</span>
          <input
            v-model="endDay"
            type="number"
            min="1"
            max="31"
            style="border: 1px solid #ccc; padding: 4px; width: 50px; text-align: center;"
          />
          <span>日</span>
        </div>
      </div>

      <!-- 電價實施設定 -->
      <div style="border: 1px solid #ccc; padding: 15px; border-radius: 5px; background-color: #f9f9f9;">
        <div style="margin-bottom: 10px; font-weight: bold; text-align: center;">電價實施設定</div>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <!-- 臨時用電倍數 -->
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="min-width: 100px;">臨時用電倍數：</span>
            <input
              v-model.number="formState.temporaryMultiplier"
              type="number"
              step="0.1"
              min="1"
              style="border: 1px solid #ccc; padding: 4px; width: 100px; text-align: center;"
            />
          </div>

          <!-- 備註文字 -->
          <div style="font-size: 12px; color: #666; margin-top: 5px;">
            備註：非臨時用電為1，臨時電依規定為大於1的小數
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, defineProps, defineEmits, nextTick } from 'vue'

// 定義 props
const props = defineProps({
  value: {
    type: Object,
    default: () => ({
      temporaryMultiplier: 1.0,
      summerMonth: {
        startDate: "06-01",
        endDate: "09-30"
      },
      summer: {
        deviceContract: '',
        demandContractRegular: '',
        demandContractNonSummer: '',
        mobileRate: ''
      },
      noSummer: {
        deviceContract: '',
        demandContractRegular: '',
        demandContractNonSummer: '',
        mobileRate: ''
      }
    })
  }
})

// 定義 emits
const emit = defineEmits(['update:value'])

// 建立本地響應式資料
const formState = reactive({ ...props.value })

// 解析夏月日期
const startMonth = computed({
  get: () => parseInt(formState.summerMonth.startDate.split('-')[0]),
  set: (val) => {
    const day = formState.summerMonth.startDate.split('-')[1]
    formState.summerMonth.startDate = `${val.toString().padStart(2, '0')}-${day}`
  }
})

const startDay = computed({
  get: () => parseInt(formState.summerMonth.startDate.split('-')[1]),
  set: (val) => {
    const month = formState.summerMonth.startDate.split('-')[0]
    formState.summerMonth.startDate = `${month}-${val.toString().padStart(2, '0')}`
  }
})

const endMonth = computed({
  get: () => parseInt(formState.summerMonth.endDate.split('-')[0]),
  set: (val) => {
    const day = formState.summerMonth.endDate.split('-')[1]
    formState.summerMonth.endDate = `${val.toString().padStart(2, '0')}-${day}`
  }
})

const endDay = computed({
  get: () => parseInt(formState.summerMonth.endDate.split('-')[1]),
  set: (val) => {
    const month = formState.summerMonth.endDate.split('-')[0]
    formState.summerMonth.endDate = `${month}-${val.toString().padStart(2, '0')}`
  }
})

// 移除年份月份選項，因為年月從主頁面的標題帶入

// 監聽資料變化並發出事件
watch(
  () => formState,
  (newValue) => {
    // 確保 temporaryMultiplier 保持數值類型
    const emitValue = { ...newValue };
    if (emitValue.temporaryMultiplier !== undefined) {
      emitValue.temporaryMultiplier = parseFloat(emitValue.temporaryMultiplier) || 1.0;
    }
    // 使用 nextTick 確保更新在下一個 tick 執行
    nextTick(() => {
      emit('update:value', emitValue)
    })
  },
  { deep: true }
)

// 監聽 props 變化
watch(
  () => props.value,
  (newValue) => {
    Object.assign(formState, newValue)
  },
  { deep: true }
)
</script>

<style scoped>
/* 標題區域 */
.title-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.title-header h2 {
  color: #52c41a;
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  text-align: center;
  flex: 1;
}

.unit-label {
  color: #666;
  font-size: 14px;
  font-weight: normal;
}
</style>
