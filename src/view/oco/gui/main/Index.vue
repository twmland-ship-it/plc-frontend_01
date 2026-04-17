<template>
  <div>
    <!-- <sdPageHeader
      :title="title"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '監控系統' }]"
    ></sdPageHeader> -->
    <Main :class="{ 'iframe-layout': guiType === 5 }">
      <div v-if="!init" style="padding: 1rem">
        <a-spin></a-spin>
      </div>
      <GuiNewPage v-if="init && guiType === 6" />
      <!-- ✅ 重要：用 v-show 取代 v-if，避免 init=false 時把 iframe 整個銷毀重建（會導致每次都重新載入 OCOGUI） -->
      <GuiIframe v-if="guiType === 5" v-show="init" />
      <GuiList v-if="init && guiType === 4" />
      <GuiPicture v-if="init && guiType === 3" />
    </Main>
  </div>
</template>
<script src="./main.js"></script>
