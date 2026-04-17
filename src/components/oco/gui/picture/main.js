import {
  ref,
  defineComponent,
  onMounted,
  reactive,
  computed,
  toRaw,
  onBeforeUnmount,
  provide,
  watch,
} from "vue";
import { fabric } from "fabric";
import { DiagramWrap } from "./style";
import { faUndo, faRedo } from "@fortawesome/free-solid-svg-icons";
import { Modal, notification } from "ant-design-vue";
import TagFilter from "@/components/oco/form/tagFilter/Index.vue";
import RuleForm from "@/components/oco/gui/picture-rule-setting/Index.vue";
import trendChart from "@/components/oco/gui/trend/Index.vue";
import cctvStream from "@/components/oco/util/cctvModal/Index.vue";
import { useStore } from "vuex";
import EventForm from "@/components/oco/gui/picture-event-setting/Index.vue";
import router from "@/routes/protectedRoute";
// import { useMqtt } from "@/composable/mqtt.js";
import { useTagSignalConnection } from "@/composable/tagSignalConnection";
import { useGrid } from "@/composable/gui/grid";
import { useToolbox } from "@/composable/gui/toolbox";
import { allEnableProps } from "@/composable/options";
import { useUpdate } from "@/composable/gui/update";
import { useHistory } from "@/composable/gui/history";
import { useSymbol } from "@/composable/gui/symbol";
import { useMenu } from "@/composable/gui/menu";
import {
  useToGroup,
  useUnGroup,
  useCopy,
  useRemove,
  useAlign,
  useForward,
  useBackwards,
  useFront,
  useBack,
  setElementFill,
  setElementStroke,
} from "@/composable/gui/operate";
import {
  useAddText,
  useAddTextBox,
  useAddRect,
  useAddTriangle,
  useAddCircle,
  useAddItem,
  useAddBgImage,
  useAddImage,
  useAddLine,
  useAddSymbol,
} from "@/composable/gui/graphic";
import { usePermission } from "@/composable/permission";
import { useCore } from "@/composable/gui/core";
import { useTagInfo } from "@/composable/tagInfo";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

/** 比對用：略過選取輔助框等會觸發 object:modified 但不代表內容變更的屬性 */
function stripObjectForCompare(obj) {
  if (obj == null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stripObjectForCompare);
  const {
    borderColor: _borderColor,
    cornerColor: _cornerColor,
    cornerSize: _cornerSize,
    cornerStyle: _cornerStyle,
    transparentCorners: _transparentCorners,
    borderDashArray: _borderDashArray,
    borderOpacity: _borderOpacity,
    cornerStrokeColor: _cornerStrokeColor,
    padding: _padding,
    ...rest
  } = obj;
  if (rest.objects) {
    rest.objects = rest.objects.map(stripObjectForCompare);
  }
  return rest;
}

/** 穩定序列化（鍵排序），避免 JSON.stringify 因鍵順序不同誤判 */
function stableStringify(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(stableStringify).join(",") + "]";
  const keys = Object.keys(v).sort();
  return "{" + keys.map((k) => JSON.stringify(k) + ":" + stableStringify(v[k])).join(",") + "}";
}

function normalizeObjectsForDirty(objs) {
  return stableStringify(stripObjectForCompare(objs || []));
}

