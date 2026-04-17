<template>
  <Wrap>
    <sdModal
      v-if="columnModal"
      title="設定欄位"
      :visible="columnModal"
      @cancel="closeModal"
    >
      <ColumnSet
        :dataSource="columnData"
        :columns="settingColumn"
        @addTag="addColumnTag"
        @changeData="editColumnTag"
        @deleteTag="deleteColumnTag"
      />
      <a-row :gutter="[5, 10]" align="center" style="margin-top: 1rem">
        <a-col>
          <sdButton class="act-btn" type="primary" @click="submitColumn">
            確定
          </sdButton>
        </a-col>
        <a-col>
          <sdButton class="act-btn" type="light" @click="closeModal">
            取消
          </sdButton>
        </a-col>
      </a-row>
    </sdModal>
    <CommonSearch
      :loading="loading"
      :sourceData="commonSearchData"
      :deleteFunc="deleteCommonSearch"
      @submit="useSearch"
    />
    <!-- <sdModal
      v-if="commonSearchModal"
      title="常用搜尋"
      :visible="commonSearchModal"
      @cancel="closeCommonSearchModal"
    >
      <a-list
        :loading="loading"
        item-layout="horizontal"
        :data-source="commonSearchData"
      >
        <template #renderItem="{ item }">
          <a-list-item style="cursor: pointer" @click="useSearch(item.Value)">
            <template #actions>
              <a style="color: #ff8000" @click.stop="deleteSearch(item.Key)"
                >刪除</a
              >
            </template>
            {{ JSON.parse(item.Value)?.name }}
          </a-list-item>
        </template>
      </a-list>
    </sdModal>
    <sdButton
      type="primary"
      style="margin-bottom: 1rem"
      @click="openCommonSearchModal"
      >常用搜尋</sdButton
    > -->
    <a-form
      :model="filterFormState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      labelAlign="left"
    >
      <a-form-item label="報表種類">
        <a-radio-group v-model:value="filterFormState.searchType">
          <a-radio v-for="v in ['統計報表', '對比報表']" :key="v" :value="v">{{
            v
          }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="測點列表">
        <span class="text-primary" @click="openModal">
          包含 {{ filterFormState.tags.length }} 個測點</span
        >
      </a-form-item>

      <a-form-item v-if="!usePeriod" label="圖表種類">
        <a-select
          v-model:value="filterFormState.chartType"
          style="width: 150px"
        >
          <a-select-option
            v-for="v in chartTypeOptions"
            :key="v.id"
            :value="v.id"
            :label="v.name"
            >{{ v.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="
          (filterFormState.chartType === 'bar' ||
            filterFormState.chartType === 'pie') &&
          filterFormState.searchType === '統計報表'
        "
        label="圖表統計方式"
      >
        <a-select
          v-model:value="filterFormState.chartSummary"
          style="width: 150px"
        >
          <a-select-option
            v-for="v in chartSummaryOptions"
            :key="v.value"
            :value="v.value"
            :label="v.label"
            >{{ v.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="filterFormState.searchType === '統計報表'"
        label="報表種類"
      >
        <a-select
          v-model:value="filterFormState.reportType"
          style="width: 150px"
        >
          <a-select-option
            v-for="v in reportTypeOptions"
            :key="v.value"
            :value="v.value"
            :label="v.label"
            >{{ v.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="filterFormState.searchType === '對比報表'"
        label="對比方式"
      >
        <a-select
          v-model:value="filterFormState.compareType"
          style="width: 150px"
        >
          <a-select-option
            v-for="v in compareTypeOptions"
            :key="v.id"
            :value="v.id"
            :label="v.name"
            >{{ v.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="
          filterFormState.reportType !== 'detail' ||
          filterFormState.searchType === '對比報表'
        "
        label="資料統計方式"
      >
        <a-select
          v-model:value="filterFormState.reportSummary"
          style="width: 150px"
        >
          <a-select-option
            v-for="v in summaryTypeOptions"
            :key="v.value"
            :value="v.value"
            :label="v.label"
            >{{ v.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item v-if="!usePeriod" label="日期區間">
        <a-range-picker v-model:value="filterFormState.date" />
        <PeriodSelect @setDate="setDate" />
      </a-form-item>
      <a-form-item v-if="usePeriod" label="日期區間">
        <a-select v-model:value="filterFormState.date" style="width: 100%">
          <a-select-option
            v-for="v in schedulePeriodOptions"
            :key="v.Id"
            :value="v.Id"
          >
            {{ v.Name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </Wrap>
</template>
<script src="./main.js"></script>
