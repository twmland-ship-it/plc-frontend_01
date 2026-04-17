import { defineComponent, ref, reactive, watch, computed, toRaw } from "vue";
import { useStore } from "vuex";
import DataTables from "@/components/table/DataTable.vue";
import { ActionSpan } from "./style";
import { Modal, notification } from "ant-design-vue";
import { usePermission } from "@/composable/permission";
import HighTwo from "@/components/oco/bill/fee/highTwo/Index.vue";
import HighThree from "@/components/oco/bill/fee/highThree/Index.vue";
import LowVoltageNonTime from "@/components/oco/bill/fee/lowVoltageNonTime/Index.vue";
import dayjs from "dayjs";
export default defineComponent({
  components: { DataTables, HighTwo, HighThree, LowVoltageNonTime },
  setup() {
    const loading = computed(() => state.bill.loading);
    const { permission } = usePermission();
    const { dispatch, state } = useStore();

    const feeOptions = ref([
      {
        value: "1",
        label: "高壓-二段式",
        supply: "HighVoltage",
        segment: 2,
      },
      {
        value: "2",
        label: "高壓-三段式",
        supply: "HighVoltage",
        segment: 3,
      },
      {
        value: "3",
        label: "特高壓-二段式",
        supply: "ExtremeHighVoltage",
        segment: 2,
      },
      {
        value: "4",
        label: "特高壓-三段式",
        supply: "ExtremeHighVoltage",
        segment: 3,
      },
       {
        value: "5",
        label: "低壓非時間",
        supply: "LowVoltage",
        segment: 0,
      }
    ]);
    const fee = ref(null);

    const labelCol = {
      lg: 8,
      md: 9,
      xs: 24,
    };
    const wrapperCol = {
      lg: 16,
      md: 15,
      xs: 24,
    };
    // 動態驗證規則，根據選擇的電價類型決定驗證欄位
    const rules = computed(() => {
      const baseRules = {
        date: [{ required: true, message: "請選擇日期", trigger: "blur" }],
      };

      // 如果是低壓非時間電價
      if (fee.value === "5") {
        return {
          ...baseRules,
          SummerDeviceBasicRate: [
            { required: true, message: "請輸入夏月裝置契約基本電費", trigger: "blur" },
          ],
          NotSummerDeviceBasicRate: [
            { required: true, message: "請輸入非夏月裝置契約基本電費", trigger: "blur" },
          ],
          SummerDemandRegularBasicRate: [
            { required: true, message: "請輸入夏月經常契約基本電費", trigger: "blur" },
          ],
          NotSummerDemandRegularBasicRate: [
            { required: true, message: "請輸入非夏月經常契約基本電費", trigger: "blur" },
          ],
          SummerNonSummerBasicRate: [
            { required: true, message: "請輸入夏月非夏月契約基本電費", trigger: "blur" },
          ],
          NotSummerNonSummerBasicRate: [
            { required: true, message: "請輸入非夏月非夏月契約基本電費", trigger: "blur" },
          ],
          SummerMobilRate: [
            { required: true, message: "請輸入夏月流動電費", trigger: "blur" },
          ],
          NotSummerMobilRate: [
            { required: true, message: "請輸入非夏月流動電費", trigger: "blur" },
          ],
        };
      }

      // 高壓電價的驗證規則
      return {
        ...baseRules,
        contractRegular: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
        contractNonSummer: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
        contractSaturdayHalfPeak: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
        contractOffPeak: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
        weekdaysHalfPeak: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
        weekdaysPeak: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
        weekdaysOffPeak: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
        saturdayHalfPeak: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
        saturdayOffPeak: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
        sundayAndOffDayPeak: [
          { required: true, message: "請輸入金額", trigger: "blur" },
        ],
      };
    });
    const formState = reactive({});

    // 年月選擇相關變數
    const yearMonthModal = ref(false);
    const yearMonthForm = reactive({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1
    });
    const formStateObj = {
      mode: "create",
      title: "新增設定",
      year: 2024,
      month: 1,
      supply: null,
      segment: null,
      weekDay: [],
      saturday: [],
      offPeakDay: [
        {
          PeakType: "OffPeak",
          StartTime: "00:00:00",
          EndTime: "00:00:00",
          UseType: "Default",
        },
      ],
      summerMonth: {
        startDate: "06-01",
        endDate: "09-30",
      },
      // 低壓非時間電價專用欄位
      SummerDeviceBasicRate: 0,
      NotSummerDeviceBasicRate: 0,
      SummerDemandRegularBasicRate: 0,
      NotSummerDemandRegularBasicRate: 0,
      SummerNonSummerBasicRate: 0,
      NotSummerNonSummerBasicRate: 0,
      SummerMobilRate: 0,
      NotSummerMobilRate: 0,
      // 原有的高壓電價欄位
      summer: {
        contractRegular: 0,
        contractNonSummer: 0,
        contractSaturdayHalfPeak: 0,
        contractOffPeak: 0,
        weekdaysPeak: 0,
        weekdaysHalfPeak: 0,
        weekdaysOffPeak: 0,
        saturdayHalfPeak: 0,
        saturdayOffPeak: 0,
        sundayAndOffDayPeak: 0,
      },
      noSummer: {
        contractRegular: 0,
        contractNonSummer: 0,
        contractSaturdayHalfPeak: 0,
        contractOffPeak: 0,
        weekdaysPeak: 0,
        weekdaysHalfPeak: 0,
        weekdaysOffPeak: 0,
        saturdayHalfPeak: 0,
        saturdayOffPeak: 0,
        sundayAndOffDayPeak: 0,
      },
    };
    const columns = [
      {
        title: "時間",
        dataIndex: "date",
        key: "date",
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    watch(
      () => fee.value,
      (val) => {
        const targetFee = feeOptions.value.find((el) => el.value === val);
        dispatch("bill/fetchFeeList", targetFee);
      }
    );

    const tableData = computed(() =>
      state.bill.feeListTableData.map((el) => ({
        date: `${el.Year}-${el.Month}`,
        action: (
          <ActionSpan>
            {permission.update && (
              <span onClick={() => openEditModal(el)}>
                <unicon name="edit"></unicon>
              </span>
            )}
            {permission.delete && (
              <span onClick={() => deleteItem(el)}>
                <unicon name="trash"></unicon>
              </span>
            )}
          </ActionSpan>
        ),
      }))
    );

    const modal = ref(false);
    const openAddModal = () => {
      const { supply, segment } = feeOptions.value.find(
        (el) => el.value === fee.value
      );

      // 如果是低壓非時間電價，先開啟年月選擇 Modal
      if (fee.value === "5") {
        // 重置年月表單
        yearMonthForm.year = new Date().getFullYear();
        yearMonthForm.month = new Date().getMonth() + 1;
        // 暫存 supply 和 segment 資訊
        yearMonthForm.supply = supply;
        yearMonthForm.segment = segment;
        // 開啟年月選擇 Modal
        yearMonthModal.value = true;
      } else {
        // 其他電價類型使用原有邏輯
        Object.assign(formState, formStateObj);
        formState.segment = segment;
        formState.supply = supply;
        modal.value = true;
      }
    };

    // 確認年月選擇，進入詳細設定頁面
    const confirmYearMonth = () => {
      const lowVoltageFormState = {
        mode: "create",
        title: `新增${yearMonthForm.year}-${yearMonthForm.month}`,
        year: yearMonthForm.year,
        month: yearMonthForm.month,
        supply: yearMonthForm.supply,
        segment: yearMonthForm.segment,
        temporaryMultiplier: 1.0,
        summerMonth: {
          startDate: "06-01",
          endDate: "09-30",
        },
        summer: {
          deviceContract: '',
          demandContractRegular: '',
          demandContractNonSummer: '',
          mobileRate: ''
        },
        noSummer: {
          deviceContract: '',
          demandContractRegular: '',
          demandContractNonSummer: '',
          mobileRate: ''
        }
      };

      Object.assign(formState, lowVoltageFormState);
      yearMonthModal.value = false;
      modal.value = true;
    };

    // 取消年月選擇
    const cancelYearMonth = () => {
      yearMonthModal.value = false;
    };

    // 處理低壓非時間電價組件的更新事件
    const handleLowVoltageUpdate = (newValue) => {
      // 使用 Object.assign 來更新響應式對象
      Object.assign(formState, newValue);
    };

    const openEditModal = async ({ Year, Month }) => {
      const { supply, segment } = feeOptions.value.find(
        (el) => el.value === fee.value
      );

      const res = await dispatch("bill/fetchFeeDetail", {
        year: Year,
        month: Month,
        supply,
        segment,
      });

      // 如果是低壓非時間電價，使用專用的編輯邏輯
      if (fee.value === "5") {
        // 從 DetailItems 中分離夏月和非夏月資料
        const summerItem = res.DetailItems?.find(item => item.IsSummer === true) || {};
        const nonSummerItem = res.DetailItems?.find(item => item.IsSummer === false) || {};

        const obj = {
          mode: "edit",
          title: `編輯${Year}-${Month}`,
          year: Year,
          month: Month,
          supply,
          segment,
          temporaryMultiplier: res.TemporaryUsageMultiplier ? parseFloat(res.TemporaryUsageMultiplier) : 1.0,
          summerMonth: {
            startDate: res.SummerMonth?.StartDate || "06-01",
            endDate: res.SummerMonth?.EndDate || "09-30",
          },
          summer: {
            deviceContract: summerItem.BasicRateDeviceContractByDevice || '',
            demandContractRegular: summerItem.DemandContractRegular || '',
            demandContractNonSummer: summerItem.DemandContractNonSummer || '',
            mobileRate: summerItem.MobileRateWeekdaysPeak || ''
          },
          noSummer: {
            deviceContract: nonSummerItem.BasicRateDeviceContractByDevice || '',
            demandContractRegular: nonSummerItem.DemandContractRegular || '',
            demandContractNonSummer: nonSummerItem.DemandContractNonSummer || '',
            mobileRate: nonSummerItem.MobileRateWeekdaysPeak || ''
          }
        };

        Object.assign(formState, obj);
        modal.value = true;
        return;
      }

      const {
        WeekDays: weekDay,
        Saturday: saturday,
        OffPeakDay: offPeakDay,
      } = res.PeakTimeRanges;

      const { StartDate: startDate, EndDate: endDate } = res.SummerMonth || {
        startDate: "01-01",
        endDate: "12-31",
      };

      const {
        RateId: summerRateId,
        DemandContractRegular: summerDemandContractRegular,
        DemandContractNonSummer: summerDemandContractNonSummer,
        DemandContractSaturdayHalfPeak: summerDemandContractSaturdayHalfPeak,
        DemandContractOffPeak: summerDemandContractOffPeak,
        MobileRateWeekdaysPeak: summerMobileRateWeekdaysPeak,
        MobileRateWeekdaysHalfPeak: summerMobileRateWeekdaysHalfPeak,
        MobileRateWeekdaysOffPeak: summerMobileRateWeekdaysOffPeak,
        MobileRateSaturdayHalfPeak: summerMobileRateSaturdayHalfPeak,
        MobileRateSaturdayOffPeak: summerMobileRateSaturdayOffPeak,
        MobileRateSundayAndOffDayPeak: summerMobileRateSundayAndOffDayPeak,
      } = res.DetailItems.find((el) => el.IsSummer);
      const {
        RateId: noSummerRateId,
        DemandContractRegular: noSummerDemandContractRegular,
        DemandContractNonSummer: noSummerDemandContractNonSummer,
        DemandContractSaturdayHalfPeak: noSummerDemandContractSaturdayHalfPeak,
        DemandContractOffPeak: noSummerDemandContractOffPeak,
        MobileRateWeekdaysPeak: noSummerMobileRateWeekdaysPeak,
        MobileRateWeekdaysHalfPeak: noSummerMobileRateWeekdaysHalfPeak,
        MobileRateWeekdaysOffPeak: noSummerMobileRateWeekdaysOffPeak,
        MobileRateSaturdayHalfPeak: noSummerMobileRateSaturdayHalfPeak,
        MobileRateSaturdayOffPeak: noSummerMobileRateSaturdayOffPeak,
        MobileRateSundayAndOffDayPeak: noSummerMobileRateSundayAndOffDayPeak,
      } = res.DetailItems.find((el) => !el.IsSummer);
      const obj = {
        mode: "edit",
        title: `編輯${Year}-${Month}`,
        year: Year,
        month: Month,
        weekDay: weekDay
          ? weekDay.map((el) => ({
              ...el,
              StartTime: dayjs(el.StartTime, "HH:mm:ss"),
              EndTime: dayjs(el.EndTime, "HH:mm:ss"),
            }))
          : [],
        saturday: saturday
          ? saturday.map((el) => ({
              ...el,
              StartTime: dayjs(el.StartTime, "HH:mm:ss"),
              EndTime: dayjs(el.EndTime, "HH:mm:ss"),
            }))
          : [],
        offPeakDay,
        summerMonth: {
          startDate,
          endDate,
        },
        supply,
        segment,
        summer: {
          rateId: summerRateId,
          contractRegular: summerDemandContractRegular,
          contractNonSummer: summerDemandContractNonSummer,
          contractSaturdayHalfPeak: summerDemandContractSaturdayHalfPeak,
          contractOffPeak: summerDemandContractOffPeak,
          weekdaysPeak: summerMobileRateWeekdaysPeak,
          weekdaysHalfPeak: summerMobileRateWeekdaysHalfPeak,
          weekdaysOffPeak: summerMobileRateWeekdaysOffPeak,
          saturdayHalfPeak: summerMobileRateSaturdayHalfPeak,
          saturdayOffPeak: summerMobileRateSaturdayOffPeak,
          sundayAndOffDayPeak: summerMobileRateSundayAndOffDayPeak,
        },
        noSummer: {
          rateId: noSummerRateId,
          contractRegular: noSummerDemandContractRegular,
          contractNonSummer: noSummerDemandContractNonSummer,
          contractSaturdayHalfPeak: noSummerDemandContractSaturdayHalfPeak,
          contractOffPeak: noSummerDemandContractOffPeak,
          weekdaysPeak: noSummerMobileRateWeekdaysPeak,
          weekdaysHalfPeak: noSummerMobileRateWeekdaysHalfPeak,
          weekdaysOffPeak: noSummerMobileRateWeekdaysOffPeak,
          saturdayHalfPeak: noSummerMobileRateSaturdayHalfPeak,
          saturdayOffPeak: noSummerMobileRateSaturdayOffPeak,
          sundayAndOffDayPeak: noSummerMobileRateSundayAndOffDayPeak,
        },
      };

      Object.assign(formState, obj);
      modal.value = true;
    };

    const closeModal = () => {
      modal.value = false;
    };

    const deleteItem = ({ Year, Month }) => {
      const { supply, segment } = feeOptions.value.find(
        (el) => el.value === fee.value
      );
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("bill/deleteFee", {
              year: Year,
              month: Month,
              supply,
              segment,
            });
            Modal.success({
              content: "刪除成功",
            });
          } catch (err) {
            Modal.error({
              title: "發生錯誤",
              content: err.message,
            });
          }
        },
      });
    };

    const submit = async () => {
      try {
        let title;
        const rawFormState = toRaw(formState);

        // 確保 temporaryMultiplier 保持數值類型
        if (rawFormState.temporaryMultiplier !== undefined) {
          rawFormState.temporaryMultiplier = parseFloat(rawFormState.temporaryMultiplier) || 1.0;
        }

        // 檢查是否為低壓非時間電價
        if (fee.value === "5") {
          // 低壓非時間電價使用專用的 action
          if (formState.mode === "create") {
            await dispatch("bill/addLowVoltageNonTimeFee", rawFormState);
            title = "新增成功";
          } else {
            await dispatch("bill/editLowVoltageNonTimeFee", rawFormState);
            title = "修改成功";
          }
        } else {
          // 其他電價類型使用原有的 action
          if (formState.mode === "create") {
            await dispatch("bill/addFee", rawFormState);
            title = "新增成功";
          } else {
            await dispatch("bill/editFee", rawFormState);
            title = "修改成功";
          }
        }

        modal.value = false;
        notification.success({
          message: title,
        });
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    return {
      loading,
      columns,
      fee,
      labelCol,
      wrapperCol,
      rules,
      formState,
      feeOptions,
      tableData,
      modal,
      yearMonthModal,
      yearMonthForm,
      openAddModal,
      confirmYearMonth,
      cancelYearMonth,
      handleLowVoltageUpdate,
      closeModal,
      submit,
    };
  },
});
