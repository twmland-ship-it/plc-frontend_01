const registeredStreams = new Map();
const activeConnections = new Map();

function resolveBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://127.0.0.1:1984";
  }
  const loc = window.location;
  return `${loc.protocol}//${loc.host}/go2rtc`;
}

function resolveWsBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "ws://127.0.0.1:1984";
  }
  const loc = window.location;
  const wsProto = loc.protocol === "https:" ? "wss:" : "ws:";
  return `${wsProto}//${loc.host}/go2rtc`;
}

export function getGo2rtcBaseUrl() {
  return resolveBaseUrl();
}

export function getWebRtcUrl(streamName) {
  return `${getGo2rtcBaseUrl()}/api/webrtc?src=${encodeURIComponent(streamName)}`;
}

export function getMseUrl(streamName) {
  return `${resolveWsBaseUrl()}/api/ws?src=${encodeURIComponent(streamName)}`;
}

export function getHlsUrl(streamName) {
  return `${getGo2rtcBaseUrl()}/api/stream.m3u8?src=${encodeURIComponent(streamName)}`;
}

export async function addStream(name, rtspUrl) {
  try {
    const existing = registeredStreams.get(name);
    if (existing) {
      existing.refCount++;
      return true;
    }

    const baseUrl = resolveBaseUrl();
    const ffmpegWrappedUrl = `ffmpeg:${rtspUrl}#video=h264#audio=copy`;
    const url = `${baseUrl}/api/streams?name=${encodeURIComponent(name)}&src=${encodeURIComponent(ffmpegWrappedUrl)}`;

    await fetch(url, { method: "PUT" });

    registeredStreams.set(name, { url: rtspUrl, refCount: 1 });
    return true;
  } catch (error) {
    console.error(`go2rtcService: 註冊串流失敗 - ${name}`, error);
    return false;
  }
}

export function releaseStream(name) {
  const existing = registeredStreams.get(name);
  if (!existing) return;
  existing.refCount--;
  if (existing.refCount <= 0) {
    registeredStreams.delete(name);
  }
}

export function registerConnection(streamName, peerConnection, mediaStream) {
  const existing = activeConnections.get(streamName);
  if (existing) {
    closeConnectionInternal(existing);
  }
  activeConnections.set(streamName, { streamName, peerConnection, mediaStream });
}

export function closeConnection(streamName) {
  const conn = activeConnections.get(streamName);
  if (conn) {
    closeConnectionInternal(conn);
    activeConnections.delete(streamName);
  }
}

function closeConnectionInternal(conn) {
  try {
    if (conn.mediaStream) {
      conn.mediaStream.getTracks().forEach((t) => t.stop());
    }
    if (conn.peerConnection) {
      conn.peerConnection.close();
    }
  } catch (e) {
    console.warn("go2rtcService: 關閉連線錯誤", e);
  }
}
