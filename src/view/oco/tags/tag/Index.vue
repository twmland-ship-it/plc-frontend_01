<template>
  <div>
    <sdPageHeader
      title="測點"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '測點' }, { breadcrumbName: '測點' }]"
    ></sdPageHeader>
    <Main>
      <sdCards>
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="1" tab="列表">
            <TagList v-if="activeTab === '1'" />
          </a-tab-pane>
          <a-tab-pane key="2" tab="分類">
            <TagClass v-if="activeTab === '2'" />
          </a-tab-pane>
        </a-tabs>
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
