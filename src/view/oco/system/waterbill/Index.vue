<template>
  <div>
    <sdPageHeader
      title="水費計算"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '系統' }, { breadcrumbName: '電費計算' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="水表">
            <Meter />
          </a-tab-pane>
          <a-tab-pane key="2" tab="水價" force-render>
            <Fee />
          </a-tab-pane>
          <a-tab-pane key="3" tab="查詢" force-render>
            <Calculate />
          </a-tab-pane>
          <!-- <a-tab-pane key="4" tab="排程" force-render>
            <Schedule />
          </a-tab-pane>
          <a-tab-pane key="5" tab="下載" force-render>
            <BillList />
          </a-tab-pane> -->
        </a-tabs>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
