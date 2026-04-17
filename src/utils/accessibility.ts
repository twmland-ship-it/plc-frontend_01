/**
 * Accessibility Utilities
 * 
 * 提供無障礙性（a11y）相關的工具函數
 */

/**
 * 管理焦點陷阱
 * 
 * 在模態對話框或彈出層中限制焦點在特定元素內
 * 
 * @param element - 要限制焦點的容器元素
 * @returns 清理函數
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = getFocusableElements(element);
  
  if (focusableElements.length === 0) {
    return () => {};
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  // 保存之前的焦點元素
  const previouslyFocusedElement = document.activeElement as HTMLElement;

  // 設置初始焦點
  firstElement.focus();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') {
      return;
    }

    if (event.shiftKey) {
      // Shift + Tab：向後移動
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab：向前移動
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  element.addEventListener('keydown', handleKeyDown);

  // 返回清理函數
  return () => {
    element.removeEventListener('keydown', handleKeyDown);
    
    // 恢復之前的焦點
    if (previouslyFocusedElement && previouslyFocusedElement.focus) {
      previouslyFocusedElement.focus();
    }
  };
}

/**
 * 獲取元素內所有可聚焦的元素
 * 
 * @param element - 容器元素
 * @returns 可聚焦元素列表
 */
export function getFocusableElements(element: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const elements = Array.from(element.querySelectorAll(selector)) as HTMLElement[];
  
  return elements.filter(el => {
    // 過濾掉不可見的元素
    return el.offsetParent !== null && 
           !el.hasAttribute('hidden') &&
           window.getComputedStyle(el).visibility !== 'hidden';
  });
}

/**
 * 宣告即時訊息給螢幕閱讀器
 * 
 * @param message - 要宣告的訊息
 * @param priority - 優先級（'polite' 或 'assertive'）
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  // 查找或創建 live region
  let liveRegion = document.getElementById('a11y-live-region');
  
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'a11y-live-region';
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.style.position = 'absolute';
    liveRegion.style.left = '-10000px';
    liveRegion.style.width = '1px';
    liveRegion.style.height = '1px';
    liveRegion.style.overflow = 'hidden';
    document.body.appendChild(liveRegion);
  }

  // 更新優先級
  liveRegion.setAttribute('aria-live', priority);

  // 清空後設置新訊息（確保螢幕閱讀器會讀取）
  liveRegion.textContent = '';
  setTimeout(() => {
    liveRegion!.textContent = message;
  }, 100);
}

/**
 * 檢查元素是否可見
 * 
 * @param element - 要檢查的元素
 * @returns 是否可見
 */
export function isElementVisible(element: HTMLElement): boolean {
  if (!element) {
    return false;
  }

  // 檢查 display 和 visibility
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') {
    return false;
  }

  // 檢查 opacity
  if (parseFloat(style.opacity) === 0) {
    return false;
  }

  // 檢查尺寸
  const rect = element.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }

  return true;
}

/**
 * 設置元素的 ARIA 標籤
 * 
 * @param element - 目標元素
 * @param label - 標籤文字
 * @param labelledBy - 引用其他元素的 ID
 */
export function setAriaLabel(
  element: HTMLElement,
  label?: string,
  labelledBy?: string
): void {
  if (label) {
    element.setAttribute('aria-label', label);
  }
  
  if (labelledBy) {
    element.setAttribute('aria-labelledby', labelledBy);
  }
}

/**
 * 設置元素的 ARIA 描述
 * 
 * @param element - 目標元素
 * @param description - 描述文字
 * @param describedBy - 引用其他元素的 ID
 */
export function setAriaDescription(
  element: HTMLElement,
  description?: string,
  describedBy?: string
): void {
  if (description) {
    element.setAttribute('aria-description', description);
  }
  
  if (describedBy) {
    element.setAttribute('aria-describedby', describedBy);
  }
}

/**
 * 管理鍵盤導航
 * 
 * 為元素列表添加方向鍵導航支援
 * 
 * @param elements - 元素列表
 * @param options - 配置選項
 * @returns 清理函數
 */
