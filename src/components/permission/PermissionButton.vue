<template>
  <component
    :is="tag"
    v-if="hasPermission"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </component>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { usePermission } from '@/composable/permission';

export default defineComponent({
  name: 'PermissionButton',
  inheritAttrs: false,
  props: {
    // 權限類型：'create', 'read', 'update', 'delete'
    permission: {
      type: String,
      required: true,
      validator: (value) => ['create', 'read', 'update', 'delete'].includes(value)
    },
    // 權限模組名稱，如果不提供則使用當前路由
    module: {
      type: String,
      default: null
    },
    // 按鈕標籤，默認為 a-button
    tag: {
      type: String,
      default: 'a-button'
    },
    // 點擊事件
    onClick: {
      type: Function,
      default: null
    }
  },
  setup(props, { emit }) {
    const { permission: modulePermission } = usePermission(props.module);
    
    // 檢查是否有權限
    const hasPermission = computed(() => {
      switch (props.permission) {
        case 'create':
          return modulePermission.create;
        case 'read':
          return modulePermission.read;
        case 'update':
          return modulePermission.update;
        case 'delete':
          return modulePermission.delete;
        default:
          return false;
      }
    });
    
    const handleClick = (event) => {
      if (props.onClick) {
        props.onClick(event);
      }
      emit('click', event);
    };
    
    return {
      hasPermission,
      handleClick
    };
  }
});
</script>
