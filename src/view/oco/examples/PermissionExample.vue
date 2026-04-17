<template>
  <div>
    <sdPageHeader
      title="權限控制示例"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '系統' }, { breadcrumbName: '權限控制示例' }]"
    />
    <Main>
      <sdCards title="權限控制方法示例">
        <a-space direction="vertical" style="width: 100%">
          
          <!-- 方法1: 使用 v-permission 指令 -->
          <a-card title="方法1: 使用 v-permission 指令" size="small">
            <a-space>
              <a-button v-permission="'create'" type="primary">
                新增 (需要 create 權限)
              </a-button>
              <a-button v-permission="'update'" type="default">
                編輯 (需要 update 權限)
              </a-button>
              <a-button v-permission="'delete'" type="danger">
                刪除 (需要 delete 權限)
              </a-button>
              <a-button v-permission:hide="'read'">
                查看 (需要 read 權限，無權限時隱藏)
              </a-button>
            </a-space>
          </a-card>

          <!-- 方法2: 使用 PermissionButton 組件 -->
          <a-card title="方法2: 使用 PermissionButton 組件" size="small">
            <a-space>
              <PermissionButton 
                permission="create" 
                type="primary"
                @click="handleAdd"
              >
                新增資料
              </PermissionButton>
              <PermissionButton 
                permission="update" 
                type="default"
                @click="handleEdit"
              >
                編輯資料
              </PermissionButton>
              <PermissionButton 
                permission="delete" 
                type="danger"
                @click="handleDelete"
              >
                刪除資料
              </PermissionButton>
            </a-space>
          </a-card>

          <!-- 方法3: 使用 computed 屬性 -->
          <a-card title="方法3: 使用 computed 屬性" size="small">
            <a-space>
              <a-button v-if="permission.create" type="primary" @click="handleAdd">
                新增 (computed)
              </a-button>
              <a-button v-if="permission.update" type="default" @click="handleEdit">
                編輯 (computed)
              </a-button>
              <a-button v-if="permission.delete" type="danger" @click="handleDelete">
                刪除 (computed)
              </a-button>
            </a-space>
          </a-card>

          <!-- 方法4: 使用權限混入 -->
          <a-card title="方法4: 使用權限混入" size="small">
            <a-space>
              <a-button v-if="canCreate" type="primary" @click="handleAdd">
                新增 (mixin)
              </a-button>
              <a-button v-if="canUpdate" type="default" @click="handleEdit">
                編輯 (mixin)
              </a-button>
              <a-button v-if="canDelete" type="danger" @click="handleDelete">
                刪除 (mixin)
              </a-button>
            </a-space>
          </a-card>

          <!-- 跨模組權限檢查 -->
          <a-card title="跨模組權限檢查" size="small">
            <a-space>
              <a-button 
                v-permission="{ permission: 'create', module: 'user-list' }" 
                type="primary"
              >
                新增用戶 (user-list 模組)
              </a-button>
              <a-button 
                v-permission="{ permission: 'update', module: 'gui-setting' }" 
                type="default"
              >
                編輯頁面 (gui-setting 模組)
              </a-button>
            </a-space>
          </a-card>

          <!-- 權限狀態顯示 -->
          <a-card title="當前權限狀態" size="small">
            <a-descriptions :column="2" size="small">
              <a-descriptions-item label="新增權限">
                <a-tag :color="permission.create ? 'green' : 'red'">
                  {{ permission.create ? '有權限' : '無權限' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="查看權限">
                <a-tag :color="permission.read ? 'green' : 'red'">
                  {{ permission.read ? '有權限' : '無權限' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="編輯權限">
                <a-tag :color="permission.update ? 'green' : 'red'">
                  {{ permission.update ? '有權限' : '無權限' }}
                </a-tag>
              </a-descriptions-item>
              <a-descriptions-item label="刪除權限">
                <a-tag :color="permission.delete ? 'green' : 'red'">
                  {{ permission.delete ? '有權限' : '無權限' }}
                </a-tag>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>

        </a-space>
      </sdCards>
    </Main>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { Main } from '../../styled';
import { usePermission } from '@/composable/permission';
import { usePermissionMixin } from '@/mixins/permission';
import PermissionButton from '@/components/permission/PermissionButton.vue';
import { notification } from 'ant-design-vue';

export default defineComponent({
  name: 'PermissionExample',
  components: {
    Main,
    PermissionButton
  },
  setup() {
    const { permission } = usePermission();
    const {
      canCreate,
      canUpdate,
      canDelete,
      hasPermission
    } = usePermissionMixin();

    const handleAdd = () => {
      notification.success({
        message: '新增操作',
        description: '執行新增功能'
      });
    };

    const handleEdit = () => {
      notification.info({
        message: '編輯操作',
        description: '執行編輯功能'
      });
    };

    const handleDelete = () => {
      notification.warning({
        message: '刪除操作',
        description: '執行刪除功能'
      });
    };

    return {
      permission,
      canCreate,
      canUpdate,
      canDelete,
      hasPermission,
      handleAdd,
      handleEdit,
      handleDelete
    };
  }
});
</script>
