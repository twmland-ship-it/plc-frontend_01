import { onMounted, onUnmounted } from 'vue';

export function useModalDrag(modalClass = '.tag-filter-modal') {
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let initialX = 0;
  let initialY = 0;
  let modalElement = null;
  let headerElement = null;

  const initDrag = () => {
    const tryInitDrag = () => {
      modalElement = document.querySelector(modalClass);
      if (modalElement) {
        // 查找標題元素 - 嘗試多種選擇器
        headerElement = modalElement.querySelector('.ant-modal-header') ||
                       modalElement.querySelector('.modal-header') ||
                       modalElement.querySelector('[class*="header"]') ||
                       modalElement.querySelector('.ant-modal-title')?.parentElement;

        if (!headerElement) {
          // 如果找不到標題，創建一個拖曳區域
          const modalContent = modalElement.querySelector('.ant-modal-content') ||
                              modalElement.querySelector('.modal-content') ||
                              modalElement.querySelector('[class*="content"]');
          if (modalContent) {
            const dragHandle = document.createElement('div');
            dragHandle.className = 'modal-drag-handle';
            dragHandle.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              height: 40px;
              cursor: move;
              z-index: 1000;
              background: rgba(0,0,0,0.02);
            `;
            modalContent.style.position = 'relative';
            modalContent.appendChild(dragHandle);
            headerElement = dragHandle;
          }
        }

        if (headerElement) {
          headerElement.style.cursor = 'move';
          headerElement.addEventListener('mousedown', startDrag);

          // 設置初始位置
          const modalContent = modalElement.querySelector('.ant-modal-content') ||
                              modalElement.querySelector('.modal-content') ||
                              modalElement.querySelector('[class*="content"]');
          if (modalContent) {
            modalContent.style.position = 'relative';
            modalContent.style.transform = 'translate(0, 0)';
          }
          return true;
        }
      }
      return false;
    };

    // 立即嘗試
    if (tryInitDrag()) return;

    // 如果失敗，使用 MutationObserver 監聽 DOM 變化
    const observer = new MutationObserver(() => {
      if (tryInitDrag()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // 5秒後停止監聽
    setTimeout(() => observer.disconnect(), 5000);
  };

  const startDrag = (e) => {
    if (e.target.closest('.ant-modal-close') ||
        e.target.closest('.clear-all-btn') ||
        e.target.closest('[class*="close"]')) {
      return; // 不要在關閉按鈕或清除按鈕上啟動拖曳
    }

    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;

    const modalContent = modalElement.querySelector('.ant-modal-content') ||
                        modalElement.querySelector('.modal-content') ||
                        modalElement.querySelector('[class*="content"]');

    if (modalContent) {
      const transform = modalContent.style.transform;
      const matrix = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);

      if (matrix) {
        initialX = parseFloat(matrix[1]) || 0;
        initialY = parseFloat(matrix[2]) || 0;
      } else {
        initialX = 0;
        initialY = 0;
      }
    }

    modalElement.classList.add('dragging');
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);

    e.preventDefault();
    e.stopPropagation();
  };

  const drag = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;

    const newX = initialX + deltaX;
    const newY = initialY + deltaY;

    // 限制拖曳範圍在視窗內
    const modalContent = modalElement.querySelector('.ant-modal-content') ||
                        modalElement.querySelector('.modal-content') ||
                        modalElement.querySelector('[class*="content"]');

    if (modalContent) {
      const rect = modalContent.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const maxX = windowWidth - rect.width - 50;
      const maxY = windowHeight - rect.height - 50;
      const minX = -rect.width + 100; // 允許部分移出視窗
      const minY = -50;

      const constrainedX = Math.max(minX, Math.min(maxX, newX));
      const constrainedY = Math.max(minY, Math.min(maxY, newY));

      modalContent.style.transform = `translate(${constrainedX}px, ${constrainedY}px)`;
    }
  };

  const stopDrag = () => {
    if (!isDragging) return;
    
    isDragging = false;
    modalElement.classList.remove('dragging');
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  };

  const cleanup = () => {
    if (headerElement) {
      headerElement.removeEventListener('mousedown', startDrag);
    }
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  };

  onMounted(() => {
    initDrag();
  });

  onUnmounted(() => {
    cleanup();
  });

  return {
    initDrag,
    cleanup
  };
}
