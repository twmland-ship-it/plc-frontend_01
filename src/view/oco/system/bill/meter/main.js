import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  reactive,
  ref,
} from "vue";
import { ActionSpan } from "./style";
import { useStore } from "vuex";
import { Modal, notification } from "ant-design-vue";
import DataTables from "@/components/table/DataTable.vue";
import { usePermission } from "@/composable/permission";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import Notice from "@/components/oco/util/Notice.vue";
export default defineComponent({
  components: { DataTables, TagFilter, Notice },
  setup() {
    const noticeContent = ref(
      "注意!\n  &nbsp;&nbsp;&nbsp;&nbsp;被綁定的測點將會每分鐘記錄一次歷史紀錄，原本的測點設定將會失效"
    );
    onMounted(async () => {
      const res = await dispatch("tags/getTagsRegions");
      regionOptions.value = res;
    });
    const regionOptions = ref([]);
    const { permission } = usePermission();
    const { dispatch } = useStore();

    const modal = ref(false);
    const closeModal = () => {
      modal.value = false;
    };

    const openAddModal = () => {
      Object.assign(settings, settingObj);
      modal.value = true;
      nextTick(() => {
        autofocus.value.focus();
      });
    };

    const openEditModal = (data) => {
      const obj = {
        title: `編輯${data.name}`,
        ...data,
      };
      Object.assign(settings, obj);
      modal.value = true;
      nextTick(() => {
        autofocus.value.focus();
      });
    };

    const columns = [
      { title: "名稱", dataIndex: "name", key: "name" },
      { title: "地區", dataIndex: "region", key: "region" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const contractOptions = computed(() =>
      state.bill.settingListTableData.map((el) => ({
        label: el.name,
        value: el.id,
      }))
    );

    const unitOptions = [
      {
        label: "Mwh",
        value: "Mwh",
      },
      {
        label: "Kwh",
        value: "Kwh",
      },
    ];

    const tableData = computed(() =>
      state.bill.metersTableData.map((el) => {
        return {
          name: el.name,
          region: el.regionName,
          action: (
            <ActionSpan>
              {permission.update && (
                <span onClick={() => openEditModal(el)}>
                  <unicon name="edit"></unicon>
                </span>
              )}
              {permission.delete && (
                <span onClick={() => deleteItem(el.id)}>
                  <unicon name="trash"></unicon>
                </span>
              )}
            </ActionSpan>
          ),
        };
      })
    );

    const autofocus = ref();

    const settingObj = {
      id: null,
      title: "新增電錶",
      name: null,
      region: null,
      contract: null,
      unit: "Kwh",
      power: null,
      electric: null,
    };

    const rules = {
      name: [
        {
          required: true,
          message: "請輸入名稱",
          trigger: "blur",
        },
      ],
      region: [
        {
          required: true,
          message: "請選擇地區",
          trigger: "blur",
        },
      ],
      contract: [
        {
          required: true,
          message: "請選擇契約",
          trigger: "blur",
        },
      ],

      power: [
        {
          required: true,
          message: "請選擇功率點",
          trigger: "blur",
        },
      ],

      electric: [
        {
          required: true,
          message: "請選擇用電量點",
          trigger: "blur",
        },
      ],
    };

    const settings = reactive({});
    const { state } = useStore();

    const loading = computed(() => state.bill.loading);

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

    const setElectric = ({ value }) => {
      settings.electric = value;
    };

    const setPower = ({ value }) => {
      settings.power = value;
    };

    const search = (e) => {
      dispatch("bill/filterMeterTable", e.target.value);
    };

    const saveSetting = async () => {
      try {
        let title;
        if (settings.id) {
          await dispatch("bill/editMeter", settings);
          title = "修改成功";
        } else {
          await dispatch("bill/addMeter", settings);
          title = "新增成功";
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

    const deleteItem = (id) => {
      Modal.confirm({
        title: "確認刪除?",
        okText: "確認",
        cancelText: "取消",
        confirmLoading: loading.value,
        onOk: async () => {
          try {
            await dispatch("bill/deleteMeter", id);
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

    return {
      noticeContent,
      regionOptions,
      permission,
      loading,
      modal,
      openAddModal,
      closeModal,
      columns,
      contractOptions,
      unitOptions,
      tableData,
      autofocus,
      settings,
      rules,
      labelCol,
      wrapperCol,
      setElectric,
      setPower,
      search,
      saveSetting,
    };
  },
});
