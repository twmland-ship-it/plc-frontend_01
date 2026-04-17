<template>
  <a-form :model="formState" labelAlign="left" ref="formRef" :rules="rules">
    <a-form-item label="動作" :labelCol="{ sm: 4 }" :wrapperCol="{ sm: 20 }">
      <a-select v-model:value="formState.eventType" style="height: 40px">
        <a-select-option
          v-for="options in eventTypeOptions"
          :value="options.id"
          :key="options.id"
        >
          {{ options.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <EventForm
      v-if="formState.eventType === 2"
      :dataSource="formState.eventTagsData"
      :columns="eventColumns"
      @addTag="addEventTag"
      @changeData="editEventTag"
      @deleteTag="deleteEventTag"
    />
    <a-form-item
      v-if="formState.eventType === 3"
      :labelCol="{ sm: 4 }"
      :wrapperCol="{ sm: 20 }"
      label="目標測點"
      name="eventTargetTagId"
    >
      <TagFilter
        :multiple="false"
        :value="formState.eventTargetTagId"
        @setSingleTag="setTargetTag"
      />
    </a-form-item>
    <a-form-item
      v-if="formState.eventType === 4"
      :labelCol="{ sm: 4 }"
      :wrapperCol="{ sm: 20 }"
      label="選擇頁面"
      name="link"
    >
      <a-tree-select
        v-model:value="formState.link"
        style="width: 100%"
        :tree-data="pageOptions"
        allow-clear
        :field-names="{
          children: 'Children',
          label: 'Name',
          value: 'Id',
        }"
        placeholder="請選擇"
        tree-node-filter-prop="label"
      >
      </a-tree-select>
    </a-form-item>
  </a-form>
</template>
<script src="./main.js"></script>
