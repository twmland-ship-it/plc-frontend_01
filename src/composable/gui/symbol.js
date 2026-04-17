import { fabric } from "fabric";

export function useSymbol() {
  const make = (canvas) => {
    const activeGroup = canvas.getActiveObject();
    let objectsInGroup = [];
    if (activeGroup.type === "activeSelection") {
      objectsInGroup = activeGroup.getObjects();
      canvas.clear();
      objectsInGroup.forEach((obj) => {
        obj.setCoords();
        canvas.add(obj);
      });
    } else {
      canvas.clear();
      activeGroup.setCoords();
      canvas.add(activeGroup);
    }

    canvas.renderAll();

    new fabric.ActiveSelection(objectsInGroup, {
      canvas: canvas,
    });

    canvas.setActiveObject(activeGroup);
  };

  const save = (canvas, symbolName, symbolId) => {
    const allObj = canvas.getObjects();
    const group = new fabric.Group(allObj, {
      canvas: canvas,
    });
    let allSymbolVars = [];
    const callback = (obj) => {
      if (obj._objects) {
        obj._objects.forEach((el) => {
          callback(el);
        });
      } else {
        if (obj.symbolVar && !allSymbolVars.includes(obj.symbolVar))
          allSymbolVars.push(obj.symbolVar);
      }
    };
    callback(group);
    const groupAsJson = group.toJSON([
      "symbolId",
      "symbolVar",
      "symbolVars",
      "eventData",
      "rule",
      "tagId",
      "tagName",
      "id",
    ]);

    const params = {
      id: symbolId,
      name: symbolName,
      allSymbolVars,
      content: JSON.stringify(groupAsJson),
    };
    return params;
  };

  return {
    make,
    save,
  };
}
