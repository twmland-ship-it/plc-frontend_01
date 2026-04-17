<template>
  <sdCards>
    <a-spin v-if="loading" />
    <DataTables
      v-if="!loading"
      :filterOption="true"
      :filterOnchange="true"
      :tableData="tableData"
      :columns="columns"
      :rowSelection="false"
      :handleDataSearch="search"
    />
  </sdCards>
</template>
<script src="./main.js"></script>
