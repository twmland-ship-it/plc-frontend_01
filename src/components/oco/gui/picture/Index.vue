<template>
  <DiagramWrap>
    <sdModal
      v-if="infoModal"
      :title="`${currTagName}`"
      :visible="infoModal"
      :onCancel="closeInfoModal"
      :width="1000"
    >
      <a-tabs v-model:activeKey="infoTab">
        <a-tab-pane key="1" tab="CCTV">
          <cctvStream :cctv="currCCTV"></cctvStream>
        </a-tab-pane>
        <a-tab-pane key="2" tab="趨勢圖">
          <trendChart :tagId="currTagId"></trendChart>
        </a-tab-pane>
      </a-tabs>
    </sdModal>
    <sdModal
      v-if="inputModal"
      :title="`${currTagName} 送出訊號`"
      :visible="inputModal"
      :onCancel="closeInputModal"
    >
      <a-input v-model:value="inputValue" style="margin-bottom: 10px"></a-input>

      <a-row align="end">
        <a-button
          html-type="submit"
          type="primary"
          style="height: 40px"
          @click.prevent="sendSignal"
          >送出<a-spin v-if="loading" size="small"
        /></a-button>
      </a-row>
    </sdModal>
    <sdModal
      v-if="tagModal"
      title="屬性"
      :visible="tagModal"
      :onCancel="closeTagModal"
    >
      <a-tabs v-model:activeKey="activeTab">
        <a-tab-pane key="1" tab="基本">
          <div style="margin-bottom: 1rem">
            <p>測點:</p>
            <TagFilter
              :value="tagFormState.tagId"
              :multiple="false"
              @setSingleTag="setTag"
            />
          </div>
          <div style="margin-bottom: 1rem">
            <p>顯示屬性:</p>
            <a-select v-model:value="tagFormState.showProperty">
              <a-select-option :value="null">現值</a-select-option>
              <a-select-option v-for="v in allEnableProps" :key="v.value">{{
                v.label
              }}</a-select-option>
            </a-select>
          </div>
          <div>
            <p>變數名稱(symbol用):</p>
            <a-input v-model:value="symbolFormState.symbolVar"></a-input>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="規則">
          <RuleForm :rule="ruleFormState" @submit="setRule"></RuleForm>
        </a-tab-pane>
        <a-tab-pane key="3" tab="事件">
          <EventForm :eventFormState="eventFormState" @submit="setEventData" />
        </a-tab-pane>
      </a-tabs>
      <a-row :gutter="[10, 10]" justify="center" style="margin-top: 1rem">
        <a-col>
          <a-button
            type="primary"
            ghost
            style="height: 40px"
            @click.prevent="closeTagModal"
            >取消</a-button
          >
        </a-col>
        <a-col>
          <a-button
            html-type="submit"
            type="primary"
            style="height: 40px"
            @click.prevent="submitTagSetting"
            >確認<a-spin v-if="loading" size="small"
          /></a-button>
        </a-col>
      </a-row>
    </sdModal>
    <sdModal v-if="guiLoading" :visible="guiLoading" :closable="false">
      <a-spin size="large" />
    </sdModal>

    <a-row
      justify="space-between"
      align="middle"
      class="action-bar"
      :gutter="[5, 10]"
    >
      <a-col :xs="24" :lg="16">
        <!-- <a-radio-group v-model:value="mode" :options="modeOptions" /> -->
        <a-radio
          v-for="v in modeOptions"
          :key="v.value"
          :value="v.value"
          :checked="mode === v.value"
          @click="setMode(v.value)"
          >{{ v.label }}</a-radio
        >
        <a-space v-if="mode === 'edit'">
          <a-button
            type="primary"
            :disabled="!canUndo"
            ghost
            style="height: 40px"
            @click="toHistory(historyIndex - 1)"
          >
            <font-awesome-icon
              class="super-crazy-colors"
              :icon="faUndo"
              size="1x"
            />
          </a-button>
          <a-button
            type="primary"
            :disabled="!canRedo"
            ghost
            style="height: 40px"
            @click="toHistory(historyIndex + 1)"
          >
            <font-awesome-icon
              class="super-crazy-colors"
              :icon="faRedo"
              size="1x"
            />
          </a-button>
          <input
            type="file"
            ref="fileInput"
            accept=".jpg, .png, .jpeg, .svg"
            style="display: none"
            @change="addBgImage"
          />
          <a-button
            type="primary"
            ghost
            style="height: 40px"
            @click.prevent="openFileInput"
          >
            <unicon name="image"></unicon
          ></a-button>
          <a-button
            type="primary"
            style="height: 40px"
            :ghost="!drawMode"
            class="drawBtn"
            :class="drawMode && 'active'"
            @click.prevent="handleDrawMode"
          >
            <unicon name="pen"></unicon>
          </a-button>
          <a-button
            type="primary"
            style="height: 40px"
            :ghost="!gridMode"
            class="drawBtn"
            :class="gridMode && 'active'"
            @click.prevent="setGridMode"
          >
            <unicon name="grid"></unicon>
          </a-button>
          <input
            type="file"
            accept=".json"
            ref="canvasFileInput"
            style="display: none"
            @input="uploadCanvasJson"
          />
          <a-button
            type="primary"
            style="height: 40px"
            @click.prevent="openCanvasFileInput"
          >
            匯入
          </a-button>
          <a-button
            type="primary"
            style="height: 40px"
            class="drawBtn"
            :class="gridMode && 'active'"
            @click.prevent="exportCanvasJson"
          >
            匯出
          </a-button>
        </a-space>
      </a-col>

      <a-col v-if="mode === 'edit'" :xs="24" :lg="8">
        <a-row justify="end" align="middle">
          <a-input
            v-show="symbolMode"
            v-model:value="currSymbolName"
            placeholder="symbol名稱"
            style="width: 250px"
          ></a-input>
          <a-button
            v-show="!symbolMode"
            type="primary"
            style="margin-left: 5px; height: 40px"
            ghost
            @click="clearCanvas"
          >
            清空
          </a-button>
          <a-button
            v-show="!symbolMode"
            type="primary"
            style="margin-left: 5px; height: 40px"
            :disabled="loading"
            @click="saveCanvas"
          >
            儲存
            <a-spin v-show="loading" size="small" />
          </a-button>

          <a-button
            v-show="symbolMode"
            type="primary"
            style="margin-left: 5px; height: 40px"
            ghost
            @click="closeSymbolMode"
          >
            取消
          </a-button>
          <a-button
            v-show="symbolMode"
            type="primary"
            style="margin-left: 5px; height: 40px"
            :disabled="loading"
            @click="saveSymbol"
          >
            儲存 symbol
            <a-spin v-show="loading" size="small" />
          </a-button>
          <!-- <a-button
            v-show="symbolMode"
            type="primary"
            style="margin-left: 5px; height: 40px"
            :disabled="loading"
            @click="saveSymbol"
          >
            另存 symbol
            <a-spin v-show="loading" size="small" />
          </a-button> -->
        </a-row>
      </a-col>
    </a-row>
    <div class="canvas-wrap" ref="canvasWrap" @dragover.prevent>
      <div
        v-show="rightClickMenu && mode === 'edit'"
        ref="menuRef"
        class="setting-menu"
        :style="menuPosition"
      >
        <a-menu v-if="rightClickMenu">
          <a-menu-item
            :disabled="isActiveObject !== 'normal'"
            @click.prevent="openTagModal"
            >屬性</a-menu-item
          >
          <a-menu-item @click.prevent="toGroup">群組</a-menu-item>
          <a-menu-item @click.prevent="unGroup">解除群組</a-menu-item>
          <a-menu-item @click.prevent="copy">複製</a-menu-item>
          <a-menu-item @click.prevent="remove">刪除</a-menu-item>
          <a-menu-item
            v-if="!symbolMode && isActiveObject === 'symbol'"
            @click.prevent="editSymbol"
            >編輯symbol</a-menu-item
          >
          <a-menu-item
            v-if="!symbolMode && isActiveObject !== 'symbol'"
            @click.prevent="makeSymbol"
            >製作symbol</a-menu-item
          >
          <a-sub-menu title="圖層">
            <a-menu-item @click.prevent="bringForward">上一層</a-menu-item>
            <a-menu-item @click.prevent="sendBackwards">下一層</a-menu-item>
            <a-menu-item @click.prevent="bringToFront">最上層</a-menu-item>
            <a-menu-item @click.prevent="sendToBack">最下層</a-menu-item>
          </a-sub-menu>
          <a-sub-menu title="對齊">
            <a-menu-item @click.prevent="align('top')">靠上對齊</a-menu-item>
            <a-menu-item @click.prevent="align('bottom')">靠下對齊</a-menu-item>
            <a-menu-item @click.prevent="align('left')">靠左對齊</a-menu-item>
            <a-menu-item @click.prevent="align('right')">靠右對齊</a-menu-item>
            <a-menu-item @click.prevent="align('center')">水平置中</a-menu-item>
            <a-menu-item @click.prevent="align('middle')">垂直置中</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </div>
      <div
        v-show="mode === 'edit' && !drawMode"
        ref="toolbox"
        class="icons-block"
      >
        <div class="drag-area">
          <span
            class="drag-panel"
            style="pointer-events: auto; cursor: move; user-select: none;"
            @mousedown="startDrag($event, 'toolbox')"
            @click="showCollapse = !showCollapse"
          >
            圖形
            <unicon
              :name="showCollapse ? 'minus-circle' : 'plus-circle'"
            ></unicon>
          </span>
        </div>
        <a-collapse v-if="showCollapse" v-model:activeKey="activeKey">
          <a-collapse-panel key="1">
            <template #header>
              <div style="pointer-events: auto" @mousedown.prevent>
                一般圖形
              </div>
            </template>
            <a-row :gutter="[5, 15]">
              <a-col :xs="6" class="shape">
                <img
                  src="/svg/text.svg"
                  height="30"
                  width="30"
                  alt=""
                  @click="onClick('text')"
                  @dragend="onDragend('text')"
                  style="pointer-events: stroke"
                />
              </a-col>
              <a-col :xs="6" class="shape">
                <img
                  src="/svg/textbox.svg"
                  height="30"
                  width="30"
                  alt=""
                  @click="onClick('textbox')"
                  @dragend="onDragend('textbox')"
                  style="pointer-events: stroke"
                />
              </a-col>

              <a-col :xs="6" class="shape">
                <img
                  src="/svg/line.svg"
                  height="30"
                  width="30"
                  alt=""
                  @click="onClick('line')"
                  @dragend="onDragend('line')"
                  style="pointer-events: stroke"
                />
              </a-col>
              <a-col :xs="6" class="shape">
                <img
                  src="/svg/rect.svg"
                  height="30"
                  width="30"
                  alt=""
                  @click="onClick('rect')"
                  @dragend="onDragend('rect')"
                  style="pointer-events: stroke"
                />
              </a-col>
              <a-col :xs="6" class="shape">
                <img
                  src="/svg/triangle.svg"
                  height="30"
                  width="30"
                  alt=""
                  @click="onClick('triangle')"
                  @dragend="onDragend('triangle')"
                  style="pointer-events: stroke"
                />
              </a-col>
              <a-col :xs="6" class="shape">
                <img
                  src="/svg/circle.svg"
                  height="30"
                  width="30"
                  alt=""
                  @click="onClick('circle')"
                  @dragend="onDragend('circle')"
                  style="pointer-events: stroke"
                />
              </a-col>
            </a-row>
          </a-collapse-panel>
          <a-collapse-panel key="2">
            <template #header>
              <div style="pointer-events: auto" @mousedown.prevent>
                特殊圖形
              </div>
            </template>
            <a-row :gutter="[5, 15]">
              <a-col v-for="v in svgIcons" :key="v" :xs="6" class="shape">
                <img
                  :src="`/svg/${v}.svg`"
                  height="30"
                  alt=""
                  @click="addItem"
                  @dragend="onSVGDragend($event)"
                  style="pointer-events: stroke"
                />
              </a-col>
            </a-row>
          </a-collapse-panel>
          <a-collapse-panel key="3">
            <template #header>
              <div style="pointer-events: auto" @mousedown.prevent>
                自訂圖形
              </div>
            </template>
            <a-row :gutter="[5, 15]">
              <a-col v-for="v in customImgs" :key="v" :xs="6" class="shape">
                <img
                  :src="v.Content"
                  height="30"
                  alt=""
                  style="pointer-events: stroke"
                  @click="v.type === 'svg' ? addItem($event) : addImage($event)"
                  @dragend="onCustomDragend($event, v.type)"
                />
              </a-col>
              <a-col :xs="6" class="shape">
                <input
                  type="file"
                  accept=".jpg, .png, .jpeg, .svg"
                  ref="imgFileInput"
                  style="display: none"
                  @input="uploadCustomImg"
                />
                <a-button
                  type="dashed"
                  class="add-btn"
                  style="pointer-events: stroke"
                  @click.prevent="openImgFileInput"
                  >+</a-button
                >
              </a-col>
            </a-row>
          </a-collapse-panel>
          <a-collapse-panel key="4">
            <template #header>
              <div style="pointer-events: auto" @mousedown.prevent>symbol</div>
            </template>
            <a-row style="max-height: 100px; overflow-y: auto" @wheel.stop>
              <a-col
                v-for="v in symbols"
                :key="v"
                :xs="24"
                class="shape"
                style="padding: 0.3rem"
              >
                <div
                  draggable="true"
                  style="
                    width: 100%;
                    pointer-events: auto;
                    display: flex;
                    justify-content: space-between;
                  "
                  @click.prevent="addSymbol($event, v)"
                  @dragend="onSymbolDragend($event, v)"
                >
                  <p>
                    {{ v.name }}
                  </p>
                  <span @click.stop="deleteSymbol(v.id)">刪除</span>
                </div>
              </a-col>
            </a-row>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div
        v-show="
          mode === 'edit' &&
          isActiveObject &&
          (isActiveObject !== 'symbol' || symbolMode)
        "
        class="setting-block"
        ref="settingbox"
        style="pointer-events: auto; cursor: move; user-select: none;"
        @mousedown="startDrag($event, 'settingbox')"
      >
        <a-card title="設定">
          <a-row :gutter="[10, 20]">
            <a-col :span="24">測點: </a-col>
            <a-col :span="24">
              <a-row align="middle" justify="space-between">
                <a-col :span="18" style="word-break: break-all">
                  {{ selectTagName }}
                </a-col>
                <a-col :span="5">
                  <sdButton
                    type="primary"
                    style="width: 100%"
                    :disabled="isActiveObject !== 'normal'"
                    @click="openTagModal"
                  >
                    屬性
                  </sdButton>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="24">變數名稱: </a-col>
            <a-col :span="24">
              <a-row align="middle" justify="space-between">
                <a-col :span="18" style="word-break: break-all">
                  {{ selectSymbolVar }}
                </a-col>
              </a-row>
            </a-col>

            <a-col :span="12">
              邊框
              <a-input
                v-model:value="strokeColor"
                :style="{ height: '55px' }"
                name="color"
                type="color"
                :disabled="!isActiveObject"
                @input="changeStroke"
              />
            </a-col>
            <a-col :span="12">
              填滿
              <a-input
                v-model:value="fillColor"
                :style="{ height: '55px' }"
                name="color"
                type="color"
                :disabled="!isActiveObject"
                @input="changeFill"
              />
            </a-col>
          </a-row>
        </a-card>
      </div>
      <div
        v-show="mode === 'edit' && isActiveObject === 'symbol' && !symbolMode"
        class="setting-block"
        ref="symbolbox"
        style="pointer-events: auto; cursor: move; user-select: none;"
        @mousedown="startDrag($event, 'symbolbox')"
      >
        <a-card title="綁定測點">
          <sdButton
            type="primary"
            style="margin-bottom: 20px"
            @click="editSymbol"
          >
            編輯symbol
          </sdButton>
          <div style="height: 300px; overflow-y: auto; overflow-x: hidden">
            <a-row
              v-for="v in selectSymbolList"
              :key="v.name"
              style="margin-bottom: 1rem"
              align="middle"
            >
              <a-col :span="8">
                {{ v.name }}
              </a-col>
              <a-col :span="16">
                <TagFilter
                  :value="v.value"
                  :multiple="false"
                  @setSingleTag="setSymbolTag($event, v.name)"
                />
              </a-col>
            </a-row>
          </div>
        </a-card>
      </div>
      <canvas
        v-show="!guiLoading"
        ref="canvas"
        width="100%"
        height="800"
      ></canvas>
    </div>
  </DiagramWrap>
</template>
<script src="./main.js"></script>
