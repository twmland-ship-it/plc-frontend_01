<template>
  <div
    style="
      padding: 1rem;
      margin-top: 1rem;
      background: #fa8b0c15;
      border-radius: 0.5rem;
      color: #ff8000;
      white-space: pre-line;
    "
    v-html="content"
  ></div>
</template>
<script setup>
import { defineProps } from "vue";
defineProps(["content"]);
</script>
