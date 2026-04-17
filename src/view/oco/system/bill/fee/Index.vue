<template>
  <div>
    <!-- 年月選擇 Modal -->
    <sdModal
      v-if="yearMonthModal"
      title="選擇電價實施年月"
      :visible="yearMonthModal"
      :onCancel="cancelYearMonth"
      style="width: 400px;"
    >
      <a-form :model="yearMonthForm" @finish="confirmYearMonth">
        <a-row :gutter="16" align="middle" style="margin-bottom: 20px;">
          <a-col span="8">
            <label style="font-weight: 600;">電價實施年：</label>
          </a-col>
          <a-col span="16">
            <a-select
              v-model:value="yearMonthForm.year"
              style="width: 100%;"
              placeholder="請選擇年份"
            >
              <a-select-option v-for="year in Array.from({length: 81}, (_, i) => 2020 + i)" :key="year" :value="year">
                {{ year }}年
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>

        <a-row :gutter="16" align="middle" style="margin-bottom: 30px;">
          <a-col span="8">
            <label style="font-weight: 600;">電價實施月：</label>
          </a-col>
          <a-col span="16">
            <a-select
              v-model:value="yearMonthForm.month"
              style="width: 100%;"
              placeholder="請選擇月份"
            >
              <a-select-option v-for="month in Array.from({length: 12}, (_, i) => i + 1)" :key="month" :value="month">
                {{ month }}月
              </a-select-option>
            </a-select>
          </a-col>
        </a-row>

        <a-row justify="center" :gutter="16">
          <a-col>
            <sdButton
              type="primary"
              html-type="submit"
              :disabled="loading"
            >
              確認
            </sdButton>
          </a-col>
          <a-col>
            <sdButton type="light" @click="cancelYearMonth">
              取消
            </sdButton>
          </a-col>
        </a-row>
      </a-form>
    </sdModal>

    <!-- 主要設定 Modal -->
    <sdModal
      v-if="modal"
      :title="formState.title"
      :visible="modal"
      :onCancel="closeModal"
      style="width: 90%; max-width: 1200px;"
    >
      <a-form :model="formState" :rules="rules" @finish="submit">
        <HighTwo v-model:value="formState" v-if="fee === '1' || fee === '3'" />
        <HighThree
          v-model:value="formState"
          v-if="fee === '2' || fee === '4'"
        />
        <LowVoltageNonTime
          :value="formState"
          @update:value="handleLowVoltageUpdate"
          v-if="fee === '5'"
        />
        <a-row :gutter="[5, 10]" align="center" style="margin-top: 0.5rem">
          <a-col>
            <sdButton
              class="act-btn"
              type="primary"
              html-type="submit"
              :disabled="loading"
            >
              儲存
              <a-spin v-show="loading" size="small" />
            </sdButton>
          </a-col>
          <a-col>
            <sdButton class="act-btn" type="light" @click="closeModal">
              取消
            </sdButton>
          </a-col>
        </a-row>
      </a-form>
    </sdModal>
    選擇計費方式:
    <a-select
      :options="feeOptions"
      v-model:value="fee"
      style="width: 200px; margin-left: 1rem"
    >
    </a-select>
    <DataTables
      v-if="!loading && fee"
      :filterOption="false"
      :filterOnchange="true"
      :tableData="tableData"
      :columns="columns"
      :rowSelection="false"
      :addOption="true"
      :handleAdd="openAddModal"
    />
  </div>
</template>
<script src="./main.js"></script>
