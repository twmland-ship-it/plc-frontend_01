import { ref, nextTick } from "vue";

export function useMenu({ canvasWrap }) {
  const menuRef = ref(null);
  const rightClickMenu = ref(false);
  const menuPosition = ref("");

  const setMenuStatus = (opt, status) => {
    if (status) {
      rightClickMenu.value = true;
      nextTick(() => {
        const menuWidth = menuRef.value.offsetWidth;
        const menuHeight = menuRef.value.offsetHeight;
        let pointX = opt.pointer.x;
        let pointY = opt.pointer.y;
        if (pointX >= canvasWrap.value.offsetWidth - menuWidth) {
          pointX -= menuWidth;
        }
        if (pointY >= canvasWrap.value.offsetHeight - menuHeight) {
          pointY -= menuHeight;
        }
        menuPosition.value = `
        left: ${pointX}px;
        top: ${pointY}px;
        `;
      });
    } else {
      rightClickMenu.value = false;
    }
  };
  return { menuRef, rightClickMenu, menuPosition, setMenuStatus };
}
