<template>
  <div>
    <sdModal
      v-if="modal"
      :title="formState.title"
      :visible="modal"
      :onCancel="closeModal"
    >
      <a-form
        ref="formRef"
        :model="formState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        :rules="rules"
        labelAlign="left"
        name="type"
        @finish="submit"
      >
        <a-form-item label="圖表名稱" name="name">
          <a-input v-model:value="formState.name" style="height: 40px" />
        </a-form-item>
        <a-form-item label="總次數" name="count">
          <a-input v-model:value="formState.count" style="height: 40px" />
        </a-form-item>

        <a-form-item label="選擇群組">
          <GroupFilter
            :selectedGroups="formState.groups"
            @setGroups="setGroups"
            style="height: 40px"
          />
        </a-form-item>
        <a-form-item label="選擇測點">
          <TagFilter
            :selectedTags="formState.tags"
            @setTags="setTags"
            style="height: 40px"
          />
        </a-form-item>
        <a-row :gutter="10" justify="center">
          <a-col>
            <a-button type="primary" html-type="submit" style="height: 40px">
              儲存 <a-spin v-show="loading" size="small"
            /></a-button>
          </a-col>
          <a-col>
            <a-button
              type="primary"
              ghost
              style="height: 40px"
              @click.prevent="closeModal"
              >取消</a-button
            >
          </a-col>
        </a-row>
      </a-form>
    </sdModal>
  </div>
</template>
<script src="./main.js"></script>
