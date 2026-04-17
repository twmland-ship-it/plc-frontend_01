<template>
  <CustomDropDown id="dropdownParent">
    <div
      v-if="isVisible"
      class="ninjadash-range-calendar"
      placement="bottomRight"
      title="Search by Calendar"
      action="click"
    >
      <v-calendar
        :columns="$screens({ default: 1, lg: 2 })"
        is-expanded
        v-model="range"
        is-range
      />
    </div>
    <sdButton @click="handleVisible" size="sm" type="white">
      <unicon name="calendar-alt" width="14"></unicon>
      <span>Calendar</span>
    </sdButton>
  </CustomDropDown>
</template>

<script>
import { onMounted, ref, defineComponent, onBeforeUnmount } from "vue";
import { CustomDropDown } from "./styled";

export default defineComponent({
  name: "CalendarButton",
  components: {
    CustomDropDown,
  },
  data() {
    return {
      range: {
        start: new Date(2021, 0, 1),
        end: new Date(2021, 0, 5),
      },
    };
  },
  setup() {
    const isVisible = ref(false);
    const handleVisible = () => {
      isVisible.value = !isVisible.value;
    };

    const onBodyClick = (e) => {
      if (e.target.closest("#dropdownParent")) {
        return false;
      } else {
        isVisible.value = false;
      }
    };

    onMounted(() => {
      document.body.addEventListener("click", onBodyClick);
    });

    onBeforeUnmount(() => {
      document.body.removeEventListener("click", onBodyClick);
    });

    return {
      handleVisible,
      isVisible,
    };
  },
});
</script>

<style>
.ant-page-header-heading {
  overflow: visible;
}
</style>
