<template>
  <div class="go2rtc-player">
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      :style="{ width: '100%', height: '100%', objectFit: 'contain', background: '#000' }"
    />
    <div v-if="loading" class="go2rtc-overlay">
      <span>{{ statusDetail || '連線中...' }}</span>
    </div>
    <div v-if="errorMessage && !loading" class="go2rtc-overlay go2rtc-error">
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from "vue";
import {
  getWebRtcUrl,
  getMseUrl,
  getHlsUrl,
  addStream,
  releaseStream,
  registerConnection,
  closeConnection,
} from "@/composable/go2rtcService";

const MODE_ORDER = ["webrtc", "mse", "hls"];
const MAX_RETRIES = 3;
const BASE_RETRY_INTERVAL = 2000;
const MAX_RETRY_INTERVAL = 30000;
const BACKOFF_MULTIPLIER = 2;

export default defineComponent({
  name: "Go2rtcVideoPlayer",
  props: {
    streamUri: { type: String, required: true },
    streamName: { type: String, required: true },
    autoConnect: { type: Boolean, default: true },
  },
  emits: ["connected", "disconnected", "error"],
  setup(props, { emit }) {
    const videoRef = ref(null);
    const loading = ref(false);
    const errorMessage = ref("");
    const statusDetail = ref("");

    let currentMode = "webrtc";
    let retryCount = 0;
    let isDestroyed = false;
    let peerConnection = null;
    let mediaStream = null;
    let mseWebSocket = null;
    let mediaSource = null;
    let sourceBuffer = null;
    let hlsInstance = null;
    let retryTimer = null;

    function calcBackoff(attempt) {
      return Math.min(
        BASE_RETRY_INTERVAL * Math.pow(BACKOFF_MULTIPLIER, attempt - 1),
        MAX_RETRY_INTERVAL
      );
    }

    function cleanupCurrentConnection() {
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop());
        mediaStream = null;
      }
      if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
      }
      if (mseWebSocket) {
        mseWebSocket.close();
        mseWebSocket = null;
      }
      if (mediaSource && mediaSource.readyState === "open") {
        try { mediaSource.endOfStream(); } catch (_e) { /* expected if already ended */ }
      }
      mediaSource = null;
      sourceBuffer = null;
      if (hlsInstance) {
        hlsInstance.destroy();
        hlsInstance = null;
      }
    }

    function cleanup() {
      if (retryTimer) {
        clearTimeout(retryTimer);
        retryTimer = null;
      }
      cleanupCurrentConnection();
      if (videoRef.value) {
        videoRef.value.srcObject = null;
        videoRef.value.src = "";
        try { videoRef.value.load(); } catch (_e) { /* may fail if already unloaded */ }
      }
      closeConnection(props.streamName);
      releaseStream(props.streamName);
    }

    // ---- WebRTC ----
    async function createWebRtcConnection() {
      if (isDestroyed) return;
      const url = getWebRtcUrl(props.streamName);
      peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      let trackHandled = false;
      peerConnection.addEventListener("track", (ev) => {
        if (isDestroyed || trackHandled) return;
        if (ev.streams && ev.streams[0]) {
          trackHandled = true;
          mediaStream = ev.streams[0];
          if (videoRef.value) {
            videoRef.value.srcObject = mediaStream;
            videoRef.value.play().catch(() => {});
          }
          onSuccess("webrtc");
        }
      });

      peerConnection.addEventListener("connectionstatechange", () => {
        if (isDestroyed) return;
        const s = peerConnection?.connectionState;
        if (s === "failed" || s === "disconnected") {
          handleError(new Error(`WebRTC 連線狀態: ${s}`));
        }
      });

      const offer = await peerConnection.createOffer({
        offerToReceiveVideo: true,
        offerToReceiveAudio: true,
      });
      await peerConnection.setLocalDescription(offer);
      await waitIce();

      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/sdp" },
        body: peerConnection.localDescription?.sdp,
      });
      if (!resp.ok) {
        throw new Error(`WebRTC 交換失敗: ${resp.status} ${await resp.text()}`);
      }
      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: await resp.text(),
      });
    }

    function waitIce() {
      return new Promise((resolve) => {
        if (!peerConnection || peerConnection.iceGatheringState === "complete") {
          resolve();
          return;
        }
        const check = () => {
          if (peerConnection?.iceGatheringState === "complete") {
            peerConnection.removeEventListener("icegatheringstatechange", check);
            resolve();
          }
        };
        peerConnection.addEventListener("icegatheringstatechange", check);
        setTimeout(resolve, 3000);
      });
    }

    // ---- MSE ----
    async function createMseConnection() {
      if (isDestroyed) return;
      const mseUrl = getMseUrl(props.streamName);

      return new Promise((resolve, reject) => {
        mediaSource = new MediaSource();
        const video = videoRef.value;
        if (!video) { reject(new Error("video element missing")); return; }
        video.src = URL.createObjectURL(mediaSource);
        let dataReceived = false;
        let dataTimer;

        mediaSource.addEventListener("sourceopen", () => {
          if (isDestroyed) { reject(new Error("destroyed")); return; }
          try {
            mseWebSocket = new WebSocket(mseUrl);
            mseWebSocket.binaryType = "arraybuffer";

            mseWebSocket.onopen = () => {
              statusDetail.value = "MSE 已連線，等待影像...";
              dataTimer = setTimeout(() => {
                if (!dataReceived && !isDestroyed) {
                  mseWebSocket?.close();
                  reject(new Error("MSE 未收到影像資料"));
                }
              }, 10000);
            };

            mseWebSocket.onmessage = (ev) => {
              if (!dataReceived) {
                dataReceived = true;
                if (dataTimer) clearTimeout(dataTimer);
                onSuccess("mse");
                resolve();
              }
              if (!sourceBuffer && mediaSource?.readyState === "open") {
                try {
                  sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E"');
                } catch (_) { return; }
              }
              try {
                if (sourceBuffer && !sourceBuffer.updating) {
                  sourceBuffer.appendBuffer(ev.data);
                }
              } catch (_e) { /* buffer full or updating */ }
            };

            mseWebSocket.onerror = () => {
              if (dataTimer) clearTimeout(dataTimer);
              reject(new Error("MSE WebSocket 連線錯誤"));
            };
            mseWebSocket.onclose = (ev) => {
              if (dataTimer) clearTimeout(dataTimer);
              if (isDestroyed) return;
              if (!dataReceived) {
                reject(new Error("MSE 連線被關閉"));
              } else if (ev.code !== 1000) {
                handleError(new Error(`MSE WebSocket 非正常關閉 (code=${ev.code})`));
              }
            };
          } catch (err) { reject(err); }
        });
      });
    }

    // ---- HLS ----
    async function createHlsConnection() {
      if (isDestroyed) return;
      const hlsUrl = getHlsUrl(props.streamName);
      const video = videoRef.value;
      if (!video) throw new Error("video element missing");

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = hlsUrl;
        return new Promise((resolve, reject) => {
          const ok = () => { video.removeEventListener("canplay", ok); video.removeEventListener("error", fail); onSuccess("hls"); resolve(); };
          const fail = () => { video.removeEventListener("canplay", ok); video.removeEventListener("error", fail); reject(new Error("HLS 播放失敗")); };
          video.addEventListener("canplay", ok);
          video.addEventListener("error", fail);
          video.load();
        });
      }
      if (window.Hls && window.Hls.isSupported()) {
        return new Promise((resolve, reject) => {
          hlsInstance = new window.Hls();
          hlsInstance.loadSource(hlsUrl);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, () => { onSuccess("hls"); resolve(); });
          hlsInstance.on(window.Hls.Events.ERROR, (_, d) => { if (d.fatal) reject(new Error(`HLS 錯誤: ${d.type}`)); });
        });
      }
      throw new Error("瀏覽器不支援 HLS");
    }

    // ---- 連線策略 ----
    async function tryConnect(mode) {
      if (isDestroyed) return;
      currentMode = mode;
      statusDetail.value = `嘗試 ${mode.toUpperCase()} 連線...`;
      if (mode === "webrtc") await createWebRtcConnection();
      else if (mode === "mse") await createMseConnection();
      else if (mode === "hls") await createHlsConnection();
    }

    async function tryNextMode(_lastErr) {
      const idx = MODE_ORDER.indexOf(currentMode);
      if (idx + 1 >= MODE_ORDER.length) return false;
      const next = MODE_ORDER[idx + 1];
      console.log(`Go2rtcVideoPlayer: ${currentMode} 失敗，降級到 ${next}`);
      cleanupCurrentConnection();
      try {
        await tryConnect(next);
        return true;
      } catch (err) {
        return tryNextMode(err);
      }
    }

    async function handleError(err) {
      if (isDestroyed) return;
      console.warn(`Go2rtcVideoPlayer: 錯誤 (${currentMode})`, err);
      const degraded = await tryNextMode(err);
      if (!degraded) {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          const delay = calcBackoff(retryCount);
          errorMessage.value = `重連中 (${retryCount}/${MAX_RETRIES})... ${Math.ceil(delay / 1000)}秒後重試`;
          loading.value = false;
          retryTimer = setTimeout(() => {
            if (!isDestroyed) {
              currentMode = "webrtc";
              connect();
            }
          }, delay);
        } else {
          loading.value = false;
          errorMessage.value = "所有播放模式連線失敗，攝影機可能離線";
          emit("error", new Error(errorMessage.value));
        }
      }
    }

    function onSuccess(mode) {
      loading.value = false;
      errorMessage.value = "";
      statusDetail.value = "";
      retryCount = 0;
      registerConnection(props.streamName, peerConnection, mediaStream);
      emit("connected", mode);
    }

    async function connect() {
      if (isDestroyed || !props.streamUri || !props.streamName) return;
      loading.value = true;
      errorMessage.value = "";
      statusDetail.value = "註冊串流來源...";

      try {
        await addStream(props.streamName, props.streamUri);
        await tryConnect(currentMode);
      } catch (err) {
        await handleError(err);
      }
    }

    onMounted(() => {
      if (props.autoConnect && props.streamUri && props.streamName) {
        connect();
      }
    });

    watch(
      () => props.autoConnect,
      (val) => {
        if (val && props.streamUri && props.streamName) connect();
      }
    );

    onBeforeUnmount(() => {
      isDestroyed = true;
      cleanup();
    });

    return { videoRef, loading, errorMessage, statusDetail };
  },
});
</script>

<style scoped>
.go2rtc-player {
  position: relative;
  width: 100%;
  background: #000;
}
.go2rtc-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 14px;
  background: rgba(0, 0, 0, 0.6);
  pointer-events: none;
}
.go2rtc-error {
  color: #ff6b6b;
}
</style>
