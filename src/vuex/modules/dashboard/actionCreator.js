import mutations from "./mutations";
import { DataService } from "@/config/dataService/dataService";
import { useDatatableFilter } from "@/composable/filter.js";
import { usePeriodTime } from "@/composable/period";
import { useUUID } from "@/composable/uuid";
import { statisticMethod } from "@/composable/options";
import dayjs from "dayjs";
let getDashboardInFlight = null;

const MAX_CONCURRENT_API = 2;

const normalizeIdList = (values) =>
  [...new Set((Array.isArray(values) ? values : []).filter(Boolean))];

const getEntityId = (item) => item?.id ?? item?.Id ?? item?.groupId ?? item?.GroupId;

const getEntityChildren = (item) =>
  item?.children ?? item?.childList ?? item?.ChildList ?? [];

const getEntityTags = (item) => item?.tags ?? item?.tagList ?? item?.TagList ?? [];

const buildGroupTagMap = (groups) => {
  const map = new Map();

  const walk = (items) => {
    (Array.isArray(items) ? items : []).forEach((item) => {
      const groupId = getEntityId(item);
      const tagIds = normalizeIdList(
        getEntityTags(item).map((tag) => tag?.id ?? tag?.Id ?? tag?.tagId ?? tag?.TagId)
      );

      if (groupId) {
        map.set(String(groupId), tagIds);
      }

      walk(getEntityChildren(item));
    });
  };

  walk(groups);

  return map;
};

const normalizeDashboardCharts = (charts, groupTagMap) =>
  (Array.isArray(charts) ? charts : []).map((chart) => ({
    ...chart,
    params: (Array.isArray(chart?.params) ? chart.params : []).map((param) => {
      const groups = normalizeIdList(param?.groups);
      const tags = normalizeIdList(param?.tags);
      const groupTags =
        normalizeIdList(param?.groupTags).length > 0
          ? normalizeIdList(param?.groupTags)
          : normalizeIdList(
              groups.flatMap((groupId) => groupTagMap.get(String(groupId)) || [])
            );

      return {
        ...param,
        tags,
        groups,
        groupTags,
      };
    }),
  }));

async function runWithConcurrency(tasks, limit) {
  const results = new Array(tasks.length);
  let idx = 0;
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]();
    }
  });
  await Promise.all(workers);
  return results;
}
const state = () => ({
  data: [],
  url: null,
  fileLoading: false,
  loading: false,
  detailInitData: [],
  detailTableData: [],
  error: null,
});

