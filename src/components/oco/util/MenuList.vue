<template>
  <div v-for="v in allList" :key="`${v.Id}`">
    <div v-if="v.Category === 2">
      <a-sub-menu :key="`${parentKey}-${v.Id}`" style="padding-left: 20px">
        <template #title>{{ v.Name }}</template>
        <menu-list
          :allList="v.Children"
          :toggleCollapsed="toggleCollapsed"
          :parentKey="`${parentKey}-${v.Id}`"
          :openKeys="openKeys"
        />
      </a-sub-menu>
    </div>
    <div v-else>
      <a-menu-item @click="toggleCollapsed" :key="`${parentKey}-${v.Id}`">
        <router-link :to="{ name: 'gui-main', params: { id: v.Id } }">
          {{ v.Name }}
        </router-link>
      </a-menu-item>
    </div>
  </div>
</template>

<script setup>
// import MenuList from "./MenuList.vue";
import { defineProps } from "vue";

defineProps({
  openKeys: {
    type: Array,
    default: () => [],
  },
  parentKey: {
    type: String,
    default: null,
  },
  allList: {
    type: Array,
    default: () => [],
  },
  toggleCollapsed: {
    type: Function,
    default: () => {},
  },
});
</script>
