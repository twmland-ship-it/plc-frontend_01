<template>
  <ModalWrapper>
    <a-form
      :model="formState"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
      labelAlign="left"
      :rules="rules"
      @finish="submit"
    >
      <a-form-item
        v-if="formState.chartType !== 'card'"
        label="圖表名稱"
        name="name"
      >
        <a-input v-model:value="formState.name"></a-input>
      </a-form-item>
      <a-form-item label="圖表種類">
        <a-select v-model:value="formState.chartType">
          <a-select-option
            v-for="v in chartTypeOptions"
            :key="v.id"
            :value="v.id"
            :label="v.name"
            >{{ v.name }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item
        v-if="formState.chartType === 'radialBar'"
        label="上限值"
        name="limit"
      >
        <a-input v-model:value.number="formState.limit"></a-input>
      </a-form-item>
      <a-form-item label="日期區間">
        <a-select v-model:value="formState.timePeriod" style="width: 100%">
          <a-select-option
            v-for="v in showTimePeriodOptions"
            :key="v.id"
            :value="v.id"
          >
            {{ v.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item v-if="formState.chartType !== 'line'" label="參數統計方式">
        <a-select v-model:value="formState.paramSummary">
          <a-select-option
            v-for="v in paramSummaryOptions"
            :key="v.value"
            :value="v.value"
            :label="v.label"
            >{{ v.label }}</a-select-option
          >
        </a-select>
      </a-form-item>
      <a-form-item v-if="formState.timePeriod !== 999" label="原始資料統計方式">
        <a-select v-model:value="formState.summary">
          <a-select-option
            v-for="v in summaryTypeOptions"
            :key="v.value"
            :value="v.value"
            :label="v.label"
            >{{ v.label }}</a-select-option
          >
        </a-select>
      </a-form-item>

      <a-form-item label="單位">
        <a-select v-model:value="formState.unit" style="width: 100%">
          <a-select-option
            v-for="v in unitOptions"
            :key="v.Id"
            :value="v.Id"
            :label="v.Name"
          >
            {{ v.Name }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <div v-for="(v, i) in formState.params" :key="i">
        <a-row
          v-if="formState.params.length > 1"
          justify="space-between"
          align="middle"
          class="subtitle-row"
        >
          <span class="subtitle">{{ `參數${i + 1}` }}</span>
          <span class="delete-btn" @click="delBlock(i)">刪除區塊</span>
        </a-row>
        <a-form-item
          v-if="
            !checkSchemeLength(formState.chartType) ||
            checkSchemeLength(formState.chartType) > 1
          "
          label="參數名稱"
          name="params"
        >
          <a-input v-model:value="v.name"></a-input>
        </a-form-item>
        <a-form-item label="測點列表">
          <TagFilter
            :multiple="formState.chartType !== 'line'"
            :selectedTags="
              formState.chartType !== 'line' ? formState.params[i].tags : []
            "
            :value="
              formState.chartType === 'line'
                ? formState.params[i].tags[0]
                : null
            "
            @setTags="setTags($event, i)"
            @setSingleTag="setTags($event, i)"
          />
        </a-form-item>
        <a-form-item v-if="formState.chartType !== 'line'" label="群組列表">
          <GroupFilter
            :selectedGroups="formState.params[i].groups"
            @setGroups="setGroups($event, i)"
          />
        </a-form-item>
        <a-form-item v-if="formState.chartType !== 'card'" label="顏色">
          <a-input v-model:value="v.color" type="color"></a-input>
        </a-form-item>
      </div>
      <div
        v-if="
          !checkSchemeLength(formState.chartType) ||
          formState.params.length < checkSchemeLength(formState.chartType)
        "
        class="addblock"
        @click="newBlock"
      >
        + 新增區塊
      </div>
      <sdButton html-type="submit" class="act-btn" type="primary">
        儲存
        <a-spin v-show="loading" size="small" />
      </sdButton>
    </a-form>
  </ModalWrapper>
</template>
<script src="./main.js"></script>
