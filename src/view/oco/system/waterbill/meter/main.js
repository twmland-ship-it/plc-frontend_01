import { computed, defineComponent, onMounted, reactive, ref } from "vue";
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
    };

    const openEditModal = (data) => {
      const obj = {
        title: `編輯${data.name}`,
        ...data,
      };
      Object.assign(settings, obj);
      modal.value = true;
    };

    const columns = [
      { title: "名稱", dataIndex: "name", key: "name" },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];

    const tableData = computed(() =>
      state.waterbill.metersTableData.map((el) => {
        return {
          name: el.name,
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

    const settingObj = {
      id: null,
      title: "新增水錶",
      name: null,
      region: null,
      usage: null,
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

      usage: [
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

    const setUsage = ({ value }) => {
      settings.usage = value;
    };

    const search = (e) => {
      dispatch("waterbill/filterMeterTable", e.target.value);
    };

    const saveSetting = async () => {
      try {
        let title;
        if (settings.id) {
          await dispatch("waterbill/editMeter", settings);
          title = "修改成功";
        } else {
          await dispatch("waterbill/addMeter", settings);
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
            await dispatch("waterbill/deleteMeter", id);
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
      tableData,
      settings,
      rules,
      labelCol,
      wrapperCol,
      setUsage,
      search,
      saveSetting,
    };
  },
});
