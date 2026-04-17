<template>
  <div>
    <sdPageHeader
      title="BTU"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '系統' }, { breadcrumbName: '電費計算' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="BTU表">
            <Meter />
          </a-tab-pane>
          <a-tab-pane key="2" tab="查詢" force-render>
            <Calculate />
          </a-tab-pane>
        </a-tabs>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
