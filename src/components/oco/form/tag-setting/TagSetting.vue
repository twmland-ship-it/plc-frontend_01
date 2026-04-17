<template>
  <a-form ref="form" :model="formState" :rules="rules" labelAlign="left">
    <a-row :gutter="10">
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 9 }"
          :wrapperCol="{ sm: 15 }"
          label="測點狀態"
          name="status"
        >
          <a-radio-group
            v-model:value="formState.status"
            :options="statusOptions"
          />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          :autoLink="false"
          label="地區"
          name="region"
        >
          <a-tree-select
            v-model:value="formState.region"
            style="width: 100%"
            :tree-data="locations"
            allow-clear
            :field-names="{
              children: 'ChildList',
              label: 'Name',
              value: 'Id',
            }"
            placeholder="請選擇"
            tree-node-filter-prop="label"
          />
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="裝置"
          name="device"
        >
          <DeviceFilter :value="formState.device" @setDevice="setDevice" />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="CCTV"
          name="cctv"
        >
          <CCTVFilter :values="formState.cctv" @setCCTV="setCCTV" />
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="測點名稱"
          name="name"
        >
          <a-input
            v-model:value="formState.name"
            placeholder="名稱"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="說明"
          name="description"
        >
          <a-input
            v-model:value="formState.description"
            placeholder="說明"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="PLC位址"
          name="valueAddress"
        >
          <a-input
            v-model:value="formState.valueAddress"
            placeholder="PLC位址(base1)"
            style="height: 40px"
          >
          </a-input>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          :autoLink="false"
          label="測點分類"
          name="tagClass"
        >
          <a-tree-select
            v-model:value="formState.tagClass"
            style="width: 100%"
            :tree-data="classOptions"
            tree-checkable
            allow-clear
            :field-names="{
              children: 'ChildList',
              label: 'Name',
              value: 'Id',
            }"
            placeholder="請選擇"
            tree-node-filter-prop="label"
          />
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="測量單位"
          name="unit"
        >
          <a-select v-model:value="formState.unit">
            <a-select-option
              v-for="unit in unitOptions"
              :value="unit.Id"
              :key="unit.Id"
            >
              {{ unit.Name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="資料型別"
          name="dataType"
        >
          <a-select v-model:value="formState.dataType">
            <a-select-option
              v-for="dataType in dataTypeOptions"
              :value="dataType.Id"
              :key="dataType.Id"
            >
              {{ dataType.Name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <!-- <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="初始值"
          name="initValue"
        >
          <a-input v-model:value="formState.initValue" style="height: 40px">
          </a-input>
        </a-form-item>
      </a-col>
      <a-col :span="12">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="忽略閥值"
          name="ignore"
        >
          <a-input v-model:value="formState.ignore" style="height: 40px">
          </a-input>
        </a-form-item>
      </a-col> -->
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="測點種類"
          name="type"
        >
          <a-radio-group v-model:value="formState.type">
            <a-radio v-for="v in typeOptions" :key="v.Id" :value="v.Id">{{
              v.Name
            }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="測點用途"
          name="usage"
        >
          <a-radio-group v-model:value="formState.usage">
            <a-radio v-for="(v, key) in usageOptions" :key="key" :value="key">{{
              v
            }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="接點種類"
          name="closingContact"
        >
          <a-radio-group v-model:value="formState.closingContact">
            <a-radio
              v-for="(v, key) in closingContactOptions"
              :key="key"
              :value="key"
              >{{ v }}</a-radio
            >
          </a-radio-group>
        </a-form-item>
      </a-col>

      <!-- <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="保持值"
          name="retentive"
        >
          <a-radio-group
            v-model:value="formState.retentive"
            :options="retentiveOptions"
          />
        </a-form-item>
      </a-col> -->

      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="存取權限"
          name="saveType"
        >
          <a-radio-group v-model:value="formState.saveType">
            <a-radio v-for="v in saveTypeOptions" :key="v.Id" :value="v.Id">{{
              v.Name
            }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="儲存歷史"
          name="log"
        >
          <a-radio-group v-model:value="formState.log" :options="logOptions" />
        </a-form-item>
      </a-col>

      <a-col :span="24">
        <a-form-item
          v-if="formState.log"
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="儲存間隔模式"
          name="logIntervalType"
        >
          <a-radio-group v-model:value="formState.logIntervalType">
            <a-radio v-for="v in logTypeOptions" :key="v.Id" :value="v.Id">{{
              v.Name
            }}</a-radio>
          </a-radio-group>
          <Notice :content="noticeContent"></Notice>
        </a-form-item>
      </a-col>
      <a-col :span="24">
        <a-form-item
          v-if="formState.log && formState.logIntervalType !== 3"
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="儲存間隔時間(分鐘)"
          name="logInterval"
        >
          <a-input v-model:value="formState.logInterval" style="height: 40px">
          </a-input>
        </a-form-item>
      </a-col>
      <!-- <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 8 }"
          :wrapperCol="{ sm: 16 }"
          label="取值間隔時間(毫秒)"
          name="dataInterval"
        >
          <a-input v-model:value="formState.dataInterval" style="height: 40px">
          </a-input>
        </a-form-item>
      </a-col> -->
    </a-row>
  </a-form>
</template>
<script src="./index.js"></script>
