<template>
  <InfoWraper>
    <div class="ninjadash-nav-actions__item ninjadash-nav-actions__author">
      <sdPopover placement="bottomRight" action="click">
        <template v-slot:content>
          <UserDropDown>
            <div class="user-dropdown">
              <figure class="user-dropdown__info">
                <!-- <img
                  :src="require('../../../static/img/avatar/chat-auth.png')"
                  alt=""
                /> -->
                <figcaption>
                  <sdHeading as="h5">{{ StaffName }}</sdHeading>
                  <p>管理員</p>
                </figcaption>
              </figure>

              <a @click="SignOut" class="user-dropdown__bottomAction" href="#">
                <LogoutOutlined /> 登出
              </a>
            </div>
          </UserDropDown>
        </template>
        <a to="#" class="ninjadash-nav-action-link">
          <!-- <a-avatar
            :src="require('../../../static/img/avatar/chat-auth.png')"
          /> -->
          <span class="ninjadash-nav-actions__author--name">{{
            StaffName
          }}</span>
          <unicon name="angle-down"></unicon>
        </a>
      </sdPopover>
    </div>
  </InfoWraper>
</template>

<script setup>
import { InfoWraper, UserDropDown } from "./auth-info-style";

import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { LogoutOutlined } from "@ant-design/icons-vue";
import { getItem } from "@/utility/localStorageControl";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { getTenantSlug, TENANT_USER_DATA_STORAGE_KEY } from "@/utility/tenantContext";

const { dispatch } = useStore();
const { push } = useRouter();

// 使用響應式的用戶名稱
const staffName = ref("未知用戶");

// 更新用戶名稱的函數
const updateStaffName = () => {
  const userData = getItem(TENANT_USER_DATA_STORAGE_KEY);
  staffName.value = userData?.StaffName || "未知用戶";
};

// 監聽 localStorage 變化
const handleStorageChange = (e) => {
  if (e.key === TENANT_USER_DATA_STORAGE_KEY) {
    updateStaffName();
  }
};

// 組件掛載時初始化並監聽變化
onMounted(() => {
  updateStaffName();
  window.addEventListener('storage', handleStorageChange);
});

// 組件卸載時移除監聽器
onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange);
});

const StaffName = computed(() => staffName.value);

const SignOut = (e) => {
  e.preventDefault();
  const brandId = getTenantSlug();
  dispatch("auth/logOut");
  push(`/auth/${brandId}`);
};
</script>
