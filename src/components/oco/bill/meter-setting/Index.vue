<template>
  <Wrap>
    <span>包含 {{ selectedMeters.length }} 個電錶</span>
    <span class="text-primary" @click="openModal"> 選擇電錶</span>
    <sdModal
      v-if="modal"
      title="選擇電錶"
      :visible="modal"
      :onCancel="closeModal"
      :width="900"
      class="tag-filter-modal"
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

      <!-- 左右佈局：左邊已選擇，右邊可選擇 -->
      <a-row :gutter="16" style="margin-top: 1rem">
        <!-- 左側：已選擇的電錶 -->
        <a-col :span="12">
          <div class="section-title">
            已選擇的電錶 ({{ formState.meters.length }})
            <a-button
              v-if="formState.meters.length > 0"
              type="link"
              size="small"
              @click="clearAllMeters"
              class="clear-all-btn"
            >
              清除全部
            </a-button>
          </div>
          <SelectedList>
            <div
              v-for="meter in formState.meters"
              :key="meter.value"
              class="selected-item"
              @click="removeMeter(meter)"
            >
              <span>{{ meter.label }}</span>
              <unicon name="times" class="remove-icon"></unicon>
            </div>
            <div v-if="formState.meters.length === 0" class="empty-message">
              尚未選擇任何電錶
            </div>
          </SelectedList>
        </a-col>

        <!-- 右側：可選擇的電錶 -->
        <a-col :span="12">
          <div class="section-title">
            可選擇的電錶
            <a-button
              ghost
              type="primary"
              size="small"
              @click="setAllSelected"
              style="margin-left: 8px;"
            >
              全選
            </a-button>
          </div>
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
        </a-col>
      </a-row>

      <!-- 隱藏的原始 select，用於數據綁定 -->
      <a-select
        mode="multiple"
        v-model:value="formState.meters"
        :open="false"
        style="width: 100%; display: none;"
        :labelInValue="true"
        :allowClear="true"
      >
      </a-select>

      <a-row :gutter="[5, 10]" align="center" style="margin-top: 1rem">
        <a-col>
          <sdButton class="act-btn" type="primary" @click="submit">
            選定電錶
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
