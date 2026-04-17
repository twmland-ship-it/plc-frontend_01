import { beforeEach, describe, expect, it } from "vitest";

import {
  clearAllAcknowledgedAlarmSuppressions,
  clearAcknowledgedAlarmSuppression,
  getLatestPromptableAlarm,
  rememberAcknowledgedAlarmIds,
  resolveAlarmPromptScope,
  syncAcknowledgedAlarmSuppression,
} from "@/composable/alarmPromptState";

const scope = {
  customerId: "customer-1",
  userKey: "staff-1",
};

describe("alarmPromptState", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("同一使用者重新整理後不應重播剛確認過的警報", () => {
    const alarms = [
      { Id: "alarm-newest", AlarmState: 1, AlarmTime: "2026-03-26T10:00:00" },
      { Id: "alarm-older", AlarmState: 1, AlarmTime: "2026-03-26T09:59:00" },
    ];

    rememberAcknowledgedAlarmIds(scope, ["alarm-newest"]);

    const nextAlarm = getLatestPromptableAlarm(alarms, scope);

    expect(nextAlarm?.Id).toBe("alarm-older");
  });

  it("全部確認後應暫時抑制目前作用中的所有警報", () => {
    const alarms = [
      { Id: "alarm-1", AlarmState: 1, AlarmTime: "2026-03-26T10:00:00" },
      { Id: "alarm-2", AlarmState: 1, AlarmTime: "2026-03-26T09:59:00" },
    ];

    rememberAcknowledgedAlarmIds(
      scope,
      alarms.map((alarm) => alarm.Id)
    );

    const nextAlarm = getLatestPromptableAlarm(alarms, scope);

    expect(nextAlarm).toBeUndefined();
  });

  it("當後端狀態已同步後應清除本機抑制清單", () => {
    rememberAcknowledgedAlarmIds(scope, ["alarm-1"]);

    syncAcknowledgedAlarmSuppression(scope, [
      { Id: "alarm-1", AlarmState: 2, AlarmTime: "2026-03-26T10:00:00" },
    ]);

    const nextAlarm = getLatestPromptableAlarm(
      [{ Id: "alarm-1", AlarmState: 1, AlarmTime: "2026-03-26T10:05:00" }],
      scope
    );

    expect(nextAlarm?.Id).toBe("alarm-1");
  });

  it("可清除指定使用者的抑制狀態", () => {
    rememberAcknowledgedAlarmIds(scope, ["alarm-1"]);
    clearAcknowledgedAlarmSuppression(scope);

    const nextAlarm = getLatestPromptableAlarm(
      [{ Id: "alarm-1", AlarmState: 1, AlarmTime: "2026-03-26T10:05:00" }],
      scope
    );

    expect(nextAlarm?.Id).toBe("alarm-1");
  });

  it("scope 應優先使用正規化後的登入帳號作為穩定 user key", () => {
    const resolved = resolveAlarmPromptScope({
      customerId: "customer-1",
      userData: {
        Account: " operator.account ",
        StaffName: "操作員甲",
        UniformNumber: "TENANT-1",
      },
    });

    expect(resolved).toEqual({
      customerId: "customer-1",
      userKey: "account:OPERATOR.ACCOUNT",
    });
  });

  it("scope 在未顯式傳入 customerId 時應回退到 tenantContext", () => {
    window.localStorage.setItem("customer_id", JSON.stringify("tenant-guid-2"));

    const resolved = resolveAlarmPromptScope({
      userData: {
        StaffName: "操作員乙",
        Account: "operator.b",
      },
    });

    expect(resolved).toEqual({
      customerId: "tenant-guid-2",
      userKey: "account:OPERATOR.B",
    });
  });

  it("scope 應優先使用 StaffId，避免與帳號 fallback 混淆", () => {
    const resolved = resolveAlarmPromptScope({
      customerId: "customer-1",
      userData: {
        StaffId: "staff-guid-1",
        Account: "operator.account",
      },
      loginCredentials: {
        account: "other.account",
      },
    });

    expect(resolved).toEqual({
      customerId: "customer-1",
      userKey: "staff:staff-guid-1",
    });
  });

  it("應可清除本分頁所有警報抑制狀態", () => {
    rememberAcknowledgedAlarmIds(
      { customerId: "customer-1", userKey: "account:USER.A" },
      ["alarm-1"]
    );
    rememberAcknowledgedAlarmIds(
      { customerId: "customer-1", userKey: "account:USER.B" },
      ["alarm-2"]
    );

    clearAllAcknowledgedAlarmSuppressions();

    expect(
      getLatestPromptableAlarm(
        [{ Id: "alarm-1", AlarmState: 1, AlarmTime: "2026-03-26T10:05:00" }],
        { customerId: "customer-1", userKey: "account:USER.A" }
      )?.Id
    ).toBe("alarm-1");
    expect(
      getLatestPromptableAlarm(
        [{ Id: "alarm-2", AlarmState: 1, AlarmTime: "2026-03-26T10:05:00" }],
        { customerId: "customer-1", userKey: "account:USER.B" }
      )?.Id
    ).toBe("alarm-2");
  });
});
