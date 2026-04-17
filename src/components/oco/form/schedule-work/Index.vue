<template>
  <a-form
    ref="form"
    :model="formState"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
    :rules="rules"
    labelAlign="left"
  >
    <a-form-item label="排程名稱" name="name">
      <a-input
        v-model:value="formState.name"
        style="height: 40px"
        placeholder="請輸入名稱"
      />
    </a-form-item>
    <a-form-item label="開始時間" name="startTime">
      <a-date-picker
        v-model:value="formState.startTime"
        show-time
        style="height: 40px"
        placeholder="選擇時間"
        @change="changeStartTime"
      />
    </a-form-item>
    <a-row align="bottom" :gutter="5">
      <a-col :span="12">
        <a-form-item
          label="重複間隔"
          name="repeatCount"
          :disabled="!formState.startTime"
          :labelCol="{ span: 12 }"
        >
          <a-input-number
            v-model:value="formState.repeatCount"
            :disabled="!formState.startTime"
            style="width: 100%; height: 40px"
            :min="1"
            :max="100000"
          />
        </a-form-item>
      </a-col>
      <a-col :span="2" style="text-align: center">
        <p style="margin-bottom: 2rem">個</p>
      </a-col>
      <a-col :span="8">
        <a-form-item name="repeat">
          <a-select
            v-model:value="formState.repeat"
            :disabled="!formState.startTime"
            style="height: 40px"
            @change="changeRepeat"
          >
            <a-select-option
              v-for="v in repeatOptions"
              :key="v.id"
              :value="v.id"
            >
              {{ v.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col v-if="formState.repeat" :sm="{ push: 6 }" :span="18">
        <p v-if="formState.repeat !== '3'" style="margin-bottom: 1rem">
          {{ formState.repeatLabel }}
        </p>
        <a-form-item v-if="formState.repeat === '3'" name="repeatValue">
          <a-select
            v-model:value="formState.repeatValue"
            :placeholder="!formState.startTime && '請先選擇開始時間'"
            style="height: 40px"
          >
            <a-select-option
              v-for="v in monthAdditionOptions"
              :key="v.label"
              :value="v.value"
            >
              {{ v.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item label="結束時間" name="endTime" style="margin-bottom: 0">
      <a-radio-group v-model:value="formState.endTime">
        <a-radio
          v-for="v in endTimeOptions"
          :key="v.id"
          :value="v.id"
          :style="radioStyle"
        >
          <div>
            {{ v.name }}
          </div>

          <div v-for="(setting, i) in v.settings" :key="i">
            <a-form-item name="endTimeAddition">
              <a-input
                v-if="setting.type === 'input'"
                v-model:value="formState.endTimeAddition[v.id]"
                :disabled="formState.endTime !== v.id"
                style="width: 100px; height: 40px"
                type="text"
              />
              <a-date-picker
                v-if="setting.type === 'dateAndTimePicker'"
                show-time
                v-model:value="formState.endTimeAddition[v.id]"
                :disabled="formState.endTime !== v.id"
                placeholder="選擇時間"
                style="height: 40px"
              />
              <span v-if="setting.append" style="margin-left: 0.2rem">{{
                setting.append
              }}</span>
            </a-form-item>
          </div>
        </a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item label="季節/區間" name="season">
      <a-select v-model:value="formState.season">
        <a-select-option :value="null"> 無 </a-select-option>
        <a-select-option v-for="v in seasonOptions" :key="v.id" :value="v.id">
          {{ v.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
  </a-form>
</template>
<script src="./main.js"></script>
