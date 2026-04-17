<template>
  <Wrap>
    <span>包含 {{ selectedGroups.length }} 個群組 </span>
    <span class="text-primary" @click="openModal"> 選擇群組</span>
    <sdModal
      v-if="modal"
      title="選擇群組"
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
        <a-form-item label="群組分類">
          <a-tree-select
            v-model:value="formState.groupClass"
            style="width: 100%"
            :tree-data="groupClassOptions"
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
        <!-- 左側：已選擇的群組 -->
        <a-col :span="12">
          <div class="section-title">
            已選擇的群組 ({{ formState.groups.length }})
            <a-button
              v-if="formState.groups.length > 0"
              type="link"
              size="small"
              @click="clearAllGroups"
              class="clear-all-btn"
            >
              清除全部
            </a-button>
          </div>
          <SelectedList>
            <div
              v-for="group in formState.groups"
              :key="group.value"
              class="selected-item"
              @click="removeGroup(group)"
            >
              <span>{{ group.label }}</span>
              <unicon name="times" class="remove-icon"></unicon>
            </div>
            <div v-if="formState.groups.length === 0" class="empty-message">
              尚未選擇任何群組
            </div>
          </SelectedList>
        </a-col>

        <!-- 右側：可選擇的群組 -->
        <a-col :span="12">
          <div class="section-title">可選擇的群組</div>
          <GroupList>
            <a-spin v-show="groupSearching"></a-spin>
            <div
              v-for="v in groupOptions"
              :key="v.value"
              class="tag"
              :class="isExistInSelectedGroups(v) && 'selected'"
              @click="setGroups(v)"
            >
              {{ v.label }}
            </div>
          </GroupList>
        </a-col>
      </a-row>

      <!-- 隱藏的原始 select，用於數據綁定 -->
      <a-select
        mode="multiple"
        v-model:value="formState.groups"
        :open="false"
        style="width: 100%; display: none;"
        :labelInValue="true"
      >
      </a-select>
      <a-row :gutter="[5, 10]" align="center" style="margin-top: 1rem">
        <a-col>
          <sdButton class="act-btn" type="primary" @click="submit">
            選定群組
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
