<template>
  <div>
    <sdPageHeader
      title="電力卸載"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '系統' }, { breadcrumbName: '電力卸載' }]"
    ></sdPageHeader>
    <Main>
      <DeleteModal
        v-if="deleteModal"
        :loading="loading"
        :processName="deleteProcessName"
        :visible="deleteModal"
        :handleClose="closeDeleteModal"
        :handleOk="deleteProcess"
      />
      <!-- 舊 AddModal 暫留，不再開啟使用（保留避免影響其他頁） -->
      <AddModal
        v-if="false && addModal"
        title="新增卸載程序"
        :loading="loading"
        :visible="addModal"
        :handleClose="closeAddModal"
      />

      <AddModal
        v-if="false && editModal"
        title="編輯卸載程序"
        :processId="editId"
        :loading="loading"
        :visible="editModal"
        :handleClose="closeEditModal"
      />

      <!-- 新 Summary Modal（區域基本資料） -->
      <SummaryModal
        v-if="summaryVisible"
        :visible="summaryVisible"
        :loading="loading"
        :summary="selectedSummary"
        :handleClose="closeSummaryModal"
      />

      <!-- 即時需量測點 Drawer -->
      <ConsumableTagsDrawer
        v-if="tagsDrawerVisible"
        :visible="tagsDrawerVisible"
        :loading="loading"
        :summaryId="summaryIdForTags"
        :selectedTagIds="selectedTagIdsForTags"
        :handleClose="closeConsumableTags"
      />

      <!-- 階段管理 Modal -->
      <StageGroupModal
        v-if="stageGroupVisible"
        :visible="stageGroupVisible"
        :loading="loading"
        :summaryId="stageGroupContext.SummaryId"
        :stages="stageGroupContext.StageDetailList"
        :handleClose="closeStageGroup"
        :openStageTag="openStageTag"
      />

      <!-- 階段設備與值 Modal -->
      <StageTagModal
        v-if="stageTagVisible"
        :visible="stageTagVisible"
        :loading="loading"
        :summaryId="stageTagContext.SummaryId"
        :stageDetailId="stageTagContext.StageDetailId"
        :stage="stageTagContext.Stage"
        :handleClose="closeStageTag"
      />

      <UninstallList
        :delete="openDeleteModal"
        :add="openAddSummary"
        :edit="openEditSummary"
        :consumable="openConsumableTags"
        :stageGroup="openStageGroup"
      />
    </Main>
  </div>
</template>
<script src="./main.js"></script>
