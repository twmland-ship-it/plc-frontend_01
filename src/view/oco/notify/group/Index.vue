<template>
  <div>
    <sdPageHeader
      title="通知群組"
      class="ninjadash-page-header-main"
      :routes="[{ breadcrumbName: '通知' }, { breadcrumbName: '通知群組' }]"
    ></sdPageHeader>
    <Main>
      <sdModal
        v-if="modal"
        :title="formState.title"
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
          <a-form-item label="群組名稱" name="name">
            <a-input v-model:value="formState.name" />
          </a-form-item>
          <a-form-item label="開始時間" name="starttime">
            <a-time-picker v-model:value="formState.starttime" />
          </a-form-item>
          <a-form-item label="至" name="until">
            <a-radio-group v-model:value="formState.until" name="radioGroup">
              <a-radio v-for="v in durationOptions" :key="v.Id" :value="v.Id">{{
                v.Name
              }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="結束時間" name="endtime">
            <a-time-picker v-model:value="formState.endtime" />
          </a-form-item>

          <a-form-item label="發送方式" name="type">
            <a-select
              v-model:value="formState.type"
              show-search
              optionFilterProp="label"
            >
              <a-select-option
                v-for="v in typeOptions"
                :key="v.Id"
                :label="v.Name"
                :value="v.Id"
              >
                {{ v.Name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="formState.type === 2" label="選擇服務" name="data">
            <a-select
              v-model:value="formState.line"
              show-search
              optionFilterProp="label"
            >
              <a-select-option
                v-for="v in lineOptions"
                :key="v.id"
                :label="v.name"
                :value="v.id"
              >
                {{ v.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <div v-if="formState.type === 1 || formState.type === 3 || formState.type === 5">
            <EmailListTitle>{{
              formState.type === 3
                ? "Email列表:"
                : "手機列表:"
            }}</EmailListTitle>
            <a-button type="primary" @click="addNewList">添加</a-button>
            <a-table
              class="table-data-view table-responsive"
              :columns="formColumn"
              :data-source="formState.values"
              bordered
              style="margin: 0.5rem 0"
              :pagination="false"
              :scroll="{ y: 240 }"
            >
              <template #bodyCell="{ column, text, index }">
                <template v-if="['name', 'value'].includes(column.dataIndex)">
                  <div>
                    <a-input
                      :value="formState.values[index][column.dataIndex]"
                      style="margin: -5px 0; height: 40px"
                      @input="
                        changeListData($event, {
                          idx: index,
                          key: column.dataIndex,
                        })
                      "
                    />
                  </div>
                </template>
                <template v-else-if="column.dataIndex === 'action'">
                  <ActionSpan @click="deleteList(index)">
                    <unicon name="trash"></unicon>
                  </ActionSpan>
                </template>
                <template v-else>
                  {{ text }}
                </template>
              </template>
            </a-table>
          </div>

          <a-row :gutter="[10, 10]" justify="center">
            <a-col>
              <a-button
                html-type="submit"
                type="primary"
                style="height: 40px"
                htmp-type="submit"
                :disabled="loading"
                >儲存<a-spin v-if="loading" size="small"
              /></a-button>
            </a-col>
            <a-col>
              <a-button
                type="primary"
                ghost
                style="height: 40px"
                @click.prevent="closeModal"
                >取消</a-button
              >
            </a-col>
          </a-row>
        </a-form>
      </sdModal>
      <sdCards title="群組列表">
        <a-spin v-if="loading" />
        <DataTables
          v-if="!loading"
          :filterOption="true"
          :filterOnchange="true"
          :tableData="tableData"
          :columns="columns"
          :rowSelection="false"
          :addOption="permission.create"
          :handleAdd="openAddModal"
          :handleDataSearch="search"
        />
      </sdCards>
    </Main>
  </div>
</template>
<script src="./main.js"></script>
