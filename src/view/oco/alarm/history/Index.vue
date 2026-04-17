<template>
  <div>
    <sdPageHeader
      title="歷史警報"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '警報系統' }, { breadcrumbName: '歷史警報' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-form
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          labelAlign="left"
        >
          <!-- <a-form-item label="搜尋條件">
            <a-select v-model:value="formState.searchType" style="width: 150px">
              <a-select-option
                v-for="v in searchTypeOptions"
                :key="v.Id"
                :value="v.Id"
                :label="v.Name"
                >{{ v.Name }}</a-select-option
              >
            </a-select>
          </a-form-item> -->
          <a-form-item v-if="formState.searchType === 1" label="測點列表">
            <TagFilter
              :selectedTags="formState.tags.map((el) => el.id)"
              @setTags="setTags"
            />
          </a-form-item>
          <!-- <a-form-item v-else label="群組列表">
            <GroupFilter
              :selectedGroups="formState.groups"
              @setGroups="setGroups"
            />
          </a-form-item> -->
          <a-form-item label="時間">
            <a-range-picker v-model:value="formState.date" :bordered="false" />
            <PeriodSelect @setDate="setDate" />
          </a-form-item>
        </a-form>

        <sdButton
          v-permission="'read'"
          class="act-btn"
          type="primary"
          :disabled="!sumitable"
          @click="submit"
        >
          {{ searching ? "查詢中.." : "查詢" }}
          <a-spin v-if="searching" size="small" />
        </sdButton>
      </sdCards>
      <sdCards>
        <a-spin v-if="searching"></a-spin>
        <DataTables
          v-if="showTable"
          :filterOption="true"
          :filterOnchange="true"
          :tableData="tableData"
          :columns="columns"
          :rowSelection="false"
          :exportOption="permission.read"
          :handleDataSearch="search"
        />
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
