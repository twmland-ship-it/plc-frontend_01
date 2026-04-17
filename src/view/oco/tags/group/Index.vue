<template>
  <div>
    <sdPageHeader
      title="群組"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '測點' }, { breadcrumbName: '群組' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="列表">
            <GroupList v-if="activeTab === '1'" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="分類">
            <GroupClass v-if="activeTab === '2'" />
          </a-tab-pane>
        </a-tabs>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
