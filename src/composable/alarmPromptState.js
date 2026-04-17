import { resolveTenantId } from "@/utility/tenantContext";

const STORAGE_PREFIX = "alarm_ack_prompt_suppression";

const normalizeAlarmId = (alarmId) => String(alarmId ?? "").trim();
const normalizeIdentityFragment = (value) => String(value ?? "").trim();
const normalizeAccountKey = (value) => normalizeIdentityFragment(value).toUpperCase();

const buildScopeKey = ({ customerId, userKey }) =>
  `${STORAGE_PREFIX}:${customerId || "unknown-customer"}:${userKey || "unknown-user"}`;

export const resolveAlarmPromptScope = ({
  customerId,
  userData,
} = {}) => ({
  customerId: resolveTenantId(customerId),
  userKey: (() => {
    const staffId = normalizeIdentityFragment(userData?.StaffId);
    if (staffId) {
      return `staff:${staffId}`;
    }

    const account = normalizeAccountKey(userData?.Account);
    if (account) {
      return `account:${account}`;
    }

    const uniformNumber = normalizeIdentityFragment(userData?.UniformNumber);
    if (uniformNumber) {
      return `uniform:${uniformNumber}`;
    }

    const staffName = normalizeIdentityFragment(userData?.StaffName);
    if (staffName) {
      return `name:${staffName}`;
    }

    return "anonymous";
  })(),
});

const readEntries = (scope) => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.sessionStorage.getItem(buildScopeKey(scope));
    const parsed = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) =>
        typeof entry === "string" ? entry : normalizeAlarmId(entry?.alarmId)
      )
      .filter(Boolean);
  } catch {
    return [];
  }
};

const writeEntries = (scope, entries) => {
  if (typeof window === "undefined") {
    return;
  }

  if (!entries.length) {
    window.sessionStorage.removeItem(buildScopeKey(scope));
    return;
  }

  window.sessionStorage.setItem(buildScopeKey(scope), JSON.stringify(entries));
};

export const getActiveUnacknowledgedAlarmIds = (alarms) =>
  new Set(
    (Array.isArray(alarms) ? alarms : [])
      .filter((alarm) => Number(alarm?.AlarmState) === 1)
      .map((alarm) => normalizeAlarmId(alarm?.Id))
      .filter(Boolean)
  );

const getStoredSuppressedIds = (scope) => readEntries(scope);

export const rememberAcknowledgedAlarmIds = (scope, alarmIds) => {
  const entries = getStoredSuppressedIds(scope);
  const entryMap = new Map(entries.map((alarmId) => [normalizeAlarmId(alarmId), alarmId]));

  (Array.isArray(alarmIds) ? alarmIds : []).forEach((alarmId) => {
    const normalizedId = normalizeAlarmId(alarmId);
    if (!normalizedId) {
      return;
    }

    entryMap.set(normalizedId, normalizedId);
  });

  writeEntries(scope, Array.from(entryMap.values()));
};

export const syncAcknowledgedAlarmSuppression = (scope, alarms) => {
  const activeAlarmIds = getActiveUnacknowledgedAlarmIds(alarms);
  const syncedEntries = getStoredSuppressedIds(scope).filter((alarmId) =>
    activeAlarmIds.has(normalizeAlarmId(alarmId))
  );

  writeEntries(scope, syncedEntries);
};

export const getLatestPromptableAlarm = (alarms, scope) => {
  const suppressedIds = new Set(getStoredSuppressedIds(scope));

  return (Array.isArray(alarms) ? alarms : []).find(
    (alarm) =>
      Number(alarm?.AlarmState) === 1 &&
      !suppressedIds.has(normalizeAlarmId(alarm?.Id))
  );
};

export const clearAcknowledgedAlarmSuppression = (scope) => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(buildScopeKey(scope));
};

export const clearAllAcknowledgedAlarmSuppressions = () => {
  if (typeof window === "undefined") {
    return;
  }

  const keysToRemove = [];
  for (let i = 0; i < window.sessionStorage.length; i += 1) {
    const key = window.sessionStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => {
    window.sessionStorage.removeItem(key);
  });
};
