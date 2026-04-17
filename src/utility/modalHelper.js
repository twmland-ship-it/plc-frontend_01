import { h } from "vue";
import { Modal } from "ant-design-vue";
import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons-vue";

/**
 * 帶圖標的 Modal 工具函數
 * 解決 Ant Design Vue 中 Modal 圖標 VNode 錯誤問題
 */

export const ModalHelper = {
  /**
   * 顯示確認對話框
   */
  confirm(options) {
    return Modal.confirm({
      icon: h(ExclamationCircleOutlined),
      ...options,
    });
  },

  /**
   * 顯示錯誤對話框
   */
  error(options) {
    return Modal.error({
      icon: h(CloseCircleOutlined),
      ...options,
    });
  },

  /**
   * 顯示信息對話框
   */
  info(options) {
    return Modal.info({
      icon: h(InfoCircleOutlined),
      ...options,
    });
  },

  /**
   * 顯示成功對話框
   */
  success(options) {
    return Modal.success({
      icon: h(CheckCircleOutlined),
      ...options,
    });
  },

  /**
   * 顯示警告對話框
   */
  warning(options) {
    return Modal.warning({
      icon: h(ExclamationCircleOutlined),
      ...options,
    });
  },
};

export default ModalHelper;