export default defineComponent({
  components: {
    DiagramWrap,
    TagFilter,
    RuleForm,
    trendChart,
    EventForm,
    cctvStream,
  },
  setup() {
    const { permission } = usePermission();
    const { state, dispatch } = useStore();
    const loading = computed(() => state.gui.loading);
    const mode = ref("view");
    /** 正在從 JSON 還原畫布（含 undo/redo／模式切換），此時不寫入 undo 堆疊 */
    const applyingCanvasSnapshot = ref(false);
    const guiLoading = ref(false);

    const confirmLeave = () => {
      return new Promise((resolve) => {
        Modal.confirm({
          title: "確認",
          content: "將不會儲存您的更改，確定要離開嗎?",
          onOk() {
            resolve(true);
          },
          onCancel() {
            resolve(false);
          },
        });
      });
    };

    let modeOptions = [
      {
        value: "view",
        label: "檢視模式",
      },
    ];
    if (permission.update) {
      modeOptions.push({
        value: "edit",
        label: "編輯模式",
      });
    }

    const activeKey = ref(["1", "2", "3", "4"]);
    const showCollapse = ref(true);

    const svgIcons = ref([
      "lightblub",
      "fan",
      "cctv",
      "monitor",
      "generator",
      "temperature",
      "battery",
      "pipe1",
      "pipe2",
      "tank",
      "valve",
      "pump",
    ]);

    const customImgs = computed(() =>
      state.gui.customIcon.map((el) => ({
        ...el,
        Content: /^https?:\/\//i.test(el.Content)
          ? el.Content
          : `/imgApi/${el.Content}`,
      }))
    );
    const symbols = computed(() => state.gui.symbols);

    // signalR
    const parsePageTagPayload = (sourceData) => {
      try {
        const root = typeof sourceData === "string" ? JSON.parse(sourceData) : sourceData;
        const pageTagJson = root?.PageTagJson;
        if (!pageTagJson) return [];
        return typeof pageTagJson === "string" ? JSON.parse(pageTagJson) : pageTagJson;
      } catch (err) {
        console.warn("[PageTag] parse payload failed:", err?.message || err);
        return [];
      }
    };
    let pendingTagRaf = null;
    let latestTagSources = null;

    const tagSignalCallback = (sourceData) => {
      if (!fabricCanvas || typeof fabricCanvas.getObjects !== "function") return;
      latestTagSources = parsePageTagPayload(sourceData);
      if (pendingTagRaf) return;
      pendingTagRaf = requestAnimationFrame(() => {
        pendingTagRaf = null;
        if (!latestTagSources || !fabricCanvas) return;
        const allTags = fabricCanvas.getObjects();
        updateAllTag(latestTagSources, allTags);
        fabricCanvas.renderAll();
        latestTagSources = null;
      });
    };

    const tagConnection = ref();

    onBeforeUnmount(() => {
      toolboxCleanup();
      tagConnection.value && tagConnection.value.cleanup();
      document.removeEventListener("contextmenu", stopRightClickEvent);
      if (fabricCanvas) {
        try { fabricCanvas.dispose(); } catch { /* ignore */ }
        fabricCanvas = null;
      }
    });

    const canvas = ref(null);
    const guiWidth = 1600;
    const guiHeight = 780;
    const canvasString = ref({});
    /** 編輯態「已對齊 Fabric」的基準指紋；勿與 canvasString 直接字串比對（伺服器 JSON 與 toJSON 常不一致） */
    const lastSavedObjectsFingerprint = ref("");

    let fabricCanvas; // can't use proxy state or object can't be edit first time

    onMounted(async () => {
      await dispatch("gui/getOptions");

      canvasString.value = await setCanvasString(symbols.value);
      // 控制外框
      fabric.Object.prototype.cornerColor = "#FF8000";
      fabric.Object.prototype.borderColor = "#FF8000";

      //initial
      fabricCanvas = new fabric.Canvas(canvas.value, {
        allowTouchScrolling: true,
        fireRightClick: true,
        stopContextMenu: true,
        selection: false,
        wrapperEl: ".canvas-wrap",
      });

      fabricCanvas.setWidth(guiWidth);
      fabricCanvas.setHeight(guiHeight);

      applyingCanvasSnapshot.value = true;
      fabricCanvas.loadFromJSON(
        canvasString.value,
        () => {
          applyingCanvasSnapshot.value = false;
          fabricCanvas.renderAll.bind(fabricCanvas);
          registerFabricEvents();
        },
        (o, object) => {
          if (!object) return;
          setNormalStyle(object);
          setAdditionProperty(object);
          object.set("selectable", false);
        }
      );

      const pageId = computed(() => state.gui.guiDetail.ItemId);
      const { connection: tagConn, cleanup, refreshTenantBinding } = useTagSignalConnection(
        pageId,
        tagSignalCallback
      );
      tagConnection.value = { start: () => tagConn.start(), stop: () => tagConn.stop(), cleanup };

      watch(pageId, async (nextPageId, previousPageId) => {
        if (!nextPageId || nextPageId === previousPageId) {
          return;
        }

        await refreshTenantBinding(pageId);
      });
    });

    const gridId = "gridGroup";
    const { gridSize, gridMode, handleGridMode } = useGrid({
      guiWidth,
      guiHeight,
      gridId,
    });

    const {
      dragOption,
      dropOn,
      firstObj,
      getContentJson,
      isActiveObject,
      move,
      scale,
      selectIn,
      selectOut,
    } = useCore({ gridSize });

    const captureEditBaseline = () => {
      if (!fabricCanvas || mode.value !== "edit") return;
      try {
        const objs = getContentJson(fabricCanvas).objects || [];
        lastSavedObjectsFingerprint.value = normalizeObjectsForDirty(objs);
      } catch {
        /* ignore */
      }
    };

    /** 與進入編輯／上次儲存或還原後擷取的基準比對，避免 canvasString 與 Fabric 序列化差異誤判 */
    const isEditDirty = () => {
      if (mode.value !== "edit" || !fabricCanvas) return false;
      if (applyingCanvasSnapshot.value) return false;
      if (!lastSavedObjectsFingerprint.value) return false;
      try {
        const cur = normalizeObjectsForDirty(getContentJson(fabricCanvas).objects || []);
        const dirty = cur !== lastSavedObjectsFingerprint.value;
        return dirty;
      } catch {
        return false;
      }
    };

    const {
      canvasWrap,
      toolbox,
      strokeColor,
      fillColor,
      selectTagName,
      settingbox,
      symbolbox,
      startDrag,
      handleDrag,
      cleanup: toolboxCleanup,
    } = useToolbox();

    const { menuRef, rightClickMenu, menuPosition, setMenuStatus } = useMenu({
      canvasWrap,
    });

    const {
      updateAllTag,
      setNormalStyle,
      setCanvasString,
      setAdditionProperty,
    } = useUpdate();

    const handleSelectIn = (e) => {
      const activeObject = selectIn(e, fabricCanvas);
      isActiveObject.value = activeObject.symbolId
        ? "symbol"
        : activeObject._objects
        ? "group"
        : "normal";

      if (isActiveObject.value === "symbol") {
        selectSymbolList.value = activeObject.symbolVars;
        strokeColor.value = "#ffffff";
        fillColor.value = "#ffffff";
        selectTagName.value = "選擇單一元件以編輯";
      } else if (isActiveObject.value === "group") {
        selectSymbolVar.value = "無";
        strokeColor.value = "#ffffff";
        fillColor.value = "#ffffff";
        selectTagName.value = "選擇單一元件以編輯";
      } else {
        selectSymbolVar.value = activeObject.symbolVar || "無";
        selectTagName.value = activeObject.tagName || "無";
        strokeColor.value = activeObject.stroke;
        fillColor.value = activeObject.fill;
      }
    };

    const handleSelectOut = () => {
      selectOut();
      strokeColor.value = "#ffffff";
      fillColor.value = "#ffffff";
      selectTagName.value = "";
      isActiveObject.value = null;
    };

    const handleScale = (opt) => {
      scale(opt, fabricCanvas);
    };

    const handleMove = (e) => {
      move(e);
    };

    const handleDrop = (e) => {
      dropOn(e, fabricCanvas);
    };

    const runEvent = async (e) => {
      if (mode.value === "view" && e.target && e.target.eventData) {
        const eventtype = e.target.eventData.eventType;
        switch (eventtype) {
          case 2: // send signal by default settings
            Modal.confirm({
              title: "確認送出訊號?",
              okText: "確認",
              cancelText: "取消",
              onOk: async () => {
                await dispatch(
                  "gui/sendTagSignal",
                  e.target.eventData.eventTagsData
                );
                notification.success({
                  message: "送出成功",
                });
              },
            });
            break;
          case 3: // send signal by user
            currTagName.value = e.target.eventData.eventTargetTagName;
            currTagId.value = e.target.eventData.eventTargetTagId;
            inputValue.value = null;
            inputModal.value = true;
            break;
          case 4: // redirect to link
            router.push({
              name: "gui-main",
              params: {
                id: e.target.eventData.link,
              },
            });
            break;
          default:
            break;
        }
      }
    };

    const stopRightClickEvent = (event) => {
      event.preventDefault();
    };
    // hide default right click menu
    const disableContextMenu = () => {
      document.addEventListener("contextmenu", stopRightClickEvent);
    };

    const handleMouseUp = (opt) => {
      if (fabricCanvas.isDragging) {
        // stop drag
        fabricCanvas.setViewportTransform(fabricCanvas.viewportTransform);
        fabricCanvas.isDragging = false;
        if (mode.value === "edit") {
          fabricCanvas.selection = true;
        }
      }

      const currObj = fabricCanvas.getActiveObject();
      if (
        opt.button === 3 &&
        isActiveObject.value &&
        opt.target === currObj &&
        mode.value === "edit"
      ) {
        // show menu
        disableContextMenu();
        setMenuStatus(opt, true);
      } else if (
        opt.button === 3 &&
        mode.value === "view" &&
        opt.target &&
        opt.target.tagId
      ) {
        // show trend and cctv
        disableContextMenu();
        currTagId.value = opt.target.tagId;
        currTagName.value = opt.target.tagName;
        const cctvs = useTagInfo(opt.target.tagId, "CctvList");
        currCCTV.value = cctvs ? cctvs.map((el) => el.Id) : [];
        infoTab.value = "1";
        infoModal.value = true;
      } else {
        // hide menu
        setMenuStatus(false);
      }
    };

    const handleMouseDown = (opt) => {
      if (opt.e.changedTouches) {
        fabricCanvas.isDragging = true;
        fabricCanvas.selection = false;
        const evt = opt.e.changedTouches;
        fabricCanvas.lastPosX = evt[0].clientX;
        fabricCanvas.lastPosY = evt[0].clientY;
      } else if (opt.e.altKey && opt.button === 1) {
        fabricCanvas.isDragging = true;
        fabricCanvas.selection = false;
        const evt = opt.e;
        fabricCanvas.lastPosX = evt.clientX;
        fabricCanvas.lastPosY = evt.clientY;
      }
    };

    const handleMouseMove = (opt) => {
      if (fabricCanvas.isDragging) {
        if (opt.e.changedTouches) {
          const vpt = fabricCanvas.viewportTransform;
          const e = opt.e.changedTouches;
          vpt[4] += e[0].clientX - fabricCanvas.lastPosX;
          vpt[5] += e[0].clientY - fabricCanvas.lastPosY;
          fabricCanvas.requestRenderAll();
          fabricCanvas.lastPosX = e[0].clientX;
          fabricCanvas.lastPosY = e[0].clientY;
        } else if (opt.e.altKey && opt.button === 1) {
          const vpt = fabricCanvas.viewportTransform;
          const e = opt.e;
          vpt[4] += e.clientX - fabricCanvas.lastPosX;
          vpt[5] += e.clientY - fabricCanvas.lastPosY;
          fabricCanvas.requestRenderAll();
          fabricCanvas.lastPosX = e.clientX;
          fabricCanvas.lastPosY = e.clientY;
        }
      }
    };

    onBeforeRouteUpdate(async () => {
      if (mode.value === "edit" && isEditDirty()) {
        const res = await confirmLeave();
        if (!res) {
          return false;
        }
      }
    });

    onBeforeRouteLeave(async () => {
      if (mode.value === "edit" && isEditDirty()) {
        const res = await confirmLeave();
        if (!res) {
          return false;
        }
      }
    });

    const setViewMode = () => {
      setTimeout(() => {
        applyingCanvasSnapshot.value = true;
        fabricCanvas.loadFromJSON(
          canvasString.value,
          () => {
            applyingCanvasSnapshot.value = false;
            tagConnection.value.start();
            guiLoading.value = false;
            fabricCanvas.isDrawingMode = false;
            drawMode.value = false;
            symbolMode.value = false;
          },
          (o, object) => {
            setNormalStyle(object);
            setAdditionProperty(object);
            object.set("selectable", false);
            fabricCanvas.selection = false;
          }
        );
      }, 50);
    };

    const setEditMode = () => {
      setTimeout(() => {
        applyingCanvasSnapshot.value = true;
        fabricCanvas.loadFromJSON(canvasString.value, () => {
          applyingCanvasSnapshot.value = false;
          tagConnection.value.stop();
          guiLoading.value = false;
          rightClickMenu.value = false;
          fabricCanvas.isDrawingMode = false;
          drawMode.value = false;
          handleGridMode(false, fabricCanvas);
          symbolMode.value = false;
          fabricCanvas.selectionFullyContained = true;
          fabricCanvas.selection = true;
          resetHistory(fabricCanvas);
          captureEditBaseline();
        });
      }, 200);
    };

    const setMode = (newMode) => {
      if (mode.value === newMode) return;

      // 檢查編輯權限
      if (newMode === "edit" && !permission.update) {
        Modal.warning({
          title: "權限不足",
          content: "您沒有編輯此頁面的權限",
        });
        return;
      }

      if (newMode === "view") {
        if (!isEditDirty()) {
          if (canvasString.value) guiLoading.value = true;
          setViewMode();
          mode.value = "view";
          return;
        }
        Modal.confirm({
          title: "確認",
          content: "未儲存的部分將會丟失，確定要繼續嗎?",
          onOk() {
            if (canvasString.value) guiLoading.value = true;
            setViewMode();
            mode.value = "view";
          },
        });
      } else {
        if (canvasString.value) guiLoading.value = true;
        setEditMode();
        mode.value = "edit";
      }
    };

    const setGridMode = () => {
      const status = gridMode.value ? false : true;
      handleGridMode(status, fabricCanvas);
    };

    const drawMode = ref(false);
    const handleDrawMode = () => {
      if (drawMode.value) {
        drawMode.value = false;
        rightClickMenu.value = false;
        fabricCanvas.isDrawingMode = false;
      } else {
        drawMode.value = true;
        fabricCanvas.isDrawingMode = true;
      }
    };

    const {
      history,
      historyIndex,
      canUndo,
      canRedo,
      historySaveAction,
      historyState,
      resetHistory,
      isRedoing,
    } = useHistory({ gridId });

    const setHistory = async () => {
      historySaveAction(fabricCanvas);
      if (
        mode.value !== "edit" ||
        applyingCanvasSnapshot.value ||
        isRedoing.value
      ) {
        return;
      }
    };

    const registerFabricEvents = () => {
      if (!fabricCanvas) return;
      fabricCanvas.on({
        drop: (e) => handleDrop(e, fabricCanvas),
        "selection:updated": handleSelectIn,
        "selection:created": handleSelectIn,
        "selection:cleared": handleSelectOut,
        "object:added": (e) => {
          if (e.target?.id !== gridId) setHistory();
        },
        "object:removed": (e) => {
          if (e.target?.id !== gridId) setHistory();
        },
        "object:modified": setHistory,
        "object:moving": handleMove,
        "path:created": setHistory,
        "mouse:dblclick": runEvent,
        "mouse:wheel": handleScale,
        "mouse:up": handleMouseUp,
        "mouse:down": handleMouseDown,
        "mouse:move": handleMouseMove,
      });
    };

    const toHistory = async (index) => {
      applyingCanvasSnapshot.value = true;
      try {
        if (gridMode.value) {
          setGridMode();
          await historyState(index, fabricCanvas);
          setGridMode();
        } else {
          await historyState(index, fabricCanvas);
        }
      } finally {
        applyingCanvasSnapshot.value = false;
      }
    };

    const saveCanvas = async () => {
      try {
        // clear grid
        handleGridMode(false, fabricCanvas);
        const canvasAsJson = getContentJson(fabricCanvas);
        const getAllTags = (source) => {
          source.forEach((el) => {
            if (el.objects) {
              getAllTags(el.objects);
            } else {
              el.tagId && !el.showProperty && allTagList.push(el.tagId);
            }
          });
        };
        const allTagList = [];
        getAllTags(canvasAsJson.objects);
        await dispatch("gui/saveGuiPicture", {
          allTagList: [...new Set(allTagList)],
          data: JSON.stringify(canvasAsJson),
        });
        notification.success({
          message: "儲存成功",
        });
        canvasString.value = await setCanvasString(symbols.value);
        captureEditBaseline();
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const clearCanvas = () => {
      Modal.confirm({
        title: "確認清空?",
        okText: "確認",
        cancelText: "取消",
        onOk: () => {
          fabricCanvas.clear();
        },
      });
    };

    // graphic
    const onDragend = (type) => {
      switch (type) {
        case "line":
          useAddLine(fabricCanvas, dragOption);
          break;
        case "text":
          useAddText(fabricCanvas, dragOption);
          break;
        case "textbox":
          useAddTextBox(fabricCanvas, dragOption);
          break;
        case "rect":
          useAddRect(fabricCanvas, dragOption);
          break;
        case "circle":
          useAddCircle(fabricCanvas, dragOption);
          break;
        case "triangle":
          useAddTriangle(fabricCanvas, dragOption);
          break;
      }
    };

    const onClick = (type) => {
      const position = {
        left: 0,
        top: 0,
      };
      switch (type) {
        case "line":
          useAddLine(fabricCanvas, position);
          break;
        case "text":
          useAddText(fabricCanvas, position);
          break;
        case "textbox":
          useAddTextBox(fabricCanvas, position);
          break;
        case "rect":
          useAddRect(fabricCanvas, position);
          break;
        case "circle":
          useAddCircle(fabricCanvas, position);
          break;
        case "triangle":
          useAddTriangle(fabricCanvas, position);
          break;
      }
    };

    const onSVGDragend = (e) => {
      addItem(e, dragOption);
    };

    const onCustomDragend = (e, type) => {
      if (type === "svg") {
        addItem(e, dragOption);
      } else {
        addImage(e, dragOption);
      }
    };

    const onSymbolDragend = (e, data) => {
      addSymbol(e, data, dragOption);
    };

    const addItem = (e, dragOption) => {
      useAddItem(fabricCanvas, e, dragOption);
    };

    const addImage = (e, dragOption) => {
      useAddImage(fabricCanvas, e, dragOption);
    };

    const addSymbol = (e, data, dragOption) => {
      useAddSymbol(fabricCanvas, e, data, dragOption);
    };

    // bg image
    const fileInput = ref(null);
    const openFileInput = () => {
      fileInput.value.click();
    };
    const addBgImage = (event) => {
      useAddBgImage(fabricCanvas, event);
    };

    // upload img
    const imgFileInput = ref(null);
    const openImgFileInput = () => {
      imgFileInput.value.click();
    };

    const uploadCustomImg = (event) => {
      const file = event.target.files[0];
      const ext = file.name.substring(file.name.lastIndexOf(".") + 1);
      const supportExt = ["jpg", "png", "jpeg", "svg"];
      if (!supportExt.includes(ext)) {
        Modal.error({
          content: "不支持" + ext + "格式文件",
        });
        return;
      }
      const reader = new FileReader();
      reader.onload = async function (f) {
        try {
          const url = f.target.result;
          await dispatch("gui/addCustomImg", url);
          notification.success({
            message: "上傳圖片成功",
          });
        } catch {
          Modal.error({
            content: "上傳圖片失敗",
          });
        }
      };
      reader.readAsDataURL(file);
    };

    // info modal
    const infoModal = ref(false);
    const currTagId = ref(null);
    const currTagName = ref(null);
    const currCCTV = ref([]);
    const infoTab = ref("1");
    const closeInfoModal = () => {
      infoModal.value = false;
    };

    // input signal modal
    const inputModal = ref(false);
    const inputValue = ref(null);
    const closeInputModal = () => {
      inputModal.value = false;
    };
    const sendSignal = async () => {
      try {
        await dispatch("gui/sendTagSignal", [
          { id: currTagId.value, signalValue: inputValue.value },
        ]);
        notification.success({
          message: "送出成功",
        });
        inputModal.value = false;
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
        inputModal.value = false;
      }
    };

    // tag Settings
    const tagModal = ref(false);
    const activeTab = ref("1");

    const tagFormState = reactive({
      tagId: null,
      tagName: null,
      showProperty: null,
    });
    const setTag = ({ label, value }) => {
      tagFormState.tagId = value;
      tagFormState.tagName = label;
    };

    const ruleFormState = ref(null);
    const setRule = (rule) => {
      ruleFormState.value = rule;
    };

    const eventFormRef = ref();
    provide("eventFormRef", eventFormRef);
    const eventFormState = ref(null);
    const setEventData = (data) => {
      eventFormState.value = data;
    };

    const openTagModal = () => {
      rightClickMenu.value = false;
      const activeObj = fabricCanvas.getActiveObject();
      if (activeObj.tagId) {
        tagFormState.tagId = activeObj.tagId;
        tagFormState.tagName = activeObj.tagName;
        tagFormState.showProperty = activeObj.showProperty;
      } else {
        tagFormState.tagId = null;
        tagFormState.tagName = null;
        tagFormState.showProperty = null;
      }

      if (activeObj.symbolVar) {
        symbolFormState.symbolVar = activeObj.symbolVar;
      } else {
        symbolFormState.symbolVar = null;
      }

      if (activeObj.rule) {
        ruleFormState.value = activeObj.rule;
      } else {
        ruleFormState.value = null;
      }
      if (activeObj.eventData) {
        eventFormState.value = activeObj.eventData;
      } else {
        eventFormState.value = [];
      }
      tagModal.value = true;
    };

    const closeTagModal = () => {
      tagModal.value = false;
    };

    const submitTagSetting = async () => {
      let failedArr = [];
      if (eventFormRef.value) {
        await eventFormRef.value.validateFields().catch(() => {
          failedArr.push("事件設定");
        });
      }
      if (failedArr.length > 0) {
        let str = "";
        failedArr.forEach((el) => (str += `"${el}" `));
        str += `尚未設置完成`;
        Modal.error({
          title: "請將欄位填寫完整",
          content: str,
        });
        return;
      }

      const activeObj = fabricCanvas.getActiveObject();
      const callback = (obj) => {
        if (obj._objects) {
          obj._objects.forEach((el) => {
            callback(el);
          });
        } else {
          Object.assign(obj, {
            symbolVar: symbolFormState.symbolVar,
            tagId: tagFormState.tagId,
            tagName: tagFormState.tagName,
            showProperty: tagFormState.showProperty,
            eventData: eventFormState.value,
            rule: toRaw(ruleFormState.value),
          });
        }
      };
      callback(activeObj);
      fabricCanvas.renderAll();
      selectTagName.value = tagFormState.tagName;
      tagModal.value = false;
      setHistory();
    };

    // operate
    const toGroup = () => {
      rightClickMenu.value = false;
      useToGroup(fabricCanvas);
    };

    const unGroup = () => {
      rightClickMenu.value = false;
      useUnGroup(fabricCanvas);
    };

    const copy = () => {
      rightClickMenu.value = false;
      useCopy(fabricCanvas);
    };

    const remove = () => {
      rightClickMenu.value = false;
      useRemove(fabricCanvas);
    };

    const bringForward = () => {
      rightClickMenu.value = false;
      useForward(fabricCanvas);
    };

    const sendBackwards = () => {
      rightClickMenu.value = false;
      useBackwards(fabricCanvas);
    };

    const bringToFront = () => {
      rightClickMenu.value = false;
      useFront(fabricCanvas);
    };

    const sendToBack = () => {
      rightClickMenu.value = false;
      useBack(fabricCanvas);
    };

    const align = (type) => {
      useAlign(fabricCanvas, type, firstObj.value);
      rightClickMenu.value = false;
    };

    const changeStroke = (e) => {
      setElementStroke(e, fabricCanvas);
    };

    const changeFill = (e) => {
      setElementFill(e, fabricCanvas);
    };

    // symbol
    const { make: useMakeSymbol, save: useSaveSymbol } =
      useSymbol(fabricCanvas);

    const symbolMode = ref(false);
    const selectSymbolVar = ref(null);
    const selectSymbolList = ref([]);
    const currSymbolId = ref(null);
    const currSymbolName = ref(null);
    const symbolFormState = reactive({
      symbolVar: null,
    });

    const makeSymbol = () => {
      rightClickMenu.value = false;
      handleGridMode(false, fabricCanvas);
      symbolMode.value = true;
      currSymbolId.value = null;
      currSymbolName.value = null;
      useMakeSymbol(fabricCanvas);
    };

    const editSymbol = () => {
      rightClickMenu.value = false;
      const tar = symbols.value.find(
        (el) => el.id === fabricCanvas.getActiveObject().symbolId
      );
      if (!tar)
        return Modal.error({
          title: "發生錯誤",
          content: "找不到symbol請解除群組後再操作",
        });
      symbolMode.value = true;
      currSymbolId.value = tar.id;
      currSymbolName.value = tar.name;
      useMakeSymbol(fabricCanvas);
      resetHistory(fabricCanvas);
    };

    const deleteSymbol = async (id) => {
      Modal.confirm({
        title: "確認",
        content: "確定要刪除嗎?",
        onOk: async () => {
          try {
            await dispatch("gui/deleteSymbol", id);
            notification.success({
              message: "刪除成功",
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

    const closeSymbolMode = () => {
      symbolMode.value = false;
      applyingCanvasSnapshot.value = true;
      fabricCanvas.loadFromJSON(canvasString.value, () => {
        applyingCanvasSnapshot.value = false;
        resetHistory(fabricCanvas);
        captureEditBaseline();
      });
    };

    const setSymbolTag = (data, name) => {
      const activeObject = fabricCanvas.getActiveObject();

      const tar = selectSymbolList.value.find((el) => el.name === name);
      if (!tar) return;
      tar.value = data.value;
      const callback = (obj) => {
        if (obj._objects) {
          obj._objects.forEach((el) => {
            callback(el);
          });
        } else {
          if (obj.symbolVar && obj.symbolVar === name) {
            obj.tagId = data.value;
            obj.tagName = data.label;
          }
        }
      };
      callback(activeObject);
    };

    const saveSymbol = async () => {
      try {
        if (!currSymbolName.value) {
          return Modal.error({
            title: "發生錯誤",
            content: "請輸入symbol名稱",
          });
        }
        if (gridMode.value) {
          handleGridMode();
        }

        const params = useSaveSymbol(
          fabricCanvas,
          currSymbolName.value,
          currSymbolId.value
        );
        if (currSymbolId.value) {
          await dispatch("gui/editSymbol", params);
        } else {
          await dispatch("gui/addSymbol", params);
        }
        symbolMode.value = false;
        canvasString.value = await setCanvasString(symbols.value);
        await dispatch("gui/getOptions");
        applyingCanvasSnapshot.value = true;
        fabricCanvas.loadFromJSON(
          canvasString.value,
          () => {
            applyingCanvasSnapshot.value = false;
            fabricCanvas.renderAll.bind(fabricCanvas);
            resetHistory(fabricCanvas);
            captureEditBaseline();
          },
          (o, object) => {
            if (!object) return;
            setNormalStyle(object);
            setAdditionProperty(object);
          }
        );
        // fabricCanvas.loadFromJSON(
        //   canvasString.value,
        //   () => {},
        //   (o) => {
        //     if (o.symbolId) {
        //       const symbolData = symbols.value.find(
        //         (el) => el.id === o.symbolId
        //       );
        //       if (symbolData) {
        //         const symbolContent = JSON.parse(symbolData.content);
        //         o = {
        //           ...symbolContent,
        //           top: o.top,
        //           left: o.left,
        //           symbolVars: symbolData.allSymbolVars.map((el) => {
        //             const hasValue = o.symbolVars.find(
        //               (symbolVar) => symbolVar === el
        //             );
        //             if (hasValue) {
        //               return { name: el, value: hasValue.value };
        //             } else {
        //               return { name: el, value: null };
        //             }
        //           }),
        //         };
        //       }
        //     }
        //   }
        // );
      } catch (err) {
        Modal.error({
          title: "發生錯誤",
          content: err.message,
        });
      }
    };

    const canvasFileInput = ref();
    const openCanvasFileInput = () => {
      canvasFileInput.value.click();
    };

    const uploadCanvasJson = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
      try {
        Modal.confirm({
          title: "確認",
          content: "匯入將會完全覆蓋現有資料，確定匯入?",
          onOk: () => {
            const reader = new FileReader();
            reader.onload = async function (e) {
              try {
                const jsonContent = JSON.parse(e.target.result);
                applyingCanvasSnapshot.value = true;
                fabricCanvas.loadFromJSON(jsonContent, () => {
                  applyingCanvasSnapshot.value = false;
                  fabricCanvas.renderAll.bind(fabricCanvas);
                  resetHistory(fabricCanvas);
                  captureEditBaseline();
                });
              } catch {
                Modal.error({
                  content: "檔案解析失敗",
                });
              }
            };
            reader.readAsText(file);
          },
        });
      } catch (err) {
        return Modal.error({
          title: "匯入檔案失敗",
        });
      }
    };

    const exportCanvasJson = async () => {
      try {
        const canvasAsJson = getContentJson(fabricCanvas);

        const blob = new Blob([JSON.stringify(canvasAsJson)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${state.gui.guiDetail.Name}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } catch (err) {
        return Modal.error({
          title: "匯出檔案失敗",
        });
      }
    };

    return {
      activeKey,
      activeTab,
      addBgImage,
      addItem,
      addImage,
      addSymbol,
      align,
      allEnableProps,
      bringForward,
      bringToFront,
      canRedo,
      canUndo,
      canvas,
      canvasFileInput,
      canvasWrap,
      changeFill,
      changeStroke,
      clearCanvas,
      closeInfoModal,
      closeInputModal,
      closeSymbolMode,
      closeTagModal,
      copy,
      currCCTV,
      currSymbolName,
      currTagId,
      currTagName,
      customImgs,
      deleteSymbol,
      drawMode,
      editSymbol,
      eventFormRef,
      eventFormState,
      exportCanvasJson,
      faRedo,
      faUndo,
      fileInput,
      fillColor,
      gridMode,
      guiLoading,
      handleDrag,
      handleDrawMode,
      handleGridMode,
      history,
      historyIndex,
      imgFileInput,
      infoModal,
      infoTab,
      inputModal,
      inputValue,
      isActiveObject,
      loading,
      makeSymbol,
      menuPosition,
      menuRef,
      mode,
      modeOptions,
      onClick,
      onCustomDragend,
      onDragend,
      onSVGDragend,
      onSymbolDragend,
      openCanvasFileInput,
      openFileInput,
      openImgFileInput,
      openTagModal,
      remove,
      rightClickMenu,
      ruleFormState,
      saveCanvas,
      saveSymbol,
      setMode,
      selectSymbolList,
      selectSymbolVar,
      selectTagName,
      sendBackwards,
      sendSignal,
      sendToBack,
      setEventData,
      setGridMode,
      setRule,
      setSymbolTag,
      setTag,
      settingbox,
      showCollapse,
      startDrag,
      strokeColor,
      submitTagSetting,
      svgIcons,
      symbolbox,
      symbolFormState,
      symbols,
      symbolMode,
      tagFormState,
      tagModal,
      toGroup,
      toHistory,
      toolbox,
      unGroup,
      uploadCanvasJson,
      uploadCustomImg,
    };
  },
});
