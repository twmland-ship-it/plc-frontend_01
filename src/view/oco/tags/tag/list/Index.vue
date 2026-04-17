<template>
  <div>
    <sdModal
      v-if="modal"
      :title="formState.title"
      :visible="modal"
      :width="800"
      :onCancel="closeModal"
    >
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="1" tab="基礎設定" :forceRender="true">
          <TagSetting
            :formState="formState"
            :typeOptions="typeOptions"
            :saveTypeOptions="saveTypeOptions"
            :logTypeOptions="logTypeOptions"
            :unitOptions="unitOptions"
            :dataTypeOptions="dataTypeOptions"
            :classOptions="classOptions"
            :locations="locations"
            @setCCTV="setCCTV"
            @setDevice="setDevice"
          />
        </a-tab-pane>
        <a-tab-pane key="2" tab="警報設定" :forceRender="true">
          <TagAlarm
            :type="formState.type"
            :alarmFormState="alarmFormState"
            :statusOptions="alarmStatusOptions"
            :exceptionUntilOptions="exceptionUntilOptions"
            :exceptionActionOptions="exceptionActionOptions"
            :digitalAlarmValueOptions="digitalAlarmValueOptions"
          />
        </a-tab-pane>
        <a-tab-pane key="3" tab="運算式設定" :forceRender="true">
          <TagExp
            :expFormstate="expFormstate"
            :expressionTypeOptions="expressionTypeOptions"
            @addTag="addTag"
            @removeTag="removeTag"
            @editContent="editContent"
          />
        </a-tab-pane>
      </a-tabs>
      <a-row>
        <a-col
          :lg="{ span: 16, offset: 8 }"
          :md="{ span: 15, offset: 9 }"
          :xs="{ span: 24, offset: 0 }"
        >
          <a-space>
            <sdButton
              class="act-btn"
              type="primary"
              :disabled="loading"
              html-type="submit"
              @click.prevent="modalSubmit"
            >
              儲存
              <a-spin v-show="submitingForm" size="small" />
            </sdButton>
            <sdButton class="act-btn" type="light" @click.prevent="closeModal">
              取消
            </sdButton>
          </a-space>
        </a-col>
      </a-row>
    </sdModal>
    <!-- <sdModal
      v-if="testModal"
      :title="`${currTagName}`"
      :visible="testModal"
      :onCancel="closeTestModal"
    >
      <div>
        {{ currTagValue }}
      </div>
    </sdModal> -->
    <Search>
      <a-collapse v-model:activeKey="collapseKey">
        <a-collapse-panel key="1" header="條件篩選">
          <a-space direction="vertical" size="middle">
            選擇地區:
            <a-tree-select
              v-model:value="filterFormState.region"
              style="width: 300px"
              :tree-data="locations"
              allow-clear
              :field-names="{
                children: 'ChildList',
                label: 'Name',
                value: 'Id',
              }"
              :show-checked-strategy="SHOW_PARENT"
              placeholder="請選擇"
              tree-node-filter-prop="label"
            />

            測點分類:
            <a-tree-select
              v-model:value="filterFormState.tagClass"
              style="width: 300px"
              :tree-data="classOptions"
              allow-clear
              :field-names="{
                children: 'ChildList',
                label: 'Name',
                value: 'Id',
              }"
              :show-checked-strategy="SHOW_PARENT"
              placeholder="請選擇"
              tree-node-filter-prop="label"
            />
          </a-space>
        </a-collapse-panel>
      </a-collapse>
    </Search>
    <a-spin v-if="loading"></a-spin>
    <DataTables
      :filterOption="true"
      :filterOnchange="true"
      :tableData="data"
      :columns="columns"
      :rowSelection="false"
      :addOption="permission.create"
      :handleDataSearch="search"
      :handleAdd="openAddModal"
    />
  </div>
</template>
<script src="./main.js"></script>
