<template>
  <Wrap>
    <span>包含 {{ values.length }} 個CCTV</span>
    <span class="text-primary" @click="openModal"> 選擇CCTV</span>
    <sdModal
      v-if="modal"
      title="選擇CCTV"
      :visible="modal"
      :maskClosable="true"
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
        <!-- 左側：已選擇的CCTV -->
        <a-col :span="12">
          <div class="section-title">
            已選擇的CCTV ({{ formState.cctvs.length }})
            <a-button
              v-if="formState.cctvs.length > 0"
              type="link"
              size="small"
              @click="clearAllCCTVs"
              class="clear-all-btn"
            >
              清除全部
            </a-button>
          </div>
          <SelectedList>
            <div
              v-for="cctv in formState.cctvs"
              :key="cctv.value"
              class="selected-item"
              @click="removeCCTV(cctv)"
            >
              <span>{{ cctv.label }}</span>
              <unicon name="times" class="remove-icon"></unicon>
            </div>
            <div v-if="formState.cctvs.length === 0" class="empty-message">
              尚未選擇任何CCTV
            </div>
          </SelectedList>
        </a-col>

        <!-- 右側：可選擇的CCTV -->
        <a-col :span="12">
          <div class="section-title">可選擇的CCTV</div>
          <CCTVList>
            <div
              v-for="cctv in CCTVOptions"
              :key="cctv.value"
              class="cctv"
              :class="isExistInSelectedCCTVs(cctv) && 'selected'"
              @click="setCCTVs(cctv)"
            >
              {{ cctv.label }}
            </div>
          </CCTVList>
        </a-col>
      </a-row>

      <!-- 隱藏的原始 select，用於數據綁定 -->
      <a-select
        v-model:value="formState.cctvs"
        mode="multiple"
        style="width: 100%; display: none;"
        :options="CCTVOptions"
        :labelInValue="true"
      >
      </a-select>
      <a-row :gutter="[5, 10]" align="center" style="margin-top: 1rem">
        <a-col>
          <sdButton class="act-btn" type="primary" @click="setCCTV">
            選定CCTV
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
