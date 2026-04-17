<template>
  <div>
    <sdModal
      v-if="modal"
      :title="!formState.id ? '新增列表' : '編輯列表'"
      :visible="modal"
      :onCancel="closeAddModal"
    >
      <modalWrap>
        <a-form
          :model="formState"
          labelAlign="left"
          style="padding-left: 1.5rem; padding-right: 1.5rem"
          :rules="rules"
          @finish="submitForm"
        >
          <a-form-item
            :labelCol="{ sm: 8 }"
            :wrapperCol="{ sm: 16 }"
            label="列表名稱"
            name="name"
          >
            <a-input v-model:value="formState.name"></a-input>
          </a-form-item>
        </a-form>

        <SettingForm
          :dataSource="formState.tags"
          :columns="formColumns"
          @addTag="addTag"
          @changeData="editTag"
          @deleteTag="deleteTag"
        />
        <a-row style="margin-top: 1rem">
          <a-col
            :lg="{ span: 16, offset: 8 }"
            :md="{ span: 15, offset: 9 }"
            :xs="{ span: 24, offset: 0 }"
          >
            <div>
              <sdButton
                class="act-btn"
                type="primary"
                html-type="submit"
                :disabled="loading"
                @click="submitForm"
              >
                儲存
                <a-spin v-show="loading" size="small" />
              </sdButton>
              <sdButton class="act-btn" type="light" @click="closeAddModal">
                取消
              </sdButton>
            </div>
          </a-col>
        </a-row>
        <!-- <a-form
          v-if="formState.type === 'add'"
          :model="formState"
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          labelAlign="left"
        >
          <a-form-item label="群組分類" name="groupClass">
            <LevelSelect
              :selectedValue="formState.groupClass"
              :nullOption="true"
              :group="groupClassOptions"
              @change="changeGroupClass"
            ></LevelSelect>
          </a-form-item>
          <a-form-item label="群組" name="group">
            <a-select v-model:value="formState.group">
              <a-select-option
                v-for="v in groupOptions"
                :key="v.id"
                :value="v.id"
              >
                {{ v.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-show="selectedGroupTags.length > 0" label="測點">
            <a-checkbox
              v-for="v in selectedGroupTags"
              :key="v.id"
              v-model:checked="formState.tags[v.id]"
            >
              {{ v.name }}
            </a-checkbox>
          </a-form-item>
          <a-row>
            <a-col
              :lg="{ span: 16, offset: 8 }"
              :md="{ span: 15, offset: 9 }"
              :xs="{ span: 24, offset: 0 }"
            >
              <div>
                <sdButton
                  class="act-btn"
                  html-type="submit"
                  type="light"
                  @click="closeAddModal"
                >
                  取消
                </sdButton>
                <sdButton
                  class="act-btn"
                  type="primary"
                  :disabled="loading || !formSubmitable"
                  @click="addGroup"
                >
                  新增
                  <a-spin v-show="loading" size="small" />
                </sdButton>
              </div>
            </a-col>
          </a-row>
        </a-form>
        <a-form
          v-else
          :label-col="labelCol"
          :wrapper-col="wrapperCol"
          labelAlign="left"
        >
          <a-form-item v-show="editTagList.length > 0" label="測點">
            <a-checkbox
              v-for="v in editTagList"
              :key="v.id"
              v-model:checked="formState.tags[v.id]"
            >
              {{ v.name }}
            </a-checkbox>
          </a-form-item>
          <a-row>
            <a-col
              :lg="{ span: 16, offset: 8 }"
              :md="{ span: 15, offset: 9 }"
              :xs="{ span: 24, offset: 0 }"
            >
              <div>
                <sdButton
                  class="act-btn"
                  html-type="submit"
                  type="light"
                  @click="closeAddModal"
                >
                  取消
                </sdButton>
                <sdButton
                  class="act-btn"
                  type="primary"
                  :disabled="loading || !formSubmitable"
                  @click="editGroup"
                >
                  儲存
                  <a-spin v-show="loading" size="small" />
                </sdButton>
              </div>
            </a-col>
          </a-row>
        </a-form> -->
      </modalWrap>
    </sdModal>

    <div>
      <guiWrap>
        <div class="sub-title">
          <p class="sub-title-text">{{ subTitle }}</p>
          <sdButton
            v-if="permission.create"
            class="act-btn"
            type="primary"
            @click="openAddModal"
          >
            新增列表
          </sdButton>
        </div>
        <a-row :gutter="30">
          <a-col v-for="v in allDevice" :key="v.id" :lg="6" :sm="8" :xs="24">
            <a-card :border="false" :title="v.name">
              <template #extra>
                <div class="action-icons">
                  <div v-if="permission.update" @click="openEditModal(v.id)">
                    <unicon name="edit"></unicon>
                  </div>
                  <div v-if="permission.delete" @click="deleteGroup(v.id)">
                    <unicon name="trash"></unicon>
                  </div>
                </div>
              </template>
              <p v-for="(k, j) in v.tags" :key="j">
                {{
                  `${k.title} : ${
                    k.property
                      ? getTagProperty(k.id, k.property)
                      : getCurrentValue(k.id)
                  } ${k.unit}`
                }}
              </p>
              <!-- <p>{{ `狀態 : ${v.status ? "開" : "關"}` }}</p> -->
              <!-- <a-space :size="10">
                <a-button type="primary" shape="round">開</a-button>
                <a-button shape="round">關</a-button>
              </a-space> -->
              <div class="bg-icon">
                <unicon name="setting"></unicon>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </guiWrap>
    </div>
  </div>
</template>
<script src="./main.js"></script>
