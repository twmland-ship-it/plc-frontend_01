<template>
  <div>
    <sdPageHeader
      title="運轉時數"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '數據中心' }, { breadcrumbName: '運轉時數' }]"
    ></sdPageHeader>
    <Main>
      <sdModal
        v-if="addSearchModal"
        :visible="addSearchModal"
        title="新增常用搜尋"
        :onCancel="closeAddSearchModal"
      >
        <a-form :model="addSearchFormState" labelAlign="left">
          <a-form-item
            label="名稱"
            :labelCol="{
              lg: 4,
              xs: 24,
            }"
            :wrapperCol="{
              lg: 20,
              xs: 24,
            }"
          >
            <a-input v-model:value="addSearchFormState.name"></a-input>
          </a-form-item>
          <div style="display: flex; justify-content: end">
            <sdButton type="primary" @click="addSearch"> 儲存 </sdButton>
          </div>
        </a-form>
      </sdModal>
      <commonSearch
        :sourceData="commonSearchList"
        :deleteFunc="deleteCommonSearch"
        :loading="loading"
        @submit="useSearch"
      />
      <sdCards title="條件篩選">
        <a-form
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          labelAlign="left"
        >
          <a-form-item label="測點列表">
            <TagFilter
              title="選擇狀態測點"
              :selectedTags="formState.tags.map((el) => el.id)"
              :allowedUsages="['Status']"
              @setTags="setTags"
            />
            <div class="runtime-filter-hint">
              運轉時數僅支援狀態測點，其他測點已在選單中隱藏。
              目前可選 {{ availableRuntimeTagCount }} 個測點。
            </div>
          </a-form-item>
        </a-form>

        <sdButton
          class="act-btn"
          type="primary"
          :disabled="!submitable || loading"
          @click="submit"
        >
          {{ searching ? "查詢中.." : "查詢" }}
          <a-spin v-if="searching" size="small" />
        </sdButton>
        <a-button
          type="primary"
          ghost
          style="margin-left: 1rem; height: 44px"
          @click="openAddSearchModal"
        >
          加入常用搜尋
        </a-button>
      </sdCards>
      <sdCards v-if="showTable" title="搜尋結果">
        <a-spin v-if="searching" />

        <DataTables
          :filterOption="true"
          :filterOnchange="true"
          :tableData="data"
          :columns="columns"
          :rowSelection="false"
          :addOption="false"
          :exportOption="true"
          :handleDataSearch="search"
        />
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
