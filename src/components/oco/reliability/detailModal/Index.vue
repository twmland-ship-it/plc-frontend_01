<template>
  <div>
    <sdModal
      v-if="modal"
      :title="title"
      :visible="modal"
      :onCancel="closeModal"
      :width="800"
    >
      <sdCards>
        <a-spin v-if="loading"></a-spin>
        <div style="display: flex; justify-content: end; margin-bottom: 1rem">
          <a-input
            style="width: 300px"
            @change="search"
            size="default"
            placeholder="搜尋"
          >
            <template #prefix>
              <unicon name="search"></unicon>
            </template>
          </a-input>
        </div>
        <div class="table-data-view table-responsive">
          <a-table :columns="columns" :data-source="tableData">
            <template #expandedRowRender="{ record }">
              <a-table
                :columns="innerColumns"
                :data-source="record.details"
                :pagination="true"
              >
              </a-table>
            </template>
          </a-table>
        </div>
      </sdCards>
    </sdModal>
  </div>
</template>
<script src="./main.js"></script>
