<template>
  <a-form
    ref="form"
    name="dynamic_form_nest_item"
    :model="expFormstate"
    labelAlign="left"
  >
    <a-row :gutter="10">
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 20 }"
          label="啟用運算式:"
          name="status"
        >
          <a-radio-group
            v-model:value="expFormstate.status"
            :options="statusOptions"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row v-if="expFormstate.status" :gutter="10">
      <a-col :span="24">
        <a-form-item
          :labelCol="{ sm: 4 }"
          :wrapperCol="{ sm: 5 }"
          label="轉換方式:"
          name="type"
        >
          <a-select v-model:value="expFormstate.type">
            <a-select-option
              v-for="expressionType in expressionTypeOptions"
              :value="expressionType.Id"
              :key="expressionType.Id"
            >
              {{ expressionType.Name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
    </a-row>
    <div v-if="expFormstate.status && expFormstate.type === 1">
      <a-form-item
        :labelCol="{ sm: 4 }"
        :wrapperCol="{ sm: 5 }"
        label="測點倍數"
        name="valueMultiple"
      >
        <a-input
          v-model:value="expFormstate.valueMultiple"
          style="height: 40px"
        >
        </a-input>
      </a-form-item>
    </div>
    <div
      v-if="
        expFormstate.status &&
        (expFormstate.type === '2' || expFormstate.type === '3')
      "
    >
      <a-row :gutter="10">
        <a-col :span="12">
          <a-form-item
            :labelCol="{ sm: 8 }"
            :wrapperCol="{ sm: 12 }"
            label="轉換最大值"
            name="transferMax"
          >
            <a-input
              v-model:value="expFormstate.transferMax"
              style="height: 40px"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ sm: 8 }"
            :wrapperCol="{ sm: 12 }"
            label="轉換最小值"
            name="transferMin"
          >
            <a-input
              v-model:value="expFormstate.transferMin"
              style="height: 40px"
            >
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ sm: 8 }"
            :wrapperCol="{ sm: 12 }"
            label="最大值"
            name="max"
          >
            <a-input v-model:value="expFormstate.max" style="height: 40px">
            </a-input>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            :labelCol="{ sm: 8 }"
            :wrapperCol="{ sm: 12 }"
            label="最小值"
            name="min"
          >
            <a-input v-model:value="expFormstate.min" style="height: 40px">
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <div v-if="expFormstate.status && expFormstate.type === '4'">
      <a-row>
        <a-col :span="13">
          <a-form-item
            :labelCol="{ sm: 7 }"
            :wrapperCol="{ sm: 18 }"
            label="選擇測點"
            name="min"
          >
            <TagFilter
              :selectedTags="currentTag"
              @setTags="setTags"
            ></TagFilter>
          </a-form-item>
        </a-col>
        <a-col :span="5">
          <sdButton
            type="primary"
            :disabled="!currentTag"
            style="height: 40px"
            @click.prevent="addTag"
          >
            加入測點
          </sdButton>
        </a-col>
      </a-row>

      <a-row v-for="(v, index) in expFormstate.tags" :key="v.id" :gutter="10">
        <a-col :span="16">
          <a-form-item
            :labelCol="{ sm: 6 }"
            :wrapperCol="{ sm: 18 }"
            :name="['tags', index, 'tag']"
            label="測點"
          >
            <a-input
              :value="useTagInfo(v, 'Name')"
              disabled
              style="height: 40px"
            />
          </a-form-item>
        </a-col>

        <a-col :span="6">
          <DeleteSpan @click.prevent="removeTag(v)">
            <unicon name="minus-circle"></unicon>
          </DeleteSpan>
        </a-col>
      </a-row>

      <a-form-item>
        <a-textarea
          :value="expressionContent"
          placeholder="運算式(EX: @測點代稱1@ + @測點代稱2@)"
          :rules="{
            required: true,
            message: '請輸入運算式',
          }"
          @input="editContent"
        >
        </a-textarea>
      </a-form-item>
    </div>
  </a-form>
</template>
<script src="./index.js"></script>
