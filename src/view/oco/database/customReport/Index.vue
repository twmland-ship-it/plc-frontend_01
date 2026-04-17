<template>
  <div>
    <sdPageHeader
      title="匯出報表"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '數據中心' }, { breadcrumbName: '匯出報表' }]"
    ></sdPageHeader>
    <Main>
      <a-card>
        <a-form
          labelAlign="left"
          :label-col="{
            lg: 2,
            md: 9,
            xs: 24,
          }"
          :wrapper-col="{
            lg: 10,
            md: 15,
            xs: 24,
          }"
        >
          <a-form-item label="報表">
            <a-select v-model:value="formState.report" style="width: 100%">
              <a-select-option
                v-for="(v, i) in reportList"
                :key="i"
                :value="v.fileName"
                >{{ v.fileName }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="時間">
            <a-range-picker
              v-model:value="formState.date"
              style="width: 100%"
            />
            <div>
              <PeriodSelect @setDate="setDate" />
            </div>
          </a-form-item>
        </a-form>

        <sdButton
          class="act-btn"
          type="primary"
          :disabled="loading"
          @click="exportReport"
        >
          {{ loading ? "匯出中.." : "匯出" }}
          <a-spin v-if="loading" size="small" />
        </sdButton>
      </a-card>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
