<template>
  <div>
    <sdPageHeader
      title="電力卸載"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '系統' }, { breadcrumbName: '電力卸載' }]"
    />
    <Main>
      <UninstallList />
    </Main>
  </div>
</template>

<script src="./main.js"></script>

