import ExcelJS from "exceljs";

export default async function copyAndExportWorkbook({
  rowData,
  rowColumns,
  importFile,
  worksheetName,
  fileName,
}) {
  try {
    const newWorkbook = new ExcelJS.Workbook();

    const addWorksheet = () => {
      let newSheet;
      if (worksheetName) {
        newSheet =
          newWorkbook.getWorksheet(worksheetName) ||
          newWorkbook.addWorksheet(worksheetName);
      } else {
        newSheet = newWorkbook.addWorksheet();
      }

      newSheet.columns = rowColumns;
      newSheet.addRows(rowData);
    };

    const exportFile = async () => {
      addWorksheet();

      const buffer = await newWorkbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${fileName}.xlsx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    if (!importFile) return exportFile();
    const workbook = new ExcelJS.Workbook();
    const reader = new FileReader();
    reader.readAsArrayBuffer(importFile);
    reader.onload = async () => {
      const fileBuffer = reader.result;
      await workbook.xlsx.load(fileBuffer);

      // copy worksheet
      workbook.eachSheet((sheet) => {
        const newSheet = newWorkbook.addWorksheet(sheet.name);

        // 检查工作表是否有列信息，如果没有，则设置默认列宽
        if (sheet.columns) {
          newSheet.columns = sheet.columns.map((column) => {
            return { key: column.key, width: column.width };
          });
        } else {
          newSheet.columns = [{ key: "A", width: 10 }]; // 设置默认列信息
        }

        // 复制工作表的行数据和样式
        const mergeCells = sheet._merges;
        sheet.eachRow((sourceRow, rowNumber) => {
          const destinationRow = newSheet.getRow(rowNumber);
          sourceRow.eachCell(
            { includeEmpty: true },
            (sourceCell, colNumber) => {
              const destinationCell = destinationRow.getCell(colNumber);
              destinationCell.value = sourceCell.value;
              destinationCell.style = sourceCell.style;

              // 处理合并单元格
              if (mergeCells && mergeCells[sourceCell.address]) {
                newSheet.mergeCells(
                  mergeCells[sourceCell.address].model.top,
                  mergeCells[sourceCell.address].model.left,
                  mergeCells[sourceCell.address].model.bottom,
                  mergeCells[sourceCell.address].model.right
                );
              }
            }
          );
        });
      });

      exportFile();
    };
  } catch (error) {
    console.error("复制和导出工作簿时出错：", error);
  }
}
