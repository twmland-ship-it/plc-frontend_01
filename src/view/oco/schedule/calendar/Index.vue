<template>
  <div>
    <sdPageHeader
      title="日曆設定"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '排程' }, { breadcrumbName: '日曆設定' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="日曆">
            <holiday />
          </a-tab-pane>
          <a-tab-pane key="2" tab="季節/區間">
            <season />
          </a-tab-pane>
        </a-tabs>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
