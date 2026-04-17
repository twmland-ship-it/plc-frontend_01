<template>
  <div>
    <sdPageHeader
      title="首頁"
      class="ninjadash-page-header-main"
      :routes="[{ path: '/', breadcrumbName: '首頁' }]"
    ></sdPageHeader>

    <ModalTable
      v-if="detailModal"
      :modal="detailModal"
      :title="detailModalTitle"
      :columns="detailColumns"
      :tableData="detailTableData"
      :closeModal="closeDetailModal"
      :search="filterDetailTable"
      :loading="loading"
    />

    <sdModal
      v-if="chartSettingModal"
      title="設定圖表參數test"
      :visible="chartSettingModal"
      :onCancel="closeModal"
    >
      <ChartForm
        :sourceData="settingFormState"
        :chartTypeOptions="chartTypeOptions"
        :timePeriodOptions="timePeriodOptions"
        :summaryTypeOptions="summaryTypeOptions"
        :paramSummaryOptions="paramSummaryOptions"
        :unitOptions="unitOptions"
        @submit="submitSetting"
      />
    </sdModal>

    <!-- 縮放設定模態框 -->
    <a-modal
      v-model:visible="resizeModalVisible"
      title="調整圖表大小"
      @ok="saveResizeSettings"
      @cancel="closeResizeModal"
      :okText="'確定'"
      :cancelText="'取消'"
    >
      <div class="resize-form">
        <a-form layout="vertical">
          <a-form-item label="寬度 (列數)">
            <a-slider
              v-model:value="resizeForm.width"
              :min="1"
              :max="24"
              :marks="{ 1: '1列', 6: '6列', 12: '12列', 18: '18列', 24: '24列' }"
            />
            <div class="slider-value">目前: {{ resizeForm.width }} 列</div>
          </a-form-item>
          <a-form-item label="高度 (像素)">
            <a-slider
              v-model:value="resizeForm.height"
              :min="200"
              :max="600"
              :step="50"
              :marks="{ 200: '200px', 300: '300px', 400: '400px', 500: '500px', 600: '600px' }"
            />
            <div class="slider-value">目前: {{ resizeForm.height }}px</div>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <Main>
      <a-spin v-if="loading && !isInit"></a-spin>
      <div v-if="isInit">
        <div style="margin-bottom: 1rem; display: flex; align-items: center; gap: 16px;">
          <sdButton
            v-if="permission.create"
            type="primary"
            @click="openAddModal"
          >
            新增圖表
          </sdButton>
          <div v-if="false" style="display: flex; align-items: center; gap: 8px;">
            <span>編輯模式：</span>
            <a-switch
              v-model:checked="editMode"
              checked-children="開"
              un-checked-children="關"
            />
          </div>
        </div>
        <!-- GridStack 容器 with items -->
        <div ref="gridEl" class="grid-stack">
          <div
            v-for="v in draggableDashboardData"
            :key="v.id"
            class="grid-stack-item"
            :data-id="v.id"
            :gs-x="getGridPos(v.id).x"
            :gs-y="getGridPos(v.id).y"
            :gs-w="getGridPos(v.id).w"
            :gs-h="getGridPos(v.id).h"
          >
            <div class="grid-stack-item-content chart-item">
              <a-card v-if="v.chartType === 'line'" class="column-content">
                <template #title>
                  <div class="chart-title-with-controls">
                    <span>{{ v.name }}</span>
                    <div class="chart-controls">
                      <a-button v-if="editMode" size="small" type="text" class="drag-btn" title="拖曳排序">
                        <unicon name="expand-arrows" width="14"></unicon>
                      </a-button>
                      <a-button v-if="editMode" size="small" type="text" class="resize-btn" title="調整大小" @click.stop="openResizeModal(v)">
                        <unicon name="corner-up-right" width="14"></unicon>
                      </a-button>
                      <a-button v-if="editMode" size="small" type="text" class="reset-btn" title="恢復預設大小" @click.stop="resetChartSize(v.id)">
                        <unicon name="refresh" width="14"></unicon>
                      </a-button>
                    </div>
                  </div>
                </template>
                <template #extra>
                  <a-space>
                    <a-button v-if="permission.delete" ghost type="danger" @click.prevent="deleteChart(v.id)"><unicon name="trash"></unicon></a-button>
                    <a-button v-if="permission.update" ghost type="primary" @click.prevent="openEditModal(v)"><unicon name="setting"></unicon></a-button>
                  </a-space>
                </template>
                <div class="ninjadash-chart-container">
                  <a-row>時間: {{ v.periodText }}</a-row>
                  <div class="chart-container">
                    <Chart
                      :key="`line-${v.id}`"
                      type="line"
                      :id="`chart${v.id}`"
                      className="lineChart"
                      :height="getChartHeight(v.id)"
                      :labels="v.data.labels"
                      :datasets="v.data.datasets"
                      :options="v.data.options"
                    />
                  </div>
                </div>
              </a-card>

              <SalesOverviewStyleWrap2 v-if="v.chartType === 'doughnut'" class="column-content">
                <a-card style="height: auto">
                  <template #title>
                    <div class="chart-title-with-controls">
                      <span>{{ v.name }}</span>
                      <div class="chart-controls">
                        <a-button v-if="editMode" size="small" type="text" class="drag-btn" title="拖曳排序">
                          <unicon name="expand-arrows" width="14"></unicon>
                        </a-button>
                        <a-button v-if="editMode" size="small" type="text" class="resize-btn" title="調整大小" @click.stop="openResizeModal(v)">
                          <unicon name="corner-up-right" width="14"></unicon>
                        </a-button>
                        <a-button v-if="editMode" size="small" type="text" class="reset-btn" title="恢復預設大小" @click.stop="resetChartSize(v.id)">
                          <unicon name="refresh" width="14"></unicon>
                        </a-button>
                      </div>
                    </div>
                  </template>
                  <template #extra>
                    <a-space>
                      <a-button v-if="permission.delete" ghost type="danger" @click.prevent="deleteChart(v.id)"><unicon name="trash"></unicon></a-button>
                      <a-button v-if="permission.update" ghost type="primary" @click.prevent="openEditModal(v)"><unicon name="setting"></unicon></a-button>
                    </a-space>
                  </template>
                  <div class="ninjadash-overview-wrap">
                    <a-row>時間: {{ v.periodText }}</a-row>
                    <p>單位:{{ v.data.unit }}</p>
                    <div :style="{ height: getChartHeight(v.id) + 'px', overflow: 'visible', position: 'relative' }">
                      <DoughnutChart
                        :key="`doughnut-${v.id}`"
                        type="doughnut"
                        :id="`chart${v.id}`"
                        :labels="v.data.labels"
                        :datasets="v.data.datasets"
                        :height="getChartHeight(v.id)"
                        :options="v.data.options"
                      />
                    </div>

                    <div class="ninjadash-overview-percentage" style="flex-wrap: wrap">
                      <div v-for="(value, index) in v.data.datasets[0].data" class="ninjadash-overview-percentage__item" :key="index">
                        <span class="ninjadash-overview-percentage__point" :style="{ backgroundColor: v.data.datasets[0].backgroundColor[index] }"></span>
                        <span class="ninjadash-overview-percentage__text">{{ v.data.labels[index] }}<br />{{ ((value / v.data.datasets[0].data.reduce((a, b) => a + b, 0)) * 100).toFixed(2) }}%</span>
                      </div>
                    </div>

                    <div class="ninjadash-overview-box align-center-v justify-content-between" style="flex-wrap: wrap">
                      <div v-for="(value, index) in v.data.datasets[0].data" class="ninjadash-overview-box-item" style="margin-bottom: 10px" :key="index">
                        <h4>{{ value }}</h4>
                        <p>{{ v.data.labels[index] }}</p>
                      </div>
                    </div>
                  </div>
                </a-card>
              </SalesOverviewStyleWrap2>

              <a-card v-if="v.chartType === 'radialBar'" class="column-content">
                <template #title>
                  <div class="chart-title-with-controls">
                    <span>{{ v.name }}</span>
                    <div class="chart-controls">
                      <a-button v-if="editMode" size="small" type="text" class="drag-btn" title="拖曳排序">
                        <unicon name="expand-arrows" width="14"></unicon>
                      </a-button>
                      <a-button v-if="editMode" size="small" type="text" class="resize-btn" title="調整大小" @click.stop="openResizeModal(v)">
                        <unicon name="corner-up-right" width="14"></unicon>
                      </a-button>
                      <a-button v-if="editMode" size="small" type="text" class="reset-btn" title="恢復預設大小" @click.stop="resetChartSize(v.id)">
                        <unicon name="refresh" width="14"></unicon>
                      </a-button>
                    </div>
                  </div>
                </template>
                <template #extra>
                  <a-space>
                    <a-button v-if="permission.delete" ghost type="danger" @click.prevent="deleteChart(v.id)"><unicon name="trash-alt"></unicon></a-button>
                    <a-button v-if="permission.update" ghost type="primary" @click.prevent="openEditModal(v)"><unicon name="cog"></unicon></a-button>
                  </a-space>
                </template>
                <a-row>時間: {{ v.periodText }}</a-row>
                <p>{{ `單位: ${v.data.unit}` }}</p>
                <div class="ninjadash-chart-container">
                  <div :style="{ height: getChartHeight(v.id) + 'px' }">
                    <OptimizedApexChart
                      :key="`radial-${v.id}-${v.data.series?.length || 0}`"
                      v-if="!loading"
                      type="radialBar"
                      :height="getChartHeight(v.id)"
                      :id="`chart${v.id}`"
                      :options="v.data.chartOptions"
                      :series="v.data.series"
                      @click="v.data.onClick()"
                    />
                  </div>
                </div>
              </a-card>

              <a-card v-if="v.chartType === 'bar'" class="column-content">
                <template #title>
                  <div class="chart-title-with-controls">
                    <span>{{ v.name }}</span>
                    <div class="chart-controls">
                      <a-button v-if="editMode" size="small" type="text" class="drag-btn" title="拖曳排序">
                        <unicon name="expand-arrows" width="14"></unicon>
                      </a-button>
                      <a-button v-if="editMode" size="small" type="text" class="resize-btn" title="調整大小" @click.stop="openResizeModal(v)">
                        <unicon name="corner-up-right" width="14"></unicon>
                      </a-button>
                      <a-button v-if="editMode" size="small" type="text" class="reset-btn" title="恢復預設大小" @click.stop="resetChartSize(v.id)">
                        <unicon name="refresh" width="14"></unicon>
                      </a-button>
                    </div>
                  </div>
                </template>
                <template #extra>
                  <a-space>
                    <a-button v-if="permission.delete" ghost type="danger" @click.prevent="deleteChart(v.id)"><unicon name="trash"></unicon></a-button>
                    <a-button v-if="permission.update" ghost type="primary" @click.prevent="openEditModal(v)"><unicon name="setting"></unicon></a-button>
                  </a-space>
                </template>
                <p>時間: {{ v.periodText }}</p>
                <div class="ninjadash-chart-container">
                  <Chart
                    type="bar"
                    :height="getChartHeight(v.id)"
                    className="bar"
                    :id="`chart${v.id}`"
                    :labels="v.data.labels"
                    :datasets="v.data.datasets"
                    :options="v.data.options"
                  />
                </div>
              </a-card>

              <SubContent v-if="v.chartType === 'card'">
                <div v-if="editMode" class="card-controls-overlay">
                  <a-button size="small" type="text" class="drag-btn" title="拖曳排序">
                    <unicon name="expand-arrows" width="14"></unicon>
                  </a-button>
                  <a-button size="small" type="text" class="resize-btn" title="調整大小" @click.stop="openResizeModal(v)">
                    <unicon name="corner-up-right" width="14"></unicon>
                  </a-button>
                  <a-button size="small" type="text" class="reset-btn" title="恢復預設大小" @click.stop="resetChartSize(v.id)">
                    <unicon name="refresh" width="14"></unicon>
                  </a-button>
                </div>
                <a-card v-for="(k, j) in v.data.data" :key="k.name" :title="k.name ?? '無標題'" class="sub-card">
                  <template #title>
                    <div class="chart-title-with-controls">
                      <span>{{ k.name ?? '無標題' }}</span>
                    </div>
                  </template>
                  <template #extra v-if="j === 0">
                    <a-space>
                      <a-button v-if="permission.delete" ghost type="danger" @click.prevent="deleteChart(v.id)"><unicon name="trash-alt"></unicon></a-button>
                      <a-button v-if="permission.update" ghost type="primary" @click.prevent="openEditModal(v)"><unicon name="cog"></unicon></a-button>
                    </a-space>
                  </template>
                  <div class="quarter-circle">
                    <unicon name="bolt"></unicon>
                  </div>
                  <a-row>時間: {{ v.periodText }}</a-row>
                  <div class="ninjadash-chart-container sub-card-content" @click="v.data.onClick(j)">
                    <vue3-autocounter
                      ref="counter"
                      :startAmount="0"
                      :endAmount="Number(k.summary)"
                      :duration="1.5"
                      :prefix="''"
                      :suffix="''"
                      separator="," decimalSeparator="."
                      :decimals="2"
                      :autoinit="true"
                    ></vue3-autocounter>
                    <p class="suffix-text">{{ v.data.unit }}</p>
                  </div>
                </a-card>
              </SubContent>
            </div>
          </div>
        </div>
      </div>
    </Main>
  </div>
