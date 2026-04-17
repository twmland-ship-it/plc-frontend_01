<template>
  <Wrap>
    <span>包含 {{ selectedMeters.length }} 個水錶</span>
    <span class="text-primary" @click="openModal"> 選擇水錶</span>
    <sdModal
      v-if="modal"
      title="選擇水錶"
      :visible="modal"
      :onCancel="closeModal"
    >
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
        <a-form-item label="地區" style="margin-top: 1rem">
          <a-tree-select
            v-model:value="formState.regionId"
            style="width: 100%"
            :tree-data="locations"
            allow-clear
            :field-names="{
              children: 'ChildList',
              label: 'Name',
              value: 'Id',
            }"
            placeholder="請選擇"
            tree-node-filter-prop="label"
          />
        </a-form-item>
      </a-form>

      <a-select
        mode="multiple"
        v-model:value="formState.meters"
        :open="false"
        style="width: 100%"
        :labelInValue="true"
        :allowClear="true"
      >
      </a-select>
      <a-button
        ghost
        type="primary"
        style="margin-top: 1rem"
        @click="setAllSelected"
        >全選</a-button
      >
      <TagList>
        <a-spin v-show="tagSearching"></a-spin>
        <div
          v-for="v in meterOptions"
          :key="v.value"
          class="tag"
          :class="isExistInSelectedMeters(v) && 'selected'"
          @click="setMeters(v)"
        >
          {{ v.label }}
        </div>
      </TagList>
      <a-row :gutter="[5, 10]" align="center" style="margin-top: 1rem">
        <a-col>
          <sdButton class="act-btn" type="primary" @click="submit">
            選定水錶
          </sdButton>
        </a-col>
        <a-col>
          <sdButton class="act-btn" type="light" @click="closeModal">
            取消
          </sdButton>
        </a-col>
      </a-row>
    </sdModal>
  </Wrap>
</template>
<script src="./main.js"></script>
