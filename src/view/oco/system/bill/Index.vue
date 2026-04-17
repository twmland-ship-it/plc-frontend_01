<template>
  <div>
    <sdPageHeader
      title="電費計算"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '系統' }, { breadcrumbName: '電費計算' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="契約">
            <Setting />
          </a-tab-pane>
          <a-tab-pane key="2" tab="電表">
            <Meter />
          </a-tab-pane>
          <a-tab-pane key="3" tab="電價">
            <Fee />
          </a-tab-pane>
          <a-tab-pane key="4" tab="查詢" force-render>
            <Calculate />
          </a-tab-pane>
          <a-tab-pane key="5" tab="假日設定" force-render>
            <Holiday />
          </a-tab-pane>
          <a-tab-pane key="6" tab="匯出" force-render>
            <Output />
          </a-tab-pane>
          <a-tab-pane key="7" tab="資料異常" force-render>
            <Anomaly />
          </a-tab-pane>
          <!-- <a-tab-pane key="5" tab="排程" force-render>
            <Schedule />
          </a-tab-pane>
          <a-tab-pane key="6" tab="下載" force-render>
            <BillList />
          </a-tab-pane> -->
        </a-tabs>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
