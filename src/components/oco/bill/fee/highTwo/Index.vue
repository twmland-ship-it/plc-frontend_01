<template>
  <a-form style="overflow: auto; width: 100%">
    <a-row style="margin-bottom: 0.5rem" justify="space-between" align="middle">
      <div>
        <div
          v-if="formState.mode === 'create'"
          class="d-flex align-items-center"
        >
          <p
            style="white-space: nowrap; margin-bottom: 0; margin-right: 0.3rem; font-size: 14px;"
          >
            起始年份:
          </p>
          <a-input
            v-model:value="formState.year"
            style="width: 80px; margin-right: 0.3rem"
            type="number"
            size="small"
          >
          </a-input>
          <p
            style="white-space: nowrap; margin-bottom: 0; margin-right: 0.3rem; font-size: 14px;"
            type="number"
          >
            起始月份:
          </p>
          <a-input
            v-model:value="formState.month"
            style="width: 80px; margin-right: 0.3rem"
            size="small"
          >
          </a-input>
        </div>
      </div>
      <div style="font-size: 14px">單位:元</div>
    </a-row>

    <table class="tg">
      <tbody>
        <tr>
          <td class="tg-0lax" colspan="6" rowspan="2">分類</td>
          <td class="tg-0lax" colspan="2">供電</td>
        </tr>
        <tr>
          <td class="tg-0lax">
            夏月
            <br />
            <a-select v-model:value="startSummerMonth" class="custom-select">
              <a-select-option
                v-for="v in 12"
                :key="v"
                :value="v < 10 ? '0' + v : v"
                >{{ v < 10 ? "0" + v : v }}</a-select-option
              >
            </a-select>
            /
            <a-select v-model:value="startSummerDate" class="custom-select">
              <a-select-option
                v-for="v in 31"
                :key="v"
                :value="v < 10 ? '0' + v : v"
                >{{ v < 10 ? "0" + v : v }}</a-select-option
              >
            </a-select>
            <p style="margin-bottom: 0">至</p>
            <a-select v-model:value="endSummerMonth" class="custom-select">
              <a-select-option
                v-for="v in 12"
                :key="v"
                :value="v < 10 ? '0' + v : v"
                >{{ v < 10 ? "0" + v : v }}</a-select-option
              >
            </a-select>
            /
            <a-select v-model:value="endSummerDate" class="custom-select">
              <a-select-option
                v-for="v in 31"
                :key="v"
                :value="v < 10 ? '0' + v : v"
                >{{ v < 10 ? "0" + v : v }}</a-select-option
              >
            </a-select>
          </td>
          <td class="tg-0lax">非夏月</td>
        </tr>
        <tr>
          <td class="tg-0lax" rowspan="4">基本<br />電費</td>
          <td class="tg-0lax" colspan="4">經常契約</td>
          <td class="tg-0lax" rowspan="4">每瓩<br />每月</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.summer.contractRegular"
              type="number"
            />
          </td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.noSummer.contractRegular"
              type="number"
            />
          </td>
        </tr>
        <tr>
          <td class="tg-0lax" colspan="4">非夏月契約</td>
          <td class="tg-0lax">-</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.noSummer.contractNonSummer"
              type="number"
            />
          </td>
        </tr>
        <tr>
          <td class="tg-0lax" colspan="4">週六半尖峰契約</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.summer.contractSaturdayHalfPeak"
              type="number"
            />
          </td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.noSummer.contractSaturdayHalfPeak"
              type="number"
            />
          </td>
        </tr>
        <tr>
          <td class="tg-0lax" colspan="4">離峰契約</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.summer.contractOffPeak"
              type="number"
            />
          </td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.noSummer.contractOffPeak"
              type="number"
            />
          </td>
        </tr>
        <tr>
          <td class="tg-0lax" rowspan="9">流動<br />電費</td>
          <td class="tg-0lax" rowspan="4">週一<br />至<br />週五</td>
          <td class="tg-0lax" rowspan="2">尖峰時間</td>
          <td class="tg-0lax">夏月</td>
          <td class="tg-0lax">
            <div
              v-for="(v, i) in weekdayPeak"
              :key="i"
              style="margin-top: 0.5rem"
            >
              <a-time-picker v-model:value="v.StartTime" /> ~
              <a-time-picker v-model:value="v.EndTime" />
              <span
                style="color: red; cursor: pointer"
                @click="delWeekdayPeak(i)"
              >
                刪除
              </span>
            </div>
            <div
              style="cursor: pointer; color: #1890ff; margin-top: 0.5rem"
              @click="addWeekdayPeak()"
            >
              新增時段 +
            </div>
          </td>
          <td class="tg-0lax" rowspan="9">每度</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.summer.weekdaysPeak"
              type="number"
            />
          </td>
          <td class="tg-0lax">-</td>
        </tr>
        <tr>
          <td class="tg-0lax">非夏月</td>
          <td class="tg-0lax">
            <div
              v-for="(v, i) in weekdayNoSummerPeak"
              :key="i"
              style="margin-top: 0.5rem"
            >
              <a-time-picker v-model:value="v.StartTime" /> ~
              <a-time-picker v-model:value="v.EndTime" />
              <span
                style="color: red; cursor: pointer"
                @click="delWeekdayNoSummerPeak(i)"
              >
                刪除
              </span>
            </div>
            <div
              style="cursor: pointer; color: #1890ff; margin-top: 0.5rem"
              @click="addWeekdayNoSummerPeak()"
            >
              新增時段 +
            </div>
          </td>
          <td class="tg-0lax">-</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.noSummer.weekdaysPeak"
              type="number"
            />
          </td>
        </tr>
        <tr>
          <td class="tg-0lax" rowspan="2">離峰時間</td>
          <td class="tg-0lax">夏月</td>
          <td class="tg-0lax">
            <div
              v-for="(v, i) in weekdayOffPeak"
              :key="i"
              style="margin-top: 0.5rem"
            >
              <a-time-picker v-model:value="v.StartTime" /> ~
              <a-time-picker v-model:value="v.EndTime" />
              <span
                style="color: red; cursor: pointer"
                @click="delWeekdayOffPeak(i)"
              >
                刪除
              </span>
            </div>
            <div
              style="cursor: pointer; color: #1890ff; margin-top: 0.5rem"
              @click="addWeekdayOffPeak()"
            >
              新增時段 +
            </div>
          </td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.summer.weekdaysOffPeak"
              type="number"
            />
          </td>
          <td class="tg-0lax">-</td>
        </tr>
        <tr>
          <td class="tg-0lax">非夏月</td>
          <td class="tg-0lax">
            <div
              v-for="(v, i) in weekdayNoSummerOffPeak"
              :key="i"
              style="margin-top: 0.5rem"
            >
              <a-time-picker v-model:value="v.StartTime" /> ~
              <a-time-picker v-model:value="v.EndTime" />
              <span
                style="color: red; cursor: pointer"
                @click="delWeekdayNoSummerOffPeak(i)"
              >
                刪除
              </span>
            </div>
            <div
              style="cursor: pointer; color: #1890ff; margin-top: 0.5rem"
              @click="addWeekdayNoSummerOffPeak()"
            >
              新增時段 +
            </div>
          </td>
          <td class="tg-0lax">-</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.noSummer.weekdaysOffPeak"
              type="number"
            />
          </td>
        </tr>
        <tr>
          <td class="tg-0lax" rowspan="4">週六</td>
          <td class="tg-0lax" rowspan="2">半尖峰時間</td>
          <td class="tg-0lax">夏月</td>
          <td class="tg-0lax">
            <div
              v-for="(v, i) in saturdayHalfPeak"
              :key="i"
              style="margin-top: 0.5rem"
            >
              <a-time-picker v-model:value="v.StartTime" /> ~
              <a-time-picker v-model:value="v.EndTime" />
              <span
                style="color: red; cursor: pointer"
                @click="delSaturdayHalfPeak(i)"
              >
                刪除
              </span>
            </div>
            <div
              style="cursor: pointer; color: #1890ff; margin-top: 0.5rem"
              @click="addSaturdayHalfPeak()"
            >
              新增時段 +
            </div>
          </td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.summer.saturdayHalfPeak"
              type="number"
            />
          </td>
          <td class="tg-0lax">-</td>
        </tr>
        <tr>
          <td class="tg-0lax">非夏月</td>
          <td class="tg-0lax">
            <div
              v-for="(v, i) in saturdayNoSummerHalfPeak"
              :key="i"
              style="margin-top: 0.5rem"
            >
              <a-time-picker v-model:value="v.StartTime" /> ~
              <a-time-picker v-model:value="v.EndTime" />
              <span
                style="color: red; cursor: pointer"
                @click="delSaturdayNoSummerHalfPeak(i)"
              >
                刪除
              </span>
            </div>
            <div
              style="cursor: pointer; color: #1890ff; margin-top: 0.5rem"
              @click="addSaturdayNoSummerHalfPeak()"
            >
              新增時段 +
            </div>
          </td>
          <td class="tg-0lax">-</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.noSummer.saturdayHalfPeak"
              type="number"
            />
          </td>
        </tr>
        <tr>
          <td class="tg-0lax" rowspan="2">離峰時間</td>
          <td class="tg-0lax">夏月</td>
          <td class="tg-0lax">
            <div
              v-for="(v, i) in saturdayOffPeak"
              :key="i"
              style="margin-top: 0.5rem"
            >
              <a-time-picker v-model:value="v.StartTime" /> ~
              <a-time-picker v-model:value="v.EndTime" />
              <span
                style="color: red; cursor: pointer"
                @click="delSaturdayOffPeak(i)"
              >
                刪除
              </span>
            </div>
            <div
              style="cursor: pointer; color: #1890ff; margin-top: 0.5rem"
              @click="addSaturdayOffPeak()"
            >
              新增時段 +
            </div>
          </td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.summer.saturdayOffPeak"
              type="number"
            />
          </td>
          <td class="tg-0lax">-</td>
        </tr>
        <tr>
          <td class="tg-0lax">非夏月</td>
          <td class="tg-0lax">
            <div
              v-for="(v, i) in saturdayNoSummerOffPeak"
              :key="i"
              style="margin-top: 0.5rem"
            >
              <a-time-picker v-model:value="v.StartTime" /> ~
              <a-time-picker v-model:value="v.EndTime" />
              <span
                style="color: red; cursor: pointer"
                @click="delSaturdayNoSummerOffPeak(i)"
              >
                刪除
              </span>
            </div>
            <div
              style="cursor: pointer; color: #1890ff; margin-top: 0.5rem"
              @click="addSaturdayNoSummerOffPeak()"
            >
              新增時段 +
            </div>
          </td>
          <td class="tg-0lax">-</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.noSummer.saturdayOffPeak"
              type="number"
            />
          </td>
        </tr>
        <tr>
          <td class="tg-0lax">週日及<br />離峰日</td>
          <td class="tg-0lax">離峰時間</td>
          <td class="tg-0lax" colspan="2">全日</td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.summer.sundayAndOffDayPeak"
              type="number"
            />
          </td>
          <td class="tg-0lax">
            <a-input
              v-model:value="formState.noSummer.sundayAndOffDayPeak"
              type="number"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </a-form>
</template>
<script src="./main.js"></script>
<style type="text/css">
.tg {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 12px;
}
.tg td {
  border-color: black;
  border-style: solid;
  border-width: 1px;
  font-family: Arial, sans-serif;
  font-size: 12px;
  overflow: hidden;
  word-break: normal;
  white-space: nowrap;
  padding: 4px 6px;
  line-height: 1.2;
}

.tg .tg-0lax {
  text-align: center;
  vertical-align: middle;
}

.custom-select {
  width: 50px;
  font-size: 12px;
}

/* 優化輸入框樣式 */
.tg .ant-input {
  font-size: 12px;
  padding: 2px 4px;
  height: auto;
  min-height: 24px;
}

/* 優化時間選擇器樣式 */
.tg .ant-picker {
  font-size: 12px;
  padding: 2px 4px;
  height: auto;
  min-height: 24px;
}

/* 優化按鈕和連結樣式 */
.tg div {
  margin-top: 0.2rem !important;
  font-size: 11px;
}
</style>