</template>

<script src="./index.js"></script>

<style scoped>
.chart-item {
  width: 100%;
  height: 100%;
}

.chart-item .ant-card {
  height: 100%;
  width: 100%;
  overflow: visible;
}

.chart-item .ant-card-body {
  height: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  z-index: 1;
  position: relative;
  overflow: hidden;
  max-height: 100%;
}

.chart-item .ant-card-head {
  overflow: visible;
  z-index: 9997;
  position: relative;
}

.chart-container {
  flex: 1;
  min-height: 0; /* 重要：讓 flex 子元素能正確縮放 */
  display: flex;
  flex-direction: column;
  height: auto;
  overflow: hidden;
  max-height: calc(100% - 80px);
  position: relative;
}

/* --- Style Fix --- */
/* 統所有 antd 卡片標題的樣式 */
:deep(.ant-card-head-title) {
  font-size: 18px !important;
  font-weight: 600 !important;
  padding: 0 !important; /* 移除內邊距以修正對齊 */
}
.chart-title-with-controls {
  display: flex;
  align-items: center; /* 統一垂直居中對齊 */
  justify-content: space-between;
  width: 100%;
}
/* 確保自定義 title 內文字與 .ant-card-head-title 一致 */
.chart-title-with-controls > span {
  font-size: 18px !important;
  font-weight: 600 !important;
}
/* --- End Style Fix --- */
</style>
