<template>
  <div>
    <slot v-if="!hasError"></slot>
    <div v-else class="error-boundary">
      <div class="error-icon">⚠️</div>
      <h3>發生錯誤</h3>
      <p class="error-message">{{ errorMessage }}</p>
      <details v-if="errorStack" class="error-details">
        <summary>技術詳情</summary>
        <pre>{{ errorStack }}</pre>
      </details>
      <button class="reset-button" @click="reset">重新載入</button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onErrorCaptured } from 'vue';

export default defineComponent({
  name: 'ErrorBoundary',
  setup() {
    const hasError = ref(false);
    const errorMessage = ref('');
    const errorStack = ref('');

    onErrorCaptured((error, instance, info) => {
      hasError.value = true;
      errorMessage.value = error.message || '未知錯誤';
      errorStack.value = error.stack || '';
      console.error('Component error:', error, info);
      
      // 阻止錯誤繼續傳播
      return false;
    });

    const reset = () => {
      hasError.value = false;
      errorMessage.value = '';
      errorStack.value = '';
    };

    return {
      hasError,
      errorMessage,
      errorStack,
      reset
    };
  }
});
</script>

<style scoped>
.error-boundary {
  max-width: 600px;
  margin: 40px auto;
  padding: 40px;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.error-boundary h3 {
  color: #ff4d4f;
  margin-bottom: 12px;
  font-size: 24px;
}

.error-message {
  color: #595959;
  margin-bottom: 24px;
  font-size: 16px;
}

.error-details {
  text-align: left;
  margin: 24px 0;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.error-details summary {
  cursor: pointer;
  color: #1890ff;
  font-weight: 500;
  margin-bottom: 12px;
}

.error-details pre {
  margin: 12px 0 0 0;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
  color: #262626;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.reset-button {
  padding: 8px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.reset-button:hover {
  background: #40a9ff;
}

.reset-button:active {
  background: #096dd9;
}
</style>
