<template>
  <div>
    <sdPageHeader
      title="即時資料"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '數據中心' }, { breadcrumbName: '即時資料' }]"
    ></sdPageHeader>
    <Main>
      <sdCards title="條件篩選">
        <a-form
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          labelAlign="left"
        >
          <a-form-item label="測點列表">
            <TagFilter
              :selectedTags="formState.tag.map((el) => el.id)"
              @setTags="setTag"
            />
          </a-form-item>

          <sdButton
            class="act-btn"
            type="primary"
            :disabled="!submitable || loading"
            @click="submit"
          >
            {{ searching ? "查詢中.." : "查詢" }}
            <a-spin v-if="searching" size="small" />
          </sdButton>
        </a-form>
      </sdCards>
      <sdCards v-if="showTable" title="搜尋結果">
        <a-spin v-if="searching" />
        <TableSpan>
          <DataTables
            v-if="!searching"
            :filterOption="true"
            :filterOnchange="true"
            :tableData="data"
            :columns="columns"
            :rowSelection="false"
            :addOption="false"
            :handleDataSearch="search"
            :rowClassFunc="getRowClassName"
          />
        </TableSpan>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
