<template>
  <a-form
    ref="form"
    :model="alarmFormState"
    :rules="alarmRules"
    labelAlign="left"
  >
    <a-row :gutter="10">
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 6 }"
          label="啟用警報"
          name="status"
        >
          <a-select v-model:value="alarmFormState.status">
            <a-select-option
              v-for="v in statusOptions"
              :value="v.Id"
              :key="v.Id"
              >{{ v.Name }}</a-select-option
            >
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row v-if="alarmFormState.status !== 1" :gutter="10">
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="播放語音"
          name="audio"
        >
          <a-radio-group
            v-model:value="alarmFormState.audio"
            :options="exceptionStatusOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="SOP"
          name="sop"
        >
          <QuillEditor
            v-model:content="alarmFormState.sop"
            contentType="html"
            theme="snow"
            :toolbar="[
              [{ size: [] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ color: [] }, { background: [] }],
              ['link', 'image', 'video'],
            ]"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="通知群組"
          name="notifyGroup"
        >
          <a-select
            v-model:value="alarmFormState.notifyGroup"
            mode="multiple"
            style="width: 100%"
            :disabled="notifyGroupOptions.length === 0"
          >
            <a-select-option
              v-for="group in notifyGroupOptions"
              :value="group.Id"
              :key="group.Id"
            >
              {{ group.Name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="關聯頁面"
          name="page"
        >
          <a-tree-select
            v-model:value="alarmFormState.page"
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
      </a-col>
    </a-row>

    <a-row v-if="alarmFormState.status !== 1 && type === 1" :gutter="10">
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="HH狀態"
          name="HHStatus"
        >
          <a-radio-group
            v-model:value="alarmFormState.HHStatus"
            :options="exceptionStatusOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="HH警報值"
          name="HHValue"
        >
          <a-input
            v-model:value="alarmFormState.HHValue"
            placeholder="0"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="HH說明"
          name="HHContent"
        >
          <a-input
            v-model:value="alarmFormState.HHContent"
            :disabled="alarmFormState.HHValue === ''"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="HI狀態"
          name="HIStatus"
        >
          <a-radio-group
            v-model:value="alarmFormState.HIStatus"
            :options="exceptionStatusOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="HI警報值"
          name="HIValue"
        >
          <a-input
            v-model:value="alarmFormState.HIValue"
            placeholder="0"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="HI說明"
          name="HIContent"
        >
          <a-input
            v-model:value="alarmFormState.HIContent"
            :disabled="alarmFormState.HIValue === ''"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="LO狀態"
          name="LOStatus"
        >
          <a-radio-group
            v-model:value="alarmFormState.LOStatus"
            :options="exceptionStatusOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="LO警報值"
          name="LOValue"
        >
          <a-input
            v-model:value="alarmFormState.LOValue"
            placeholder="0"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="LO說明"
          name="LOContent"
        >
          <a-input
            v-model:value="alarmFormState.LOContent"
            :disabled="alarmFormState.LOValue === ''"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="LL狀態"
          name="LLStatus"
        >
          <a-radio-group
            v-model:value="alarmFormState.LLStatus"
            :options="exceptionStatusOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="LL警報值"
          name="LLValue"
        >
          <a-input
            v-model:value="alarmFormState.LLValue"
            placeholder="0"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="LL說明"
          name="LLContent"
        >
          <a-input
            v-model:value="alarmFormState.LLContent"
            :disabled="alarmFormState.LLValue === ''"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>

    <a-row v-if="alarmFormState.status !== 1 && type === 0" :gutter="10">
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 8 }"
          label="警報狀態"
          name="digAlarmStatus"
        >
          <a-radio-group
            v-model:value="alarmFormState.digAlarmStatus"
            :options="exceptionStatusOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          v-if="alarmFormState.digAlarmStatus"
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="警報值"
          name="digAlarmValue"
        >
          <a-input
            v-model:value="alarmFormState.digAlarmValue"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item
          v-if="alarmFormState.digAlarmStatus"
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="警報說明"
          name="digAlarmContent"
        >
          <a-input
            v-model:value="alarmFormState.digAlarmContent"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 8 }"
          label="復歸狀態"
          name="digNorStatus"
        >
          <a-radio-group
            v-model:value="alarmFormState.digNorStatus"
            :options="exceptionStatusOptions"
          />
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item
          v-if="alarmFormState.digNorStatus"
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="復歸值"
          name="digNorValue"
        >
          <a-input
            v-model:value="alarmFormState.digNorValue"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>

      <a-col :span="12">
        <a-form-item
          v-if="alarmFormState.digNorStatus"
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="復歸說明"
          name="digNorContent"
        >
          <a-input
            v-model:value="alarmFormState.digNorContent"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>
    </a-row>
    <a-row v-if="alarmFormState.status !== 1">
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="例外設定"
          name="exceptionStatus"
        >
          <a-radio-group
            v-model:value="alarmFormState.exceptionStatus"
            :options="exceptionStatusOptions"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row
      v-if="alarmFormState.status !== 1 && alarmFormState.exceptionStatus"
      :gutter="10"
    >
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="開始時間"
          name="exceptionStartAt"
        >
          <a-time-picker
            v-model:value="alarmFormState.exceptionStartAt"
            style="min-width: 150px"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 5 }"
          :wrapperCol="{ sm: 19 }"
          label="至"
          name="exceptionUntil"
        >
          <a-radio-group v-model:value="alarmFormState.exceptionUntil"
            ><a-radio
              v-for="v in exceptionUntilOptions"
              :key="v.id"
              :value="v.Id"
              >{{ v.Name }}</a-radio
            ></a-radio-group
          >
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="結束時間"
          name="exceptionEndAt"
        >
          <a-time-picker
            v-model:value="alarmFormState.exceptionEndAt"
            style="min-width: 150px"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 5 }"
          :wrapperCol="{ sm: 19 }"
          label="動作"
          name="exceptionAction"
        >
          <a-radio-group v-model:value="alarmFormState.exceptionAction"
            ><a-radio
              v-for="v in exceptionActionOptions"
              :key="v.id"
              :value="v.Id"
              >{{ v.Name }}</a-radio
            ></a-radio-group
          >
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>
<script src="./index.js"></script>
