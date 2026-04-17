<template>
  <div>
    <sdPageHeader
      title="故障分析"
      class="ninjadash-page-header-main"
      :routes="[
        { breadcrumbName: '警報系統' },
        { breadcrumbName: '故障分析' },
      ]"
    ></sdPageHeader>

    <AddModal
      :modal="modal"
      :formState="formState"
      :closeModal="closeAddModal"
      @setTags="setTags"
      @setGroups="setGroups"
      @changeSearchType="changeSearchType"
      @submit="submitGroup"
    />
    <DetailModal
      :modal="detailModal"
      :title="detailModalTitle"
      :closeModal="closeDetailModal"
    />
    <Main>
      <sdButton
        v-if="permission.create"
        class="act-btn"
        type="primary"
        style="margin-bottom: 1rem"
        @click="openAddModal"
      >
        新增
      </sdButton>
      <div v-if="loading">
        <a-spin />
      </div>
      <div v-if="!loading">
        <div v-if="groups.length === 0">尚未建立任何群組</div>
        <a-row v-if="groups.length !== 0" :gutter="[10, 10]">
          <a-col v-for="v in groups" :key="v.id" :lg="6" :md="12" :xs="24">
            <CardWrap>
              <sdCards :title="v.title">
                <a-row align="space-between" style="margin-bottom: 1rem">
                  <h3>{{ v.Name }}</h3>
                  <a-space>
                    <a-button
                      v-if="permission.delete"
                      ghost
                      type="danger"
                      class="del-btn"
                      @click.prevent="deleteGroup(v.Id)"
                      ><unicon name="trash"></unicon
                    ></a-button>
                    <a-button
                      v-if="permission.update"
                      ghost
                      type="primary"
                      @click.prevent="openEditModal(v)"
                      ><unicon name="setting"></unicon
                    ></a-button>
                  </a-space>
                </a-row>
                <p>上次重置時間: {{ v.resetTime }}</p>
                <div class="ninjadash-chart-container">
                  <Chart
                    v-if="showChart"
                    :id="`pieChart-${v.Id}`"
                    type="pie"
                    className="piewrap"
                    :labels="label"
                    :options="options"
                    :datasets="v.datasets"
                  />
                </div>
                <a-row style="margin-top: 1rem">
                  <a-col class="bordered-col" :span="12"
                    ><a-row align="space-between">
                      <a-col>故障次數</a-col>
                      <a-col class="action" @click="resetCount(v.Id)"
                        >重置</a-col
                      >
                    </a-row></a-col
                  >
                  <a-col
                    class="bordered-col"
                    style="text-align: right"
                    :span="12"
                    >{{ v.TotalFaultCount }}</a-col
                  >
                  <a-col class="bordered-col" :span="12"
                    ><a-row align="space-between">
                      <a-col>總次數</a-col>
                    </a-row></a-col
                  >
                  <a-col
                    class="bordered-col"
                    style="text-align: right"
                    :span="12"
                    >{{ v.FaultToleranceCount }}</a-col
                  >
                </a-row>
              </sdCards>
            </CardWrap>
          </a-col>
        </a-row>
      </div>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
