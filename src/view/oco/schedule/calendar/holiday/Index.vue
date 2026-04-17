<template>
  <sdModal
    v-if="modal"
    title="設定假日"
    :visible="modal"
    :onCancel="closeModal"
  >
    <a-form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      :rules="rules"
      labelAlign="left"
      @finish="submitForm"
    >
      <a-form-item label="描述" name="description">
        <a-input
          v-model:value="formState.description"
          placeholder="請輸入標題"
        />
      </a-form-item>
      <a-form-item label="重覆" name="repeat">
        <a-row :gutter="15" align="middle">
          <a-col :span="10">
            <a-select v-model:value="formState.repeat">
              <a-select-option
                v-for="v in repeatOptions"
                :key="v.id"
                :value="v.id"
              >
                {{ v.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="14">
            <p>
              {{ remark }}
            </p>
          </a-col>
        </a-row>
      </a-form-item>

      <a-row :gutter="[10, 10]" justify="center">
        <a-col>
          <a-button
            type="primary"
            ghost
            style="height: 40px"
            @click.prevent="closeModal"
            >取消</a-button
          >
        </a-col>
        <a-col>
          <a-button
            html-type="submit"
            type="primary"
            style="height: 40px"
            :disabled="loading"
            >儲存<a-spin v-if="loading" size="small"
          /></a-button>
        </a-col>
      </a-row>
    </a-form>
  </sdModal>
  <a-calendar v-model:value="selectedDay" @panelChange="onPanelChange">
    <template #headerRender="{ value: current, onChange }">
      <a-row :gutter="5" justify="space-between">
        <a-col>
          <a-button
            v-if="permission.update"
            type="primary"
            style="height: 45px; margin-right: 0.5rem"
            :disabled="loading"
            @click="triggerFileInput"
            >匯入 <a-spin v-if="loading" size="small"
          /></a-button>
          <input
            type="file"
            ref="fileInput"
            style="display: none"
            @change="handleFileUpload"
          />
          <span>
            <a href="https://data.gov.tw/dataset/14718" target="_blank"
              >行政院行事曆下載</a
            >(請下載google表單用的版本)
          </span>
        </a-col>
        <a-col>
          <a-space>
            <a-select
              size="small"
              :dropdown-match-select-width="false"
              class="my-year-select"
              :value="String(current.year())"
              @change="
                (newYear) => {
                  onChange(current.year(+newYear));
                }
              "
            >
              <a-select-option
                v-for="val in getYears(current)"
                :key="String(val)"
                class="year-item"
              >
                {{ val }}
              </a-select-option>
            </a-select>

            <a-select
              size="small"
              :dropdown-match-select-width="false"
              :value="String(current.month())"
              @change="
                (selectedMonth) => {
                  onChange(current.month(parseInt(String(selectedMonth), 10)));
                }
              "
            >
              <a-select-option
                v-for="(val, index) in getMonths(current)"
                :key="String(index)"
                class="month-item"
              >
                {{ val }}
              </a-select-option>
            </a-select>
          </a-space>
        </a-col>
      </a-row>
    </template>
    <template #dateCellRender="{ current }">
      <div style="height: 100%" @click.prevent="onSelect(current)">
        <ul class="events">
          <li v-if="isHoliday(current)">
            <a-badge status="warning" :text="isHoliday(current).text" />
          </li>
        </ul>
      </div>
    </template>
  </a-calendar>
</template>
<script src="./main.js"></script>
