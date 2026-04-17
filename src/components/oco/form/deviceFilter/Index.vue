<template>
  <Wrap>
    <span> {{ deviceName }} </span>
    <span class="text-primary" @click="openModal"> 選擇裝置</span>
    <sdModal
      v-if="modal"
      title="選擇裝置"
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
        <a-form-item label="裝置分類">
          <a-tree-select
            v-model:value="formState.deviceClass"
            style="width: 100%"
            :tree-data="deviceClassOptions"
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
      <!-- 左右佈局：左邊當前選擇，右邊可選擇 -->
      <a-row :gutter="16" style="margin-top: 1rem">
        <!-- 左側：當前選擇的裝置 -->
        <a-col :span="12">
          <div class="section-title">當前選擇的裝置</div>
          <SelectedDevice>
            <div v-if="formState.device && formState.device.value" class="current-device">
              <span>{{ formState.device.label }}</span>
              <unicon name="times" class="remove-icon" @click="clearDevice"></unicon>
            </div>
            <div v-else class="empty-message">
              尚未選擇任何裝置
            </div>
          </SelectedDevice>
        </a-col>

        <!-- 右側：可選擇的裝置 -->
        <a-col :span="12">
          <div class="section-title">可選擇的裝置</div>
          <DeviceList>
            <div
              v-for="device in deviceOptions"
              :key="device.value"
              class="device"
              :class="formState.device && formState.device.value === device.value && 'selected'"
              @click="selectDevice(device)"
            >
              {{ device.label }}
            </div>
          </DeviceList>
        </a-col>
      </a-row>

      <!-- 隱藏的原始 select，用於數據綁定 -->
      <a-select
        v-model:value="formState.device"
        style="width: 100%; display: none;"
        :options="deviceOptions"
        :labelInValue="true"
        show-search
      >
      </a-select>
      <a-row :gutter="[5, 10]" align="center" style="margin-top: 1rem">
        <a-col>
          <sdButton class="act-btn" type="primary" @click="setDevice">
            選定裝置
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
