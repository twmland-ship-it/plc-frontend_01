<template>
  <div>
    <a-space>
      <a-select
        v-for="level in levels"
        v-model:value="selected[level]"
        :key="level"
        style="width: 100%; min-width: 100px"
        @change="handleChange(level)"
      >
        <a-select-option v-if="nullOption" :value="null" @click.stop
          >無</a-select-option
        >
        <a-select-option
          v-for="(child, i) in getNextLevel(level)"
          :value="JSON.stringify(child)"
          :key="i"
          @click.stop
        >
          {{ child[childName] }}
        </a-select-option>
      </a-select>
    </a-space>
  </div>
</template>
<script src="./index.js"></script>
<!-- <template>
  <div @click.stop>
    <a-tree-select
      v-model:value="checkedKeys"
      style="width: 100%"
      tree-checkable
      tree-default-expand-all
      :height="233"
      :tree-data="group"
      :show-checked-strategy="SHOW_PARENT"
      :max-tag-count="10"
      :field-names="{
        children: 'children',
        label: 'name',
        value: 'id',
      }"
      tree-node-filter-prop="name"
    >
      <template #title="{ name }">
        <span> {{ name }}</span>
      </template>
    </a-tree-select>
  </div>
</template>
<script src="./index.js"></script> -->
