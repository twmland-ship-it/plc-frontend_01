import { DataService } from "@/config/dataService/dataService";
import {
  getTenantId,
  isTenantRebindStorageKey,
} from "@/utility/tenantContext";

const TENANTLESS_CACHE_KEY = "__tenantless__";
const cctvMapByTenant = new Map();
const fetchPromiseByTenant = new Map();

const getCacheTenantKey = () => getTenantId() || TENANTLESS_CACHE_KEY;

function invalidateTenantCache(tenantKey) {
  if (tenantKey) {
    cctvMapByTenant.delete(tenantKey);
    fetchPromiseByTenant.delete(tenantKey);
    return;
  }

  cctvMapByTenant.clear();
  fetchPromiseByTenant.clear();
}

async function ensureLoaded() {
  const tenantKey = getCacheTenantKey();

  if (cctvMapByTenant.has(tenantKey)) {
    return tenantKey;
  }

  if (fetchPromiseByTenant.has(tenantKey)) {
    await fetchPromiseByTenant.get(tenantKey);
    return tenantKey;
  }

  const fetchPromise = (async () => {
    try {
      const res = await DataService.get("/api/CCTV/GetCCTVList");
      const list = res.data?.Detail?.CCTVList ?? [];
      const cctvMap = new Map();
      for (const item of list) {
        cctvMap.set(String(item.Id), item);
      }
      cctvMapByTenant.set(tenantKey, cctvMap);
    } catch (err) {
      console.error("cctvCache: 載入 CCTV 清單失敗", err);
      cctvMapByTenant.set(tenantKey, new Map());
    } finally {
      fetchPromiseByTenant.delete(tenantKey);
    }
  })();
  fetchPromiseByTenant.set(tenantKey, fetchPromise);
  await fetchPromise;
  return tenantKey;
}

export async function getCctvStreamInfo(cctvId) {
  const tenantKey = await ensureLoaded();
  const item = cctvMapByTenant.get(tenantKey)?.get(String(cctvId));
  if (!item || !item.ProfileUrl) return null;

  let streamUri = item.ProfileUrl.trim();
  if (item.UserName && item.Password) {
    streamUri = streamUri.replace(
      "rtsp://",
      `rtsp://${item.UserName}:${item.Password}@`
    );
  }
  return { streamName: String(item.Id), streamUri, name: item.Name };
}

export function invalidateCctvCache(tenantId) {
  invalidateTenantCache(tenantId || undefined);
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (isTenantRebindStorageKey(event.key)) {
      invalidateTenantCache();
    }
  });
}
