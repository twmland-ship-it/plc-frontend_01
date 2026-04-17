import { ref, computed } from "vue";
import { useCore } from "@/composable/gui/core";
export function useHistory({ gridId }) {
  const { getContentJson } = useCore({});
  const isRedoing = ref(false);
  const history = ref([]);
  const historyIndex = ref(-1);
  const canUndo = computed(() => historyIndex.value > 0);
  const canRedo = computed(() => historyIndex.value < history.value.length - 1);

  const resetHistory = (fabricCanvas) => {
    const canvasAsJson = JSON.stringify(getContentJson(fabricCanvas));
    history.value = [canvasAsJson];
    historyIndex.value = 0;
  };

  const historySaveAction = (fabricCanvas) => {
    if (fabricCanvas && !isRedoing.value) {
      const canvasAsJson = JSON.stringify(getContentJson(fabricCanvas));
      history.value.splice(historyIndex.value + 1);
      history.value.push(canvasAsJson);
      historyIndex.value = history.value.length - 1;
    }
  };

  const historyState = (index, fabricCanvas) => {
    return new Promise((resolve) => {
      if (canUndo.value || canRedo.value) {
        isRedoing.value = true;
        var parsedJson = JSON.parse(history.value[index]);
        var filteredObjects = parsedJson.objects.filter(
          (obj) => obj.id !== gridId
        );

        parsedJson.objects = filteredObjects;
        fabricCanvas.loadFromJSON(parsedJson, () => {
          historyIndex.value = index;
          isRedoing.value = false;
          resolve();
        });
      }
    });
  };

  return {
    canRedo,
    canUndo,
    history,
    historyIndex,
    historySaveAction,
    historyState,
    resetHistory,
    isRedoing,
  };
}