const actions = {
  async getDashboard({ commit, state }) {
    if (getDashboardInFlight) {
      return getDashboardInFlight;
    }
    getDashboardInFlight = (async () => {
    try {
      await commit("getDashboardBegin");
      const sourceData = await DataService.get(
        "/api/System/GetFirstPageItemContent",
        { _t: Date.now() }
      );
      const options = {
        unit: sourceData.data.Detail.UnitList,
        summaryType: sourceData.data.Detail.StatisticalMethodsList,
        detailPeriod: sourceData.data.Detail.DurationList,
      };

      // 若後端未回傳 PageItemDetail，維持現有資料，避免畫面清空
      if (!sourceData.data.Detail.PageItemDetail) {
        commit("getDashboardSuccess", state.data && state.data.length ? state.data : []);
        return options;
      }

      const rawData = JSON.parse(
        sourceData.data.Detail.PageItemDetail.DataContentJson
      );
      let errors = "";
      const needGroupTagBackfill = Array.isArray(rawData)
        && rawData.some((chart) =>
          Array.isArray(chart?.params)
          && chart.params.some(
            (param) =>
              Array.isArray(param?.groups)
              && param.groups.length > 0
              && (!Array.isArray(param?.groupTags) || param.groupTags.length === 0)
          )
        );
      let groupTagMap = new Map();
      if (needGroupTagBackfill) {
        try {
          const groupRes = await DataService.get(`/api/Tag/GetGroupHierarchyList`);
          groupTagMap = buildGroupTagMap(groupRes.data.Detail.GroupHierarchyList);
        } catch (err) {
          errors += ` 取得群組階層失敗 ${err.message}`;
        }
      }
      const normalizedData = normalizeDashboardCharts(rawData, groupTagMap);
      const summaryType = statisticMethod;
      const result = [];

      const allTasks = [];
      const taskMeta = [];

      for (let ci = 0; ci < normalizedData.length; ci++) {
        const el = normalizedData[ci];
        for (const param of el.params) {
          const tagIds = normalizeIdList([...(param.tags || []), ...(param.groupTags || [])]);
          if (
            tagIds.length === 0
          ) {
            allTasks.push(() => Promise.resolve({ name: param.name, summary: null, detail: [] }));
          } else if (el.timePeriod === 999) {
            allTasks.push(() =>
              DataService.post(`/api/Statistic/GetRealTimeStaisticSummary`, {
                TagIdList: tagIds,
              })
                .then((res) => ({
                  name: param.name,
                  summary: res.data.Detail[
                    summaryType.find((type) => type.value === el.paramSummary)?.value
                  ],
                  detail: res.data.Detail.ValueList,
                }))
                .catch((err) => {
                  errors += `${el.name} ${err.message}`;
                  return { name: param.name, summary: 0, detail: [] };
                })
            );
          } else {
            const { startTime, endTime, reportType } = usePeriodTime(el.timePeriod);
            allTasks.push(() =>
              DataService.post(
                `/api/history-report/tag-statistic-summaries/search/report-type:${reportType}`,
                {
                  TagIds: tagIds,
                  StatisticMethod: el.summary,
                  From: dayjs(startTime).format("YYYY-MM-DD"),
                  To: dayjs(endTime).format("YYYY-MM-DD"),
                },
                { "Content-Type": "application/json" }
              )
                .then((res) => {
                  const paramsData = res.data.Detail.Tags;
                  if (!Array.isArray(paramsData) || paramsData.length === 0) {
                    return { name: param.name, summary: 0, detail: [] };
                  }
                  let summary = 0;
                  const st = el.summary === "Variation" ? "Summation" : el.summary;
                  if (el.paramSummary === "Summation") {
                    summary = paramsData.reduce((acc, p) => acc + p.Summary[st], 0);
                  } else if (el.paramSummary === "Average") {
                    summary = paramsData.reduce((acc, p) => acc + p.Summary[st], 0) / paramsData.length;
                  } else if (el.paramSummary === "Maximum") {
                    summary = paramsData.reduce((max, p) => Math.max(max, p.Summary[st]), paramsData[0].Summary[st]);
                  } else if (el.paramSummary === "Minimum") {
                    summary = paramsData.reduce((min, p) => Math.min(min, p.Summary[st]), paramsData[0].Summary[st]);
                  }
                  return { name: param.name, summary, detail: paramsData };
                })
                .catch((err) => {
                  errors += ` ${el.name} ${err.message}`;
                  return { name: param.name, summary: 0, detail: [] };
                })
            );
          }
          taskMeta.push(ci);
        }
      }

      const allResults = await runWithConcurrency(allTasks, MAX_CONCURRENT_API);

      for (let ci = 0; ci < normalizedData.length; ci++) {
        const paramResults = [];
        for (let ti = 0; ti < taskMeta.length; ti++) {
          if (taskMeta[ti] === ci) paramResults.push(allResults[ti]);
        }
        result.push({ ...normalizedData[ci], data: paramResults });
      }

      // 如果這次結果為空，維持先前資料，避免圖表被清空
      if (!Array.isArray(result) || result.length === 0) {
        commit("getDashboardSuccess", state.data && state.data.length ? state.data : []);
      } else {
        commit("getDashboardSuccess", result);
      }
      if (errors) {
        // 僅保留精簡錯誤摘要，避免大量 console I/O 造成卡頓
        console.warn("[dashboard/getDashboard] partial errors:", errors);
      }
      return options;
    } catch (err) {
      commit("getDashboardErr", err);
      throw new Error(err);
    } finally {
      getDashboardInFlight = null;
    }
    })();
    return getDashboardInFlight;
  },

  async addChart({ state, commit, dispatch }, params) {
    try {
      commit("addChartBegin");
      const newData = JSON.parse(JSON.stringify(state.data));
      newData.push({ ...params, id: useUUID() });
      await DataService.post("/api/System/ModifyFirstPage", {
        ContentJson: JSON.stringify(newData),
      });
      await dispatch("getDashboard");
      commit("addChartSuccess");
    } catch (err) {
      commit("addChartErr", err);
      throw new Error(err);
    }
  },

  async editChart({ commit, state, dispatch }, { id, ...params }) {
    try {
      commit("editChartBegin");
      // call api
      const tar = state.data.findIndex((el) => el.id === id);
      const newData = JSON.parse(JSON.stringify(state.data));
      Object.assign(newData[tar], params);
      await DataService.post("/api/System/ModifyFirstPage", {
        ContentJson: JSON.stringify(newData),
      });
      await dispatch("getDashboard");
      commit("editChartSuccess");
    } catch (err) {
      commit("editChartErr", err);
      throw new Error(err);
    }
  },

  async deleteChart({ state, commit, dispatch }, id) {
    try {
      commit("deleteChartBegin");
      const tar = state.data.findIndex((el) => el.id === id);
      const newData = JSON.parse(JSON.stringify(state.data));
      newData.splice(tar, 1);
      await DataService.post("/api/System/ModifyFirstPage", {
        ContentJson: JSON.stringify(newData),
      });
      await dispatch("getDashboard");
      commit("deleteChartSuccess");
    } catch (err) {
      commit("deleteChartErr", err);
      throw new Error(err);
    }
  },

  fetchDetail({ commit }, data) {
    try {
      commit("fetchDetailBegin");
      commit("fetchDetailSuccess", data);
    } catch (err) {
      commit("fetchDetailErr", err);
    }
  },

  filterDetailTable({ commit, state }, searchText) {
    try {
      commit("filterDetailTableBegin");
      const res = useDatatableFilter(state.detailInitData, searchText);

      commit("filterDetailTableSuccess", res);
    } catch (err) {
      commit("filterDetailTableErr", err);
      throw new Error(err);
    }
  },

  // 保存 Grid 佈局到後端 ContentJson（不改後端 API）
  async saveLayout({ state }, layoutMap) {
    try {
      const newData = state.data.map(item => ({
        ...item,
        layout: layoutMap && layoutMap[item.id] ? { ...layoutMap[item.id] } : item.layout
      }));
      await DataService.post("/api/System/ModifyFirstPage", {
        ContentJson: JSON.stringify(newData),
      });
    } catch (err) {
      // 不中斷使用者操作，僅記錄
      console.warn('saveLayout failed:', err);
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
