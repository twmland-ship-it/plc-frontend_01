<template>
  <div>
    <sdPageHeader
      title="歷史報表"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '數據中心' }, { breadcrumbName: '歷史報表' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="查詢">
            <Search />
          </a-tab-pane>
          <a-tab-pane key="2" tab="排程">
            <Schedule />
          </a-tab-pane>
          <a-tab-pane key="3" tab="下載">
            <Download />
          </a-tab-pane>
        </a-tabs>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
