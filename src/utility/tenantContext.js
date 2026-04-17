import { getItem, removeItem, setItem } from "@/utility/localStorageControl";

const normalizeValue = (value) => String(value ?? "").trim();
const TENANT_SCOPED_STORAGE_PREFIX = "tenant";
export const TENANT_SLUG_STORAGE_KEY = "brand_id";
export const TENANT_ID_STORAGE_KEY = "customer_id";
export const TENANT_USER_DATA_STORAGE_KEY = "userData";
export const TENANT_ACCESS_TOKEN_STORAGE_KEY = "access_token";
export const TENANT_PERMISSION_STORAGE_KEY = "permission";
export const TENANT_REBIND_STORAGE_KEYS = [
  TENANT_USER_DATA_STORAGE_KEY,
  TENANT_ID_STORAGE_KEY,
  TENANT_SLUG_STORAGE_KEY,
  TENANT_ACCESS_TOKEN_STORAGE_KEY,
];

export const isTenantRebindStorageKey = (storageKey) =>
  TENANT_REBIND_STORAGE_KEYS.includes(storageKey);

export const getTenantSlug = () => normalizeValue(getItem(TENANT_SLUG_STORAGE_KEY));

const getUserDataTenantId = () => {
  const userData = getItem(TENANT_USER_DATA_STORAGE_KEY);
  return normalizeValue(userData?.CustomerId ?? userData?.CustomerID);
};

export const getTenantId = () => {
  const storedTenantId = normalizeValue(getItem(TENANT_ID_STORAGE_KEY));
  if (storedTenantId) {
    return storedTenantId;
  }

  return getUserDataTenantId();
};

export const resolveTenantId = (tenantId) => {
  const normalizedTenantId = normalizeValue(tenantId);
  if (normalizedTenantId) {
    return normalizedTenantId;
  }

  return getTenantId();
};

export const getTenantContext = () => ({
  tenantSlug: getTenantSlug(),
  tenantId: getTenantId(),
});

export const resolveTenantSlug = (routeTenantSlug) => {
  const normalizedRouteTenantSlug = normalizeValue(routeTenantSlug);
  if (normalizedRouteTenantSlug) {
    return normalizedRouteTenantSlug;
  }

  return getTenantSlug();
};

export const setTenantContext = ({ tenantSlug, tenantId }) => {
  const normalizedTenantSlug = normalizeValue(tenantSlug);
  const normalizedTenantId = normalizeValue(tenantId);

  if (normalizedTenantSlug) {
    setItem(TENANT_SLUG_STORAGE_KEY, normalizedTenantSlug);
  } else {
    removeItem(TENANT_SLUG_STORAGE_KEY);
  }

  if (normalizedTenantId) {
    setItem(TENANT_ID_STORAGE_KEY, normalizedTenantId);
  } else {
    removeItem(TENANT_ID_STORAGE_KEY);
  }
};

export const clearTenantContext = () => {
  removeItem(TENANT_SLUG_STORAGE_KEY);
  removeItem(TENANT_ID_STORAGE_KEY);
};

export const getTenantScopedStorageKey = (baseKey, tenantId) => {
  const normalizedBaseKey = normalizeValue(baseKey);
  if (!normalizedBaseKey) {
    return "";
  }

  const normalizedTenantId = resolveTenantId(tenantId);
  if (!normalizedTenantId) {
    return normalizedBaseKey;
  }

  return `${TENANT_SCOPED_STORAGE_PREFIX}:${normalizedTenantId}:${normalizedBaseKey}`;
};

export const getTenantScopedItem = (baseKey, tenantId) =>
  getItem(getTenantScopedStorageKey(baseKey, tenantId));

export const setTenantScopedItem = (baseKey, value, tenantId) =>
  setItem(getTenantScopedStorageKey(baseKey, tenantId), value);

export const removeTenantScopedItem = (baseKey, tenantId) =>
  removeItem(getTenantScopedStorageKey(baseKey, tenantId));

export const getPermissionData = () => {
  const permissionData = getItem(TENANT_PERMISSION_STORAGE_KEY);
  if (
    permissionData &&
    typeof permissionData === "object" &&
    !Array.isArray(permissionData)
  ) {
    return permissionData;
  }

  return {};
};

export const setPermissionData = (permissionData) => {
  const normalizedPermissionData =
    permissionData &&
    typeof permissionData === "object" &&
    !Array.isArray(permissionData)
      ? permissionData
      : {};

  setItem(TENANT_PERMISSION_STORAGE_KEY, normalizedPermissionData);
  return normalizedPermissionData;
};

export const clearPermissionData = () => {
  removeItem(TENANT_PERMISSION_STORAGE_KEY);
};

export const dispatchStorageUpdate = (storageKey) => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new StorageEvent("storage", {
      key: storageKey,
      newValue: window.localStorage.getItem(storageKey),
    })
  );
};

export const migrateLegacyStorageKeyToTenantScope = (baseKey, tenantId) => {
  if (typeof window === "undefined") {
    return false;
  }

  const normalizedBaseKey = normalizeValue(baseKey);
  const scopedKey = getTenantScopedStorageKey(normalizedBaseKey, tenantId);
  if (!normalizedBaseKey || scopedKey === normalizedBaseKey) {
    return false;
  }

  const scopedValue = window.localStorage.getItem(scopedKey);
  if (scopedValue !== null) {
    return false;
  }

  const legacyValue = window.localStorage.getItem(normalizedBaseKey);
  if (legacyValue === null) {
    return false;
  }

  window.localStorage.setItem(scopedKey, legacyValue);
  window.localStorage.removeItem(normalizedBaseKey);
  return true;
};
