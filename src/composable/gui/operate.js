// import { fabric } from "fabric";

// const setObjId = (toObject) => {
//   return function (propertiesToInclude) {
//     return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
//       id: Date.now().toString(),
//     });
//   };
// };
export function useToGroup(canvas) {
  const activeObject = canvas.getActiveObject();
  try {
    activeObject.toGroup();
  } catch (_) {
    return;
  }
}

export function useUnGroup(canvas) {
  const activeObject = canvas.getActiveObject();
  if (activeObject.type == "group") {
    const items = activeObject._objects;
    activeObject._restoreObjectsState();
    canvas.remove(activeObject);
    for (let i = 0; i < items.length; i++) {
      canvas.add(items[i]);
      canvas.item(canvas.size() - 1).hasControls = true;
    }
  }
}

export function useCopy(canvas) {
  const deepClone = (origin) => {
    origin.clone(
      (clonedObj) => {
        clonedObj.set({
          id: Date.now().toString(),
        });
        if (clonedObj._objects) {
          clonedObj.forEachObject(function (obj) {
            deepClone(obj);
          });
        }
      },
      [
        "symbolId",
        "symbolVar",
        "symbolVars",
        "eventData",
        "rule",
        "tagId",
        "tagName",
        "showProperty",
      ]
    );
  };

  const origin = canvas.getActiveObject();
  canvas.discardActiveObject();
  origin.clone(
    (clonedObj) => {
      clonedObj.canvas = canvas;
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        id: Date.now().toString(),
      });
      if (clonedObj._objects) {
        clonedObj.forEachObject(function (obj) {
          deepClone(obj);
          if (origin.type !== "group") {
            canvas.add(obj);
            obj.setCoords();
          }
        });
      }
      if (origin.type === "group" || !origin._objects) {
        canvas.add(clonedObj);
        clonedObj.setCoords();
      }
      canvas.setActiveObject(clonedObj);
    },
    [
      "symbolId",
      "symbolVar",
      "symbolVars",
      "eventData",
      "rule",
      "tagId",
      "tagName",
      "showProperty",
    ]
  );
}

export function useRemove(canvas) {
  const active = canvas.getActiveObject();
  if (active) {
    canvas.remove(active);
    if (active.type == "activeSelection") {
      active.getObjects().forEach((x) => canvas.remove(x));
      canvas.discardActiveObject();
    }
  }
}

export function useAlign(canvas, type, firstObj) {
  if (!firstObj) {
    const obj = canvas.getActiveObject();
    switch (type) {
      case "left":
        obj.set({
          left: 0,
        });
        break;
      case "right":
        obj.set({
          left: canvas.width - obj.width,
        });
        break;
      case "top":
        obj.set({
          top: 0,
        });
        break;
      case "bottom":
        obj.set({
          top: canvas.height - obj.height,
        });
        break;
      case "center":
        obj.set({
          left: canvas.width / 2 - obj.width / 2,
        });
        break;
      case "middle":
        obj.set({
          top: canvas.height / 2 - obj.height / 2,
        });
        break;
    }
  } else {
    const objs = canvas.getActiveObjects();
    const firstObjBoundingRect = firstObj.getBoundingRect(true);
    const firstObjCenter = firstObj.getCenterPoint();
    for (let i = 0; i < objs.length; i++) {
      const objBoundingRect = objs[i].getBoundingRect(true);
      switch (type) {
        case "left":
          objs[i].set({
            left: firstObj.left,
          });
          break;
        case "right":
          objs[i].set({
            left:
              firstObjBoundingRect.left +
              firstObjBoundingRect.width -
              objBoundingRect.width,
          });
          break;
        case "top":
          objs[i].set({
            top: firstObj.top,
          });
          break;
        case "bottom":
          objs[i].set({
            top:
              firstObjBoundingRect.top +
              firstObjBoundingRect.height -
              objBoundingRect.height,
          });
          break;
        case "center":
          objs[i].set({
            left: firstObjCenter.x - objBoundingRect.width / 2,
          });
          break;
        case "middle":
          objs[i].set({
            top:
              firstObjBoundingRect.top +
              firstObjBoundingRect.height / 2 -
              objBoundingRect.height / 2,
          });
          break;
      }
    }
  }
  canvas.requestRenderAll();
}

export function useForward(fabricCanvas) {
  fabricCanvas.getActiveObject().bringForward();
}

export function useBackwards(fabricCanvas) {
  fabricCanvas.getActiveObject().sendBackwards();
}

export function useFront(fabricCanvas) {
  fabricCanvas.getActiveObject().bringToFront();
}

export function useBack(fabricCanvas) {
  fabricCanvas.getActiveObject().sendToBack();
}

export function setElementStroke(e, fabricCanvas) {
  const callback = (obj) => {
    if (obj._objects) {
      obj._objects.forEach((el) => {
        callback(el);
      });
    } else {
      obj.set({ stroke: e.target.value });
    }
  };
  const activeObject = fabricCanvas.getActiveObject();
  callback(activeObject);
}

export function setElementFill(e, fabricCanvas) {
  const callback = (obj) => {
    if (obj._objects) {
      obj._objects.forEach((el) => {
        callback(el);
      });
    } else {
      obj.set({ fill: e.target.value });
    }
  };
  const activeObject = fabricCanvas.getActiveObject();
  callback(activeObject);
}