export function enableKeyboardNavigation(
  elements: HTMLElement[],
  options: {
    orientation?: 'horizontal' | 'vertical' | 'both';
    loop?: boolean;
  } = {}
): () => void {
  const { orientation = 'vertical', loop = true } = options;

  const handleKeyDown = (event: KeyboardEvent) => {
    const currentIndex = elements.indexOf(event.target as HTMLElement);
    
    if (currentIndex === -1) {
      return;
    }

    let nextIndex = currentIndex;

    switch (event.key) {
      case 'ArrowUp':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          nextIndex = currentIndex - 1;
        }
        break;
      
      case 'ArrowDown':
        if (orientation === 'vertical' || orientation === 'both') {
          event.preventDefault();
          nextIndex = currentIndex + 1;
        }
        break;
      
      case 'ArrowLeft':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          nextIndex = currentIndex - 1;
        }
        break;
      
      case 'ArrowRight':
        if (orientation === 'horizontal' || orientation === 'both') {
          event.preventDefault();
          nextIndex = currentIndex + 1;
        }
        break;
      
      case 'Home':
        event.preventDefault();
        nextIndex = 0;
        break;
      
      case 'End':
        event.preventDefault();
        nextIndex = elements.length - 1;
        break;
      
      default:
        return;
    }

    // 處理循環
    if (loop) {
      if (nextIndex < 0) {
        nextIndex = elements.length - 1;
      } else if (nextIndex >= elements.length) {
        nextIndex = 0;
      }
    } else {
      nextIndex = Math.max(0, Math.min(nextIndex, elements.length - 1));
    }

    // 移動焦點
    if (nextIndex !== currentIndex) {
      elements[nextIndex].focus();
    }
  };

  // 為每個元素添加事件監聽器
  elements.forEach(element => {
    element.addEventListener('keydown', handleKeyDown);
  });

  // 返回清理函數
  return () => {
    elements.forEach(element => {
      element.removeEventListener('keydown', handleKeyDown);
    });
  };
}

/**
 * 檢查是否使用鍵盤導航
 * 
 * @returns 是否使用鍵盤
 */
export function isUsingKeyboard(): boolean {
  // 檢查最近的輸入類型
  return document.body.classList.contains('using-keyboard');
}

/**
 * 初始化鍵盤/滑鼠檢測
 * 
 * 添加 'using-keyboard' 類到 body，用於顯示焦點樣式
 */
export function initInputDetection(): void {
  let isKeyboard = false;

  // 監聽鍵盤事件
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      isKeyboard = true;
      document.body.classList.add('using-keyboard');
    }
  });

  // 監聽滑鼠事件
  document.addEventListener('mousedown', () => {
    if (isKeyboard) {
      isKeyboard = false;
      document.body.classList.remove('using-keyboard');
    }
  });

  // 監聽觸控事件
  document.addEventListener('touchstart', () => {
    if (isKeyboard) {
      isKeyboard = false;
      document.body.classList.remove('using-keyboard');
    }
  });
}

/**
 * 創建可訪問的工具提示
 * 
 * @param trigger - 觸發元素
 * @param content - 工具提示內容
 * @returns 清理函數
 */
export function createAccessibleTooltip(
  trigger: HTMLElement,
  content: string
): () => void {
  const tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  
  // 創建工具提示元素
  const tooltip = document.createElement('div');
  tooltip.id = tooltipId;
  tooltip.setAttribute('role', 'tooltip');
  tooltip.textContent = content;
  tooltip.style.position = 'absolute';
  tooltip.style.zIndex = '9999';
  tooltip.style.display = 'none';
  document.body.appendChild(tooltip);

  // 設置 ARIA 屬性
  trigger.setAttribute('aria-describedby', tooltipId);

  const showTooltip = () => {
    tooltip.style.display = 'block';
    // 定位工具提示
    const rect = trigger.getBoundingClientRect();
    tooltip.style.top = `${rect.bottom + 5}px`;
    tooltip.style.left = `${rect.left}px`;
  };

  const hideTooltip = () => {
    tooltip.style.display = 'none';
  };

  // 添加事件監聽器
  trigger.addEventListener('mouseenter', showTooltip);
  trigger.addEventListener('mouseleave', hideTooltip);
  trigger.addEventListener('focus', showTooltip);
  trigger.addEventListener('blur', hideTooltip);

  // 返回清理函數
  return () => {
    trigger.removeEventListener('mouseenter', showTooltip);
    trigger.removeEventListener('mouseleave', hideTooltip);
    trigger.removeEventListener('focus', showTooltip);
    trigger.removeEventListener('blur', hideTooltip);
    trigger.removeAttribute('aria-describedby');
    tooltip.remove();
  };
}
