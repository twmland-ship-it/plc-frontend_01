import { ref, reactive } from "vue";
export function useToolbox() {
  const canvasWrap = ref(null);
  const toolbox = ref(null); // toolbox ref
  const settingbox = ref(null); // settingbox ref
  const symbolbox = ref(null); // symbolbox ref
  const toolboxOffset = reactive({
    top: 0,
    left: 0,
  });
  const canvasWrapOffset = reactive({
    top: 0,
    left: 0,
  });

  const strokeColor = ref("#ffffff");
  const fillColor = ref("#ffffff");
  const selectTagName = ref("");

  // 拖曳狀態
  const isDragging = ref(false);
  const currentDragElement = ref(null);
  const dragRefName = ref("");

  // 開始拖曳 (mousedown)
  const startDrag = (event, refName) => {
    event.preventDefault();

    let element;
    if (refName === "toolbox") {
      element = toolbox.value;
    } else if (refName === "settingbox") {
      element = settingbox.value;
    } else if (refName === "symbolbox") {
      element = symbolbox.value;
    } else {
      return;
    }

    if (!element) {
      return;
    }

    isDragging.value = true;
    currentDragElement.value = element;
    dragRefName.value = refName;

    canvasWrapOffset.left = canvasWrap.value.getBoundingClientRect().left;
    canvasWrapOffset.top = canvasWrap.value.getBoundingClientRect().top;
    toolboxOffset.left = event.clientX - element.getBoundingClientRect().left;
    toolboxOffset.top = event.clientY - element.getBoundingClientRect().top;

    // 添加全域事件監聽
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  // 滑鼠移動處理 (mousemove)
  const handleMouseMove = (event) => {
    if (!isDragging.value || !currentDragElement.value) {
      return;
    }

    const element = currentDragElement.value;
    const menuWidth = element.offsetWidth;
    const menuHeight = element.offsetHeight;

    let offsetX = event.clientX - canvasWrapOffset.left - toolboxOffset.left;
    let offsetY = event.clientY - canvasWrapOffset.top - toolboxOffset.top;

    // 邊界檢查
    if (offsetX >= canvasWrap.value.offsetWidth - menuWidth) {
      offsetX = canvasWrap.value.offsetWidth - menuWidth;
    }
    if (offsetX <= 0) {
      offsetX = 0;
    }
    if (offsetY >= canvasWrap.value.offsetHeight - menuHeight) {
      offsetY = canvasWrap.value.offsetHeight - menuHeight;
    }
    if (offsetY <= 0) {
      offsetY = 0;
    }

    element.style.left = offsetX + "px";
    element.style.top = offsetY + "px";
  };

  // 結束拖曳 (mouseup)
  const handleMouseUp = () => {
    if (isDragging.value) {
      isDragging.value = false;
      currentDragElement.value = null;
      dragRefName.value = "";

      // 移除全域事件監聽
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };

  // 舊的 handleDrag 函數保留以防需要
  const handleDrag = () => {
    // 這個函數現在不使用，因為 HTML5 drag API 有座標問題
  };

  const cleanup = () => {
    if (isDragging.value) {
      isDragging.value = false;
      currentDragElement.value = null;
      dragRefName.value = "";
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  };

  return {
    canvasWrap,
    strokeColor,
    fillColor,
    selectTagName,
    toolbox,
    settingbox,
    symbolbox,
    startDrag,
    handleDrag,
    handleMouseMove,
    handleMouseUp,
    cleanup,
  };
}
