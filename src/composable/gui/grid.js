import { ref } from "vue";
import { fabric } from "fabric";
export function useGrid({ guiWidth, guiHeight, gridId }) {
  let gridGroup;
  const gridSize = 10;
  const gridMode = ref(false);
  const handleGridMode = (status, fabricCanvas) => {
    if (status === false) {
      gridGroup && fabricCanvas.remove(gridGroup);
      gridGroup = null;
      gridMode.value = false;
    } else {
      const gridLines = [];
      for (let i = 0; i < guiWidth / gridSize; i++) {
        gridLines.push(
          new fabric.Line([i * gridSize, 0, i * gridSize, guiHeight], {
            type: "line",
            stroke: "#ccc",
            selectable: false,
          })
        );
      }

      for (let j = 0; j < guiHeight / gridSize; j++) {
        gridLines.push(
          new fabric.Line([0, j * gridSize, guiWidth, j * gridSize], {
            type: "line",
            stroke: "#ccc",
            selectable: false,
          })
        );
      }
      gridGroup = new fabric.Group(gridLines, {
        selectable: false,
        evented: false,
        id: gridId,
      });
      gridGroup.addWithUpdate();
      fabricCanvas.add(gridGroup);
      gridGroup.sendToBack();
      gridMode.value = true;
    }
  };

  return { gridSize, gridMode, handleGridMode };
}
