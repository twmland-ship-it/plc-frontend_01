import { ref } from 'vue';

export const cctvModalSource = ref(null); // 'auto' | 'user' | null
export const cctvModalOpen = ref(false);
export const cctvModalList = ref([]);

export function setCCTVModalSourceUser() {
  cctvModalSource.value = 'user';
  cctvModalOpen.value = true;
}

export function setCCTVModalSourceAuto() {
  cctvModalSource.value = 'auto';
  cctvModalOpen.value = true;
}

export function resetCCTVModalSource() {
  cctvModalSource.value = null;
  cctvModalOpen.value = false;
  cctvModalList.value = [];
}

/**
 * 防閃爍：僅在 CCTV 列表實際改變時才更新。
 * 回傳 true 表示列表已變更（需要重開/更新 Modal），false 表示相同內容不需動作。
 */
export function updateCCTVModalIfNeeded(newCctvIds) {
  const currentIds = JSON.stringify(cctvModalList.value.slice().sort());
  const newIds = JSON.stringify(newCctvIds.slice().sort());
  // RISK-4 修正：無論 Modal 開或關，只要 CCTV 列表相同就不重複觸發
  // 避免用戶關閉 Modal 後，相同警報又立即重開
  if (currentIds === newIds) {
    return false;
  }
  cctvModalList.value = newCctvIds;
  return true;
}

export function requestOpenCCTVModal(cctvIdList) {
  cctvModalList.value = cctvIdList;
  cctvModalSource.value = 'user';
  cctvModalOpen.value = true;
}
