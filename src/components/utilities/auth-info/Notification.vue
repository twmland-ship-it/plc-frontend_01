<template>
  <div class="">
    <sdPopover placement="bottomLeft" action="click">
      <template v-slot:content>
        <NinjadashTopDropdown class="ninjadash-top-dropdown">
          <sdHeading as="h5" class="ninjadash-top-dropdown__title">
            <span class="title-text">重要警報</span>
            <a-badge class="badge-alert" :count="alarms.length" />
          </sdHeading>
          <div v-if="alarms.length === 0" style="text-align: center">
            暫無重要警報
          </div>
          <perfect-scrollbar
            v-if="alarms.length >= 1"
            :options="{
              wheelSpeed: 1,
              swipeEasing: true,
              suppressScrollX: true,
            }"
          >
            <ul class="ninjadash-top-dropdown__nav notification-list">
              <li v-for="v in importantAlarmSummary" :key="v.Id">
                <a to="#">
                  <div class="ninjadash-top-dropdown__content notifications">
                    <div class="notification-content d-flex">
                      <div class="notification-text">
                        <sdHeading as="h5">
                          測點: {{ v.ComponentName }}<br />
                          警報說明: {{ v.AlarmDescription }}
                        </sdHeading>
                        <p>{{ formatTime(v.AlarmTime) }}</p>
                      </div>
                    </div>
                  </div>
                </a>
              </li>
            </ul>
          </perfect-scrollbar>
          <router-link class="btn-seeAll" :to="{ name: 'alarm-history' }">
            查看所有警報
          </router-link>
        </NinjadashTopDropdown>
      </template>
      <div v-show="isAlarm" class="icon-container">
        <div class="small-circle">
          <font-awesome-icon
            :icon="faExclamationCircle"
            style="font-size: 32px; width: 32px; height: 32px; color: red"
          />
        </div>
      </div>
    </sdPopover>
  </div>
</template>
<script>
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";
import { NinjadashTopDropdown } from "./auth-info-style";
import { defineComponent, computed } from "vue";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";

export default defineComponent({
  name: "Notification",
  components: {
    NinjadashTopDropdown,
    PerfectScrollbar,
  },
  props: {
    alarms: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const isAlarm = computed(() => props.alarms.length > 0);
    const importantAlarmSummary = computed(() => props.alarms);
    const formatTime = (t) => dayjs(t).format("YYYY-MM-DD HH:mm:ss");
    return { faExclamationCircle, isAlarm, importantAlarmSummary, formatTime };
  },
});
</script>
<style scoped>
.ps {
  height: 200px;
}
.icon-container {
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: relative;
  line-height: 32px;
  animation: pingEffect 2s infinite;
}

.alarm {
  animation: pingEffect 2s infinite;
}

.small-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  position: absolute;
  left: 0px;
}

@keyframes pingEffect {
  0% {
    box-shadow: 0 0 0 0px rgba(255, 0, 0, 0.8),
      0 0 0 0px rgba(255, 153, 153, 0.8);
  }
  100% {
    box-shadow: 0 0 0 20px rgba(255, 0, 0, 0), 0 0 0 50px rgba(255, 153, 153, 0);
  }
}
</style>
