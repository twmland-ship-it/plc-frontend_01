import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/vuex/store", () => ({
  default: {},
}));

vi.mock("@/routes/protectedRoute", () => ({
  default: {
    push: vi.fn(),
  },
}));

vi.mock("@/config/dataService/dataService", () => ({
  DataService: {
    get: vi.fn(),
  },
}));

import tagModule from "@/vuex/modules/tags/actionCreator";
import { DataService } from "@/config/dataService/dataService";

const mockedDataService = DataService as unknown as {
  get: ReturnType<typeof vi.fn>;
};

describe("tags actionCreator", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("getAllTagsAndOptions should prefer the current-tenant tag list endpoint", async () => {
    mockedDataService.get.mockResolvedValue({
      data: {
        Detail: {
          TagRalatedItemsUpdateTime: "2026-04-10T00:00:00",
          TagList: [],
          RegionHierarchyList: [],
          TagCategoryHierarchyList: [],
          TagTypeList: [],
          SaveTypeList: [],
          LogInterValType: [],
          UnitList: [],
          DataTypeList: [],
          AlarmStatusList: [],
          AlarmExceptionUntilList: [],
          AlarmExceptionActionList: [],
          EnumDigitalAlarmValueList: [],
          ExpressionModeList: [],
        },
      },
    });

    const commit = vi.fn();

    await tagModule.actions.getAllTagsAndOptions({ commit });

    expect(mockedDataService.get).toHaveBeenCalledWith(
      "/api/App/GetCurrentTenantTagListAsync",
      {}
    );
  });

  it("getAllTagsAndOptions should fall back to the legacy tag list endpoint when current-tenant call fails", async () => {
    mockedDataService.get
      .mockRejectedValueOnce(new Error("current-tenant endpoint unavailable"))
      .mockResolvedValueOnce({
        data: {
          Detail: {
            TagRalatedItemsUpdateTime: "2026-04-10T00:00:00",
            TagList: [],
            RegionHierarchyList: [],
            TagCategoryHierarchyList: [],
            TagTypeList: [],
            SaveTypeList: [],
            LogInterValType: [],
            UnitList: [],
            DataTypeList: [],
            AlarmStatusList: [],
            AlarmExceptionUntilList: [],
            AlarmExceptionActionList: [],
            EnumDigitalAlarmValueList: [],
            ExpressionModeList: [],
          },
        },
      });

    const commit = vi.fn();

    await tagModule.actions.getAllTagsAndOptions({ commit });

    expect(mockedDataService.get).toHaveBeenNthCalledWith(
      1,
      "/api/App/GetCurrentTenantTagListAsync",
      {}
    );
    expect(mockedDataService.get).toHaveBeenNthCalledWith(
      2,
      "/api/Tag/GetTagList",
      {}
    );
  });
});
