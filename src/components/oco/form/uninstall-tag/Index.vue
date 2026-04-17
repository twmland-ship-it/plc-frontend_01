<template>
  <div>
    <sdCards>
      <a-form
        :model="filterFormState"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
        labelAlign="left"
      >
        <a-form-item label="測點列表">
          <TagFilter
            :selectedTags="filterFormState.tag.map((el) => el.id)"
            @setTags="setTags"
          />
        </a-form-item>

        <a-form-item label="群組列表">
          <GroupFilter
            :selectedGroups="filterFormState.group.map((el) => el.id)"
            @setGroups="setGroups"
          />
        </a-form-item>

        <!-- <sdButton
          type="primary"
          :disabled="
            filterFormState.tag.length === 0 &&
            filterFormState.group.length === 0
          "
          @click="addTag"
          >加入測點
        </sdButton> -->
      </a-form>
    </sdCards>
    <div style="width: 100%">
      <a-space> 排序: <a-switch v-model:checked="isSort" /> </a-space>
      <div style="overflow: auto">
        <table
          style="
            margin: 1rem 0;
            border-collapse: collapse;
            border: 1px solid #ddd;
            min-width: 100%;
          "
        >
          <thead style="background-color: #ff8000; color: white">
            <tr>
              <th
                v-for="v in columns"
                :key="v.dataIndex"
                scope="col"
                style="padding: 1rem 0; border: 1px solid #ddd"
              >
                {{ v.title }}
              </th>
            </tr>
          </thead>
          <draggable
            :list="dataSource"
            tag="tbody"
            item-key="dataIndex"
            :disabled="!isSort"
          >
            <template #item="{ element, index }">
              <tr>
                <td
                  scope="row"
                  v-for="v in columns"
                  :key="v.dataIndex"
                  style="padding: 1rem 1rem; border: 1px solid #ddd"
                >
                  <div v-if="v.editable">
                    <a-input
                      :value="dataSource[index][v.dataIndex]"
                      style="margin: -5px 0; height: 40px"
                      :style="{ width: v.width }"
                      @input="
                        changeData($event, {
                          id: element.id,
                          key: v.dataIndex,
                        })
                      "
                    />
                  </div>
                  <div v-else-if="v.selectable">
                    <a-select
                      :value="dataSource[index][v.dataIndex]"
                      @change="
                        changeSelect($event, {
                          id: element.id,
                          key: v.dataIndex,
                        })
                      "
                    >
                      <a-select-option :value="null"> 現值 </a-select-option>
                      <a-select-option
                        v-for="j in v.options"
                        :key="j.value"
                        :value="j.value"
                      >
                        {{ j.label }}
                      </a-select-option>
                    </a-select>
                  </div>
                  <div v-else-if="v.dataIndex === 'action'">
                    <ActionSpan @click="deleteTag(element.id)">
                      <unicon name="trash"></unicon>
                    </ActionSpan>
                  </div>
                  <div v-else>
                    {{ dataSource[index][v.dataIndex] }}
                  </div>
                </td>
              </tr>
            </template>
          </draggable>
        </table>
      </div>
    </div>
  </div>
</template>
<script src="./main.js"></script>
