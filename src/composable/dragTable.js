export function useDraggableHook(dataSource) {
  let dragItem;
  let targItem;
  const customRow = (record) => {
    return {
      draggable: true,
      ondrag() {
        dragItem = record;
      },
      ondrop() {
        targItem = record;
      },
      ondragend() {
        if (dragItem !== targItem) {
          const dragItemIndex = dataSource.indexOf(dragItem);
          const targItemIndex = dataSource.indexOf(targItem);
          // 解构交换
          [dataSource[dragItemIndex], dataSource[targItemIndex]] = [
            dataSource[targItemIndex],
            dataSource[dragItemIndex],
          ];
        }
      },
      ondragover() {
        return false;
      },
    };
  };
  return customRow;
}
