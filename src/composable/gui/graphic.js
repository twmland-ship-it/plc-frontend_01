import { fabric } from "fabric";
const setObjId = (toObject) => {
  return function (propertiesToInclude) {
    return fabric.util.object.extend(toObject.call(this, propertiesToInclude), {
      id: Date.now().toString(),
    });
  };
};

const defaultPosition = { shadow: "", fontFamily: "arial" };

export function useAddText(canvas, option) {
  const text = new fabric.Text("###", {
    ...defaultPosition,
    ...option,
    fontSize: 30,
    fill: "#000000",
    stroke: "#000000",
  });
  text.toObject = setObjId(text.toObject);
  canvas.add(text);
  canvas.setActiveObject(text);
}

export function useAddTextBox(canvas, option) {
  const text = new fabric.Textbox("輸入文字", {
    ...defaultPosition,
    ...option,
    splitByGrapheme: true,
    width: 120,
    fontSize: 30,
    fill: "#000000",
    stroke: "#000000",
  });
  text.toObject = setObjId(text.toObject);
  canvas.add(text);
  canvas.setActiveObject(text);
}

export function useAddLine(canvas, option) {
  const line = new fabric.Line([50, 100, 200, 100], {
    ...defaultPosition,
    ...option,
    fill: "#000000",
    stroke: "#000000",
    angle: 0,
    strokeWidth: 3,
  });
  line.toObject = setObjId(line.toObject);
  canvas.add(line);
  canvas.setActiveObject(line);
}

export function useAddRect(canvas, option) {
  const rect = new fabric.Rect({
    ...defaultPosition,
    ...option,
    width: 50,
    height: 50,
    fill: "#ffffff",
    stroke: "#000000",
  });
  rect.toObject = setObjId(rect.toObject);
  canvas.add(rect);
  canvas.setActiveObject(rect);
}

export function useAddTriangle(canvas, option) {
  const triangle = new fabric.Triangle({
    ...defaultPosition,
    ...option,
    width: 50,
    height: 50,
    fill: "#ffffff",
    stroke: "#000000",
  });
  triangle.toObject = setObjId(triangle.toObject);
  canvas.add(triangle);
  canvas.setActiveObject(triangle);
}

export function useAddCircle(canvas, option) {
  const circle = new fabric.Circle({
    ...defaultPosition,
    ...option,
    radius: 25,
    fill: "#ffffff",
    stroke: "#000000",
  });
  circle.toObject = setObjId(circle.toObject);
  canvas.add(circle);
  canvas.setActiveObject(circle);
}

export function useAddItem(canvas, e, dragOption) {
  const url = e.target.src;
  fabric.loadSVGFromURL(url, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      ...defaultPosition,
    });
    item.toObject = setObjId(item.toObject);
    if (dragOption) {
      item.left = dragOption.left;
      item.top = dragOption.top;
    }
    item.scaleToWidth(50);
    item.scaleToHeight(50);
    canvas.add(item);
    canvas.setActiveObject(item);
  });
}

export function useAddImage(canvas, e, dragOption) {
  const url = e.target.src;
  fabric.Image.fromURL(url, (img, err) => {
    if (err) return;

    img.scaleToWidth(80);
    img.set({
      angle: 0,
    });
    img.toObject = setObjId(img.toObject);
    if (dragOption) {
      img.left = dragOption.left;
      img.top = dragOption.top;
    }
    canvas.add(img);
    canvas.setActiveObject(img);
  });
}

export function useAddSymbol(canvas, e, data, dragOption) {
  fabric.Group.fromObject(JSON.parse(data.content), (group) => {
    group.toObject = setObjId(group.toObject);
    if (dragOption) {
      group.left = dragOption.left;
      group.top = dragOption.top;
    } else {
      group.left = 0;
      group.top = 0;
    }
    group.symbolId = data.id;
    group.symbolVars = data.allSymbolVars.map((el) => ({
      name: el,
      value: null,
    }));
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
  });
}

export function useAddBgImage(canvas, event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (f) {
    const data = f.target.result;
    fabric.Image.fromURL(data, (img, err) => {
      if (err) {
        canvas.setBackgroundColor(
          "rgba(85, 107, 198, 0.6)",
          canvas.renderAll.bind(canvas)
        );
      } else {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: canvas.width / img.width,
          scaleY: canvas.height / img.height,
          crossOrigin: "anonymous",
        });
      }
    });
  };
  reader.readAsDataURL(file);
}
