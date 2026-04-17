<template>
  <div>
    <sdPageHeader
      title="通知設定"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '通知' }, { breadcrumbName: '通知設定' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="Line">
            <NotifyLine />
          </a-tab-pane>
          <a-tab-pane key="2" tab="Email">
            <NotifyEmail />
          </a-tab-pane>
        </a-tabs>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
