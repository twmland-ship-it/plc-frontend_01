<template>
  <ErrorBoundary>
    <div ref="wrapperEl" class="ocogui-wrapper" role="region" aria-label="嵌入式內容區域" :style="wrapperStyle">
      <!-- iframe 容器 -->
      <div class="ocogui-canvas-outer" :style="canvasOuterStyle">
        <div class="ocogui-canvas" :style="canvasScaledInnerStyle">
          <iframe
            v-if="!loadError"
            ref="ifr"
            :src="link"
            frameborder="0"
            :style="iframeStyle"
            :title="'嵌入的 OCOGUI 視圖'"
            :aria-label="'OCOGUI 視圖內容'"
            @load="resetMargins"
            @error="handleIframeError"
          ></iframe>
        </div>
      </div>
      
      <div v-if="loadError" class="error-placeholder" role="alert" aria-live="assertive">
        <div class="error-icon" aria-hidden="true">⚠️</div>
        <h3 id="error-title">無法載入內容</h3>
        <p class="error-message" id="error-message">{{ errorMessage }}</p>
        <div class="troubleshooting" aria-labelledby="troubleshooting-title">
          <h4 id="troubleshooting-title">故障排除建議：</h4>
          <ul>
            <li>檢查 OCOGUI 伺服器是否正在運行</li>
            <li>確認網址是否正確：{{ link }}</li>
            <li>檢查網路連線</li>
            <li>確認瀏覽器沒有阻擋 iframe</li>
          </ul>
        </div>
        <button 
          class="retry-button" 
          @click="retryLoad"
          aria-label="重新載入 iframe 內容"
        >
          重新載入
        </button>
      </div>
    </div>
  </ErrorBoundary>
</template>

<script src="./main.js"></script>

<style scoped>
.ocogui-wrapper {
  width: 100%;
  /* 使用 100% 高度填滿父容器，不要固定扣除高度 */
  height: 100%;
  min-height: calc(100vh - 65px); /* 只扣除 header 高度，讓 iframe 延伸到底部 */
  position: relative;
  overflow: hidden;
  background: transparent;
}

.ocogui-canvas-outer {
  width: 100%;
  height: 100%;
  min-height: inherit;
  position: relative;
}

.ocogui-canvas {
  width: 100%;
  height: 100%;
  min-height: inherit;
  position: relative;
}

.error-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 600px;
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

.error-placeholder h3 {
  color: #ff4d4f;
  margin-bottom: 12px;
  font-size: 24px;
}

.error-message {
  color: #595959;
  margin-bottom: 24px;
  font-size: 16px;
}

.troubleshooting {
  text-align: left;
  margin: 24px 0;
  padding: 16px;
  background: #fafafa;
  border-radius: 4px;
}

.troubleshooting h4 {
  color: #262626;
  margin-bottom: 12px;
  font-size: 16px;
}

.troubleshooting ul {
  margin: 0;
  padding-left: 24px;
  color: #595959;
}

.troubleshooting li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.retry-button {
  padding: 8px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.retry-button:hover {
  background: #40a9ff;
}

.retry-button:active {
  background: #096dd9;
}
</style>
