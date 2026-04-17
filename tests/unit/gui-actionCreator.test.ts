import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/config/dataService/dataService", () => ({
  DataService: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import guiModule from "@/vuex/modules/gui/actionCreator";
import { DataService } from "@/config/dataService/dataService";

const mockedDataService = DataService as unknown as {
  post: ReturnType<typeof vi.fn>;
};

describe("gui actionCreator", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sendTagSignal should use the current-tenant-safe modbus endpoint", async () => {
    mockedDataService.post.mockResolvedValue({ data: { ReturnCode: 1 } });
    const commit = vi.fn();

    await guiModule.actions.sendTagSignal(
      { commit },
      [
        { id: "tag-001", signalValue: "10" },
        { id: "tag-002", signalValue: "20" },
      ]
    );

    expect(mockedDataService.post).toHaveBeenCalledWith(
      "/api/App/SetCurrentTenantModbusTargetValue",
      {
        ValuePairList: [
          { Id: "tag-001", Value: "10" },
          { Id: "tag-002", Value: "20" },
        ],
      }
    );
  });
});
