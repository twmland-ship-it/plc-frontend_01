import { ref, reactive } from "vue";

export function useCore({ gridSize = 0 }) {
  const dragOption = reactive({
    left: 0,
    top: 0,
  });
  const isActiveObject = ref("");
  const firstObj = ref();

  const dropOn = (opt, fabricCanvas) => {
    const offset = {
      left: fabricCanvas.getSelectionElement().getBoundingClientRect().left,
      top: fabricCanvas.getSelectionElement().getBoundingClientRect().top,
    };

    const point = {
      x: opt.e.x - offset.left,
      y: opt.e.y - offset.top,
    };

    const pointerVpt = fabricCanvas.restorePointerVpt(point);
    dragOption.left = pointerVpt.x;
    dragOption.top = pointerVpt.y;
  };
  const selectIn = (e, fabricCanvas) => {
    const isShiftKey = e.e?.shiftKey;
    if (isShiftKey && !firstObj.value) {
      firstObj.value = e.selected[0];
      firstObj.value.set({
        borderColor: "blue",
      });
    }
    const activeObject = fabricCanvas.getActiveObject();
    return activeObject;
  };

  const selectOut = () => {
    if (firstObj.value) {
      firstObj.value.set({
        borderColor: "#FF8000",
      });
      firstObj.value = null;
    }
    isActiveObject.value = false;
  };

  const move = (e) => {
    e.target.set({
      left: Math.round(e.target.left / gridSize) * gridSize,
      top: Math.round(e.target.top / gridSize) * gridSize,
    });
  };

  const scale = (opt, fabricCanvas) => {
    let delta = opt.e.deltaY;
    let zoom = fabricCanvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    fabricCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
    opt.e.preventDefault();
    opt.e.stopPropagation();
  };

  const getContentJson = (fabricCanvas) => {
    return fabricCanvas.toJSON([
      "symbolId",
      "symbolVar",
      "symbolVars",
      "eventData",
      "rule",
      "tagId",
      "tagName",
      "showProperty",
      "id",
    ]);
  };

  return {
    dragOption,
    dropOn,
    firstObj,
    getContentJson,
    isActiveObject,
    move,
    scale,
    selectIn,
    selectOut,
  };
}
