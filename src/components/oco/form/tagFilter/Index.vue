<template>
  <Wrap>
    <span v-if="!multiple">{{ singleTagText }} </span>
    <span v-if="multiple">包含 {{ selectedTags.length }} 個測點 </span>
    <span class="text-primary" @click="openModal"> 選擇測點</span>
    <sdModal
      v-if="modal"
      :title="title ?? '選擇測點'"
      :visible="modal"
      :maskClosable="true"
      :onCancel="closeModal"
      :width="900"
      class="tag-filter-modal"
    >
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol" labelAlign="left">
        <div v-if="isUsageRestricted" class="usage-hint">
          目前僅顯示可使用的測點類型：{{ allowedUsageText }}，可選 {{ availableTagCount }} 個測點。
        </div>
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
        <a-form-item label="測點分類">
          <a-tree-select
            v-model:value="formState.tagClass"
            style="width: 100%"
            :tree-data="tagClassOptions"
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
        <a-form-item v-if="multiple" label="搜尋" style="margin-top: 1rem">
          <a-input v-model:value="formState.searchText"></a-input>
        </a-form-item>
        <a-form-item label="選單顯示">
          <a-radio-group v-model:value="formState.showName">
            <a-radio v-for="v in showNameOptions" :key="v.id" :value="v.id">{{
              v.name
            }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <a-select
        v-if="!multiple"
        v-model:value="formState.tagForSingle"
        style="width: 100%"
        show-search
        option-filter-prop="label"
        :options="tagsOptions"
        :labelInValue="true"
        :allowClear="true"
        :dropdownMatchSelectWidth="false"
      >
      </a-select>
      <!-- 左右佈局：左邊已選擇，右邊可選擇 -->
      <a-row v-if="multiple" :gutter="16" style="margin-top: 1rem">
        <!-- 左側：已選擇的測點 -->
        <a-col :span="12">
          <div class="section-title">
            已選擇的測點 ({{ formState.tags.length }})
            <a-button
              v-if="formState.tags.length > 0"
              type="link"
              size="small"
              @click="clearAllTags"
              class="clear-all-btn"
            >
              清除全部
            </a-button>
          </div>
          <SelectedList>
            <div
              v-for="tag in formState.tags"
              :key="tag.value"
              class="selected-item"
              @click="removeTag(tag)"
            >
              <span>{{ tag.label }}</span>
              <unicon name="times" class="remove-icon"></unicon>
            </div>
            <div v-if="formState.tags.length === 0" class="empty-message">
              尚未選擇任何測點
            </div>
          </SelectedList>
        </a-col>

        <!-- 右側：可選擇的測點 -->
        <a-col :span="12">
          <div class="section-title">
            可選擇的測點
            <span v-if="isUsageRestricted" class="section-subtitle">
              僅列出 {{ allowedUsageText }}
            </span>
          </div>
          <TagList>
            <a-spin v-show="tagSearching"></a-spin>
            <div
              v-for="v in tagsOptions"
              :key="v.value"
              class="tag"
              :class="isExistInSelectedTags(v) && 'selected'"
              @click="setTags(v)"
            >
              {{ v.label }}
            </div>
            <div v-if="tagsOptions.length === 0" class="empty-message">
              目前沒有可使用的測點
            </div>
          </TagList>
        </a-col>
      </a-row>

      <!-- 隱藏的原始 select，用於數據綁定 -->
      <MultiSelector style="display: none;">
        <a-select
          v-if="multiple"
          mode="multiple"
          v-model:value="formState.tags"
          :open="false"
          style="width: 100%"
          :labelInValue="true"
        >
        </a-select>
      </MultiSelector>

      <a-row :gutter="[5, 10]" align="center" style="margin-top: 1rem">
        <a-col>
          <sdButton class="act-btn" type="primary" @click="submit">
            選定測點
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
