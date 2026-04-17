<template>
  <formWrap>
    <a-form ref="form" :model="formState" :rules="rules" labelAlign="left">
      <a-collapse v-model:activeKey="activeKey">
        <a-collapse-panel key="1" header="基本樣式">
          <a-row :gutter="5">
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="動作"
              >
                <a-select
                  v-model:value="formState.stopAction"
                  style="height: 40p"
                >
                  <a-select-option
                    v-for="options in stopOptions"
                    :value="options.id"
                    :key="options.id"
                  >
                    {{ options.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xs="24">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="判斷式(>,<,==,>=,<=)"
                name="stopValue"
              >
                <a-input
                  v-model:value="formState.stopValue"
                  style="height: 40px"
                  :disabled="formState.stopAction === '3'"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col v-if="formState.stopAction === '2'" :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="邊框"
              >
                <a-input
                  v-model:value="formState.stopStroke"
                  type="color"
                  style="height: 40px"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col v-if="formState.stopAction === '2'" :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="填滿"
              >
                <a-input
                  v-model:value="formState.stopFill"
                  type="color"
                  style="height: 40px"
                >
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
        <a-collapse-panel key="2" header="數位警報">
          <a-row :gutter="5">
            <a-col :span="24" class="subtitle">
              警報:
              <a-checkbox v-model:checked="formState.digAlarmStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報邊框"
              >
                <a-input
                  v-model:value="formState.digAlarmStroke"
                  type="color"
                  :disabled="!formState.digAlarmStatus"
                  style="height: 40px"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報填滿"
              >
                <a-input
                  v-model:value="formState.digAlarmFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.digAlarmStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="subtitle">
              確認:
              <a-checkbox v-model:checked="formState.digCheckStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="確認邊框"
              >
                <a-input
                  v-model:value="formState.digCheckStroke"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.digCheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                name="digAlarmFill"
                label="確認填滿"
              >
                <a-input
                  v-model:value="formState.digCheckFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.digCheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="類比警報">
          <a-row :gutter="5">
            <a-col :span="24" class="subtitle">
              HH警報:
              <a-checkbox v-model:checked="formState.HHAlarmStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報外框"
              >
                <a-input
                  v-model:value="formState.HHAlarmStroke"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.HHAlarmStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報填滿"
              >
                <a-input
                  v-model:value="formState.HHAlarmFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.HHAlarmStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="subtitle">
              HH確認:
              <a-checkbox v-model:checked="formState.HHCheckStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="確認外框"
              >
                <a-input
                  v-model:value="formState.HHCheckStroke"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.HHCheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="確認填滿"
              >
                <a-input
                  v-model:value="formState.HHCheckFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.HHCheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="subtitle">
              HI警報:
              <a-checkbox v-model:checked="formState.HIAlarmStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報外框"
              >
                <a-input
                  v-model:value="formState.HIAlarmStroke"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.HIAlarmStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報填滿"
              >
                <a-input
                  v-model:value="formState.HIAlarmFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.HIAlarmStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="subtitle">
              HI確認:
              <a-checkbox v-model:checked="formState.HICheckStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="確認外框"
              >
                <a-input
                  v-model:value="formState.HICheckStroke"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.HICheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="確認填滿"
              >
                <a-input
                  v-model:value="formState.HICheckFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.HICheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="subtitle">
              LO警報:
              <a-checkbox v-model:checked="formState.LOAlarmStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報外框"
              >
                <a-input
                  v-model:value="formState.LOAlarmStroke"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.LOAlarmStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報填滿"
              >
                <a-input
                  v-model:value="formState.LOAlarmFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.LOAlarmStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="subtitle">
              LO確認:
              <a-checkbox v-model:checked="formState.LOCheckStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="確認外框"
              >
                <a-input
                  v-model:value="formState.LOCheckStroke"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.LOCheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="確認填滿"
              >
                <a-input
                  v-model:value="formState.LOCheckFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.LOCheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="subtitle">
              LL警報:
              <a-checkbox v-model:checked="formState.LLAlarmStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報外框"
              >
                <a-input
                  v-model:value="formState.LLAlarmStroke"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.LLAlarmStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="警報填滿"
              >
                <a-input
                  v-model:value="formState.LLAlarmFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.LLAlarmStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="24" class="subtitle">
              LL確認:
              <a-checkbox v-model:checked="formState.LLCheckStatus"
                >啟用</a-checkbox
              >
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="確認外框"
              >
                <a-input
                  v-model:value="formState.LLCheckStroke"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.LLCheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :xs="24" :sm="12">
              <a-form-item
                :labelCol="{ sm: 7 }"
                :wrapperCol="{ sm: 17 }"
                label="確認填滿"
              >
                <a-input
                  v-model:value="formState.LLCheckFill"
                  type="color"
                  style="height: 40px"
                  :disabled="!formState.LLCheckStatus"
                >
                </a-input>
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
      </a-collapse>
    </a-form>
  </formWrap>
</template>
<script src="./main.js"></script>
