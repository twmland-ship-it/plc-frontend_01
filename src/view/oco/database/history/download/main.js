import { defineComponent, ref, onMounted, computed } from "vue";
import { useStore } from "vuex";
import { ActionSpan } from "../../../styled";
import DataTables from "@/components/table/DataTable.vue";
export default defineComponent({
  components: { DataTables },
  setup() {
    const { state, dispatch } = useStore();
    onMounted(async () => {
      dispatch("database/getAllHistoryDownload");
    });

    const loading = computed(() => state.bill.loading);
    const columns = [
      { title: "檔案名稱", dataIndex: "name", key: "name" },

      {
        title: "操作",
        dataIndex: "action",
        key: "action",
      },
    ];
    const tableData = computed(() =>
      state.database.historyDownloadTableData.map((el) => {
        return {
          name: el.name,
          action: (
            <ActionSpan>
              <span onClick={() => download(el)}>
                <unicon name="download-alt"></unicon>
              </span>
            </ActionSpan>
          ),
        };
      })
    );
    const download = () => {
      const data = ref("Hello World");
      const blob = new Blob([data.value], { type: "text/plain" });

      // 生成文件 URL
      const url = URL.createObjectURL(blob);

      // 创建 a 标签并触发点击
      const link = document.createElement("a");
      link.href = url;
      link.download = "filename.txt";
      link.click();

      // 释放 URL 对象
      URL.revokeObjectURL(url);
    };

    const search = (e) => {
      dispatch("database/filterHistoryDownload", e.target.value);
    };

    return {
      loading,
      columns,
      tableData,
      download,
      search,
    };
  },
});
