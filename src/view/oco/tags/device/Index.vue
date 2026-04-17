<template>
  <div>
    <sdPageHeader
      title="裝置"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '測點' }, { breadcrumbName: '裝置' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="裝置列表">
            <DeviceList v-if="activeTab === '1'" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="裝置分類">
            <DeviceClass v-if="activeTab === '2'" />
          </a-tab-pane>
        </a-tabs>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
