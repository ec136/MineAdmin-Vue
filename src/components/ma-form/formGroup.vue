<!--
 - MineAdmin is committed to providing solutions for quickly building web applications
 - Please view the LICENSE file that was distributed with this source code,
 - For the full copyright and license information.
 - Thank you very much for using MineAdmin.
 -
 - @Author X.Mo<root@imoi.cn>
 - @Link   https://gitee.com/xmo/mineadmin-vue
-->
<template>
  <div class="w-full">
    <a-spin :loading="loading" tip="加载中..." class="w-full">
      <a-space>
        <a-button type="primary" @click="add">
          <icon-plus /> 新增
        </a-button>
        <a-button type="primary" @click="flush" status="danger">
          <icon-stop /> 清空
        </a-button>
      </a-space>
      <a-card v-for="(data, index) in form[props.dataIndex]" :key="index" class="mt-3">
        <a-space class="mb-2">
          <a-button status="danger" size="small" @click="deleteCurrent(index)">
            <icon-close /> 删除   
          </a-button>
        </a-space>
        <template v-if="props.options.layout === 'auto'">
          <div :class="`grid grid-cols-1 lg:grid-cols-${ (props.options.layout === 'auto') ? ( props.options?.cols ?? 1 ) : 1}`">
            <template v-for="(item, idx) in rows[index]" :key="idx">
              <a-form-item
                v-show="formItemShow"
                :label="item.title ?? '未命名'"
                :field="`${props.dataIndex}.${index}.${item.dataIndex}`"
                label-col-flex="auto"
                :label-col-style="{ width: item.labelWidth ? item.labelWidth : props.options.labelWidth || '100px' }"
                :rules="item.rules || []"
                :validate-trigger="item.validateTrigger"
                :validate-status="item.validateStatus"
              >
                <slot :name="`${item.dataIndex}`" v-bind="{ data, item }">
                  <a-select
                    v-if="item.formType === 'select'"
                    v-model="data[item.dataIndex]"
                    :virtual-list-props="item.virtualList ? { height: 200 } : undefined"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    allow-clear
                    allow-search
                    allow-create
                    :max-tag-count="item.maxTagCount || 1"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :options="getDictData(item.dataIndex, index)"
                    :multiple="item.multiple"
                    @change="handlerCascader($event, item, index)"
                  />

                  <a-checkbox-group
                    v-else-if="item.formType === 'checkbox'"
                    v-model="data[item.dataIndex]"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    @change="handlerCascader($event, item, index)"
                  >
                    <a-checkbox
                      v-for="option in getDictData(item.dataIndex, index)"
                      :key="option" :value="Number.isInteger(data[item.dataIndex]) ? parseInt(option.value) : option.value"
                    >{{ option.label }}</a-checkbox>
                  </a-checkbox-group>

                  <a-radio-group
                    v-else-if="item.formType === 'radio'"
                    v-model="data[item.dataIndex]"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :type="item.type"
                    @change="handlerCascader($event, item, index)"
                  >
                    <a-radio
                      v-for="option in getDictData(item.dataIndex, index)"
                      :key="option" :value="Number.isInteger(data[item.dataIndex]) ? parseInt(option.value) : option.value"
                    >{{ option.label }}</a-radio>
                  </a-radio-group>

                  <a-transfer
                    v-else-if="item.formType === 'transfer'"
                    :title="['源数据', '目标数据']"
                    v-model="data[item.dataIndex]"
                    :show-search="item.showSearch"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :data="formDictData[item.dataIndex]"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <a-cascader
                    v-else-if="item.formType === 'cascader'"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    allow-clear
                    allow-search
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :expand-trigger="item.trigger || 'click'"
                    :options="formDictData[item.dataIndex]"
                    :multiple="item.multiple"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <a-tree-select
                    v-else-if="item.formType === 'treeSelect' || item.formType === 'tree-select'"
                    v-model="data[item.dataIndex]"
                    :treeProps="{ virtualListProps: item.virtualList ? { height: 240 } : undefined }"
                    :placeholder="item.placeholder || `请选择${item.title}，可通过 key 搜索`"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    allow-clear
                    allow-search
                    :field-names="(item.dict && item.dict.props) ? item.dict.props : { key: 'value', title: 'label' }"
                    :tree-checkable="item.treeCheckable"
                    :tree-check-strictly="item.treeCheckStrictly"
                    :max-tag-count="item.maxTagCount ?? 2"
                    :multiple="item.multiple"
                    :data="formDictData[item.dataIndex]"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <component
                    v-else-if="['date', 'range', 'time'].includes(item.formType)"
                    :is="getComponent(item)"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.formType === 'range'
                      ? ['请选择开始时间', '请选择结束时间']
                      : item.placeholder ? item.placeholder : `请选择${item.title}`
                    "
                    :format="item.format || ''"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :show-time="item.showTime"
                    :type="item.type"
                    :mode="item.mode"
                    allow-clear
                    style="width: 100%;"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <component
                    v-else-if="['month', 'year', 'week', 'quarter'].includes(item.formType)"
                    :is="getComponent(item)"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    :format="item.format || ''"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    allow-clear
                    style="width: 100%;"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <component
                    v-else-if="item.formType === 'mention'"
                    :is="getComponent(item)"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.placeholder || `请输入${item.title}`"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :split="item.split"
                    :type="item.type"
                    allow-clear
                    :prefix="item.prefix"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <a-button
                    v-else-if="item.formType === 'button'"
                    :disabled="item.disabled"
                    :type="item.type"
                    :status="item.status"
                    :style="item.style"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  >
                    <template #icon v-if="item.icon" >
                      <component :is="item.icon" />
                    </template>
                    {{ item.text || ''}}
                  </a-button>

                  <component
                    v-else
                    :is="getComponent(item)"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.placeholder || `请输入${item.title}`"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :max-length="item.maxLength || 0"
                    :max="item.max"
                    :min="item.min"
                    :step="item.step"
                    :precision="item.precision"
                    :checked-value="item.checkedValue"
                    :unchecked-value="item.uncheckedValue"
                    :show-ticks="item.showTicks"
                    :allow-half="item.half"
                    :type="item.type"
                    :autocomplete="
                      (item.formType === 'input-password' || item.type == 'password') ? 'off' : item.autocomplete
                    "
                    :limit="item.limit || 0"
                    :accept="item.accept || '*'"
                    :tip="item.tip"
                    :multiple="item.multiple || false"
                    :rounded="item.rounded || false"
                    :title="item.title || '点击上传'"
                    :icon="item.icon || 'icon-plus'"
                    :chunk="item.chunk || false"
                    :only-data="item?.onlyData ?? true"
                    :return-type="item?.returnType ?? 'url'"
                    :only-id="item?.onlyId ?? true"
                    :file-type="item.fileType || 'button'"
                    :show-word-limit="['input', 'textarea'].includes(item.formType) ? true : false"
                    :is-echo="item.isEcho"
                    :mode="item.mode"
                    :height="item.height || undefined"
                    :language="item.language || 'javascript'"
                    :isBind="item.language || false"
                    allow-clear
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                    :style="item.style"
                  />
                </slot>
                <template #extra v-if="item.formExtra">{{ item.formExtra }}</template>
              </a-form-item>
            </template>
          </div>
        </template>
        <a-row v-else :gutter="props.options?.gutter ?? 24">
          <template v-for="(item, idx) in rows[index]" :key="idx">
            <a-col :span="parseInt(props.options.layout === 'customer' ? (item.span || 24) : 24)">
              <a-form-item
                v-show="formItemShow"
                :label="item.title"
                :field="`${props.dataIndex}.${index}.${item.dataIndex}`"
                label-col-flex="auto"
                :label-col-style="{ width: item.labelWidth ? item.labelWidth : props.options.labelWidth || '100px' }"
                :rules="item.rules || []"
                :validate-trigger="item.validateTrigger"
                :validate-status="item.validateStatus"
              >
                <slot :name="`${item.dataIndex}`" v-bind="{ data, item }">
                  <a-select
                    v-if="item.formType === 'select'"
                    v-model="data[item.dataIndex]"
                    :virtual-list-props="item.virtualList ? { height: 200 } : undefined"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    allow-clear
                    allow-search
                    allow-create
                    :max-tag-count="item.maxTagCount || 1"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :options="getDictData(item.dataIndex, index)"
                    :multiple="item.multiple"
                    @change="handlerCascader($event, item, index)"
                  />

                  <a-checkbox-group
                    v-else-if="item.formType === 'checkbox'"
                    v-model="data[item.dataIndex]"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    @change="handlerCascader($event, item, index)"
                  >
                    <a-checkbox
                      v-for="option in getDictData(item.dataIndex, index)"
                      :key="option" :value="Number.isInteger(data[item.dataIndex]) ? parseInt(option.value) : option.value"
                    >{{ option.label }}</a-checkbox>
                  </a-checkbox-group>

                  <a-radio-group
                    v-else-if="item.formType === 'radio'"
                    v-model="data[item.dataIndex]"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :type="item.type"
                    @change="handlerCascader($event, item, index)"
                  >
                    <a-radio
                      v-for="option in getDictData(item.dataIndex, index)"
                      :key="option" :value="Number.isInteger(data[item.dataIndex]) ? parseInt(option.value) : option.value"
                    >{{ option.label }}</a-radio>
                  </a-radio-group>

                  <a-transfer
                    v-else-if="item.formType === 'transfer'"
                    :title="['源数据', '目标数据']"
                    v-model="data[item.dataIndex]"
                    :show-search="item.showSearch"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :data="formDictData[item.dataIndex]"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <a-cascader
                    v-else-if="item.formType === 'cascader'"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    allow-clear
                    allow-search
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :expand-trigger="item.trigger || 'click'"
                    :options="formDictData[item.dataIndex]"
                    :multiple="item.multiple"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <a-tree-select
                    v-else-if="item.formType === 'treeSelect' || item.formType === 'tree-select'"
                    v-model="data[item.dataIndex]"
                    :treeProps="{ virtualListProps: item.virtualList ? { height: 240 } : undefined }"
                    :placeholder="item.placeholder || `请选择${item.title}，可通过 key 搜索`"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    allow-clear
                    allow-search
                    :field-names="(item.dict && item.dict.props) ? item.dict.props : { key: 'value', title: 'label' }"
                    :tree-checkable="item.treeCheckable"
                    :tree-check-strictly="item.treeCheckStrictly"
                    :max-tag-count="item.maxTagCount ?? 2"
                    :multiple="item.multiple"
                    :data="formDictData[item.dataIndex]"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <component
                    v-else-if="['date', 'range', 'time'].includes(item.formType)"
                    :is="getComponent(item)"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.formType === 'range'
                      ? ['请选择开始时间', '请选择结束时间']
                      : item.placeholder ? item.placeholder : `请选择${item.title}`
                    "
                    :format="item.format || ''"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :show-time="item.showTime"
                    :type="item.type"
                    :mode="item.mode"
                    allow-clear
                    style="width: 100%;"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <component
                    v-else-if="['month', 'year', 'week', 'quarter'].includes(item.formType)"
                    :is="getComponent(item)"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.placeholder || `请选择${item.title}`"
                    :format="item.format || ''"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    allow-clear
                    style="width: 100%;"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <component
                    v-else-if="item.formType === 'mention'"
                    :is="getComponent(item)"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.placeholder || `请输入${item.title}`"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :split="item.split"
                    :type="item.type"
                    allow-clear
                    :prefix="item.prefix"
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  />

                  <a-button
                    v-else-if="item.formType === 'button'"
                    :disabled="item.disabled"
                    :type="item.type"
                    :status="item.status"
                    :style="item.style"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                  >
                    <template #icon v-if="item.icon" >
                      <component :is="item.icon" />
                    </template>
                    {{ item.text || ''}}
                  </a-button>

                  <component
                    v-else
                    :is="getComponent(item)"
                    v-model="data[item.dataIndex]"
                    :placeholder="item.placeholder || `请输入${item.title}`"
                    :disabled="item.disabled"
                    :readonly="item.readonly"
                    :max-length="item.maxLength || 0"
                    :max="item.max"
                    :min="item.min"
                    :step="item.step"
                    :precision="item.precision"
                    :checked-value="item.checkedValue"
                    :unchecked-value="item.uncheckedValue"
                    :show-ticks="item.showTicks"
                    :allow-half="item.half"
                    :type="item.type"
                    :autocomplete="
                      (item.formType === 'input-password' || item.type == 'password') ? 'off' : item.autocomplete
                    "
                    :limit="item.limit || 0"
                    :accept="item.accept || '*'"
                    :tip="item.tip"
                    :multiple="item.multiple || false"
                    :rounded="item.rounded || false"
                    :title="item.title || '点击上传'"
                    :icon="item.icon || 'icon-plus'"
                    :chunk="item.chunk || false"
                    :only-data="item?.onlyData ?? true"
                    :return-type="item?.returnType ?? 'url'"
                    :only-id="item?.onlyId ?? true"
                    :file-type="item.fileType || 'button'"
                    :show-word-limit="['input', 'textarea'].includes(item.formType) ? true : false"
                    :is-echo="item.isEcho"
                    :mode="item.mode"
                    :height="item.height || undefined"
                    :language="item.language || 'javascript'"
                    :isBind="item.language || false"
                    allow-clear
                    @change="item.change && item.change($event, { data, item, index })"
                    @click="item.click && item.click($event, { data, item, index })"
                    @blur="item.blur && item.blur($event, { data, item, index })"
                    :style="item.style"
                  />
                </slot>
                <template #extra v-if="item.formExtra">{{ item.formExtra }}</template>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-card>
    </a-spin>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { request } from '@/utils/request'
import { isFunction, isArray } from 'lodash'
import commonApi from '@/api/common'

const loading = ref(true)
const form = reactive({})
const rows = ref([])
const formDictData = ref({})
const cascaderItems = ref([])

let cascaderKeys = {}

const props = defineProps({
  modelValue: { type: Object },
  options: { type: Object, default: { layout: 'auto' } },
  columns: { type: Array },
  config: { type: Object },
  dataIndex: { type: String, default: 'datas' },
  emptyRow: { type: Number, default: 0 },
  cascaderKeys: { type: [ Object, String, Number, Boolean ], default: {} },
})

const emit = defineEmits(['update:modelValue'])
form[props.dataIndex] = []

watch(
  () => props.modelValue,
  vl => form[props.dataIndex] = vl
)

watch(
  () => form[props.dataIndex],
  vl => emit('update:modelValue', vl),
  { deep: true }
)

watch(
  () => props.cascaderKeys,
  vl => {
    if (JSON.stringify(vl) != JSON.stringify(cascaderKeys)) {
      form[props.dataIndex] = []
      cascaderKeys = JSON.parse(JSON.stringify(vl))
      init()
    }
  }, { deep: true }
)

const done = (status) => {
  loading.value = status
}

const add = ( data = {} ) => {
  let tmp = data.srcElement ? {} : data
  if (props.addRow && isFunction(props.addRow)) {
    props.addRow()
  }
  rows.value.push(props.columns)
  form[props.dataIndex].push(tmp)
}

const deleteCurrent = (index) => {
  if (props.deleteRow && isFunction(props.deleteRow)) {
    props.deleteRow()
  }
  form[props.dataIndex].splice(index, 1)
  rows.value.splice(index, 1)
  cascaderItems.value.map(name => {
    if (formDictData.value[name][index]) {
      formDictData.value[name][index] = undefined
    }
  })
}

const flush = () => {
  form[props.dataIndex] = []
  rows.value = []
}

props.modelValue.map(item => {
  add(item)
})

const requestDict = (url, method, params, data, timeout = 10 * 1000) => request({ url, method, params, data, timeout })

const init = async () => {
  loading.value = true
  const allowRequestFormType = ['radio', 'checkbox', 'select', 'transfer', 'treeSelect', 'tree-select', 'cascader']
  const allowCoverFormType = ['radio', 'checkbox', 'select', 'transfer']

  if (props.columns.length > 0) {
    props.columns.map(item => {
      if (item.cascaderItem && item.cascaderItem.length > 0) {
        item.cascaderItem.map(name => cascaderItems.value.push(name))
        form[props.dataIndex].map(async (data, index) => {
          await handlerCascader(data[item.dataIndex], item, index, false)
        })
      }
    })

    if (props.config && props.config.url && JSON.stringify( props.cascaderKeys) != '{}') {
      let tmp = {}
      tmp[props.config.cascaderKeyName] = props.cascaderKeys
      const response = await request({
        url: props.config.url,
        method: props.config.method ?? 'get',
        params: Object.assign(props.config.defaultParams, tmp),
        data: Object.assign(props.config.defaultParams, tmp),
        timeout: 10 * 1000
      })

      form[props.dataIndex] = response.data ?? []
    }

    props.columns.map(async item => {
      if (! formItemShow(item)) return
      
      if (allowRequestFormType.includes(item.formType) && item.dict && ! cascaderItems.value.includes(item.dataIndex)) {
        if (item.dict.name) {
          const response = await commonApi.getDict(item.dict.name)
          if (response.data) {
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, response.data)
          }
        } else if (item.dict.url) {
          const key = props.cascaderKeys[item.dataIndex]
          const url = item.dict.url
          const tmp = {}
          if (key && !props.config && !props.config.url) {
            if (item.dict.url.indexOf('{{key}}') > 0) {
              url.replace('{{key}}', key)
            } else {
              tmp['key'] = key
            }
          }
          const params = Object.assign(item.dict.params || {}, tmp)
          const data   = Object.assign(item.dict.data || {}, tmp)
          const response = await requestDict(url, item.dict.method || 'GET', params, data)
          if (response.data) {
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, response.data)
          }
        } else if (item.dict.data) {
          if (isArray(item.dict.data)) {
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, item.dict.data)
          } else if (isFunction(item.dict.data)) {
            const response = await item.dict.data()
            formDictData.value[item.dataIndex] = handlerProps(allowCoverFormType, item, response)
          }
        }
      } else if (allowRequestFormType.includes(item.formType) && item.dict) {
        formDictData.value[item.dataIndex] = []
      }
    })
  }
  if (props.emptyRow > 0 && form[props.dataIndex].length == 0) {
    for (let i = 0; i < props.emptyRow; i++) {
      add()
    }
  }
  loading.value = false
}

const handlerProps = (allowType, item, tmpArr) => {
  let data = []
  let tran = {}
  if (allowType.includes(item.formType)) {
    data = tmpArr.map(dicItem => {
      const label = dicItem[ (item.dict.props && item.dict.props.label) || 'label'  ]
      let tmp = dicItem[ (item.dict.props && item.dict.props.value) || 'value' ]
      const value = tmp + ''
      tran[value] = label
      return { label, value } 
    })
  } else {
    data = tmpArr
  }
  data.tran = tran
  return data
}

const getDictData = (name, index) => {
  if (cascaderItems.value.includes(name)) {
    return formDictData.value[name][index] ?? undefined
  } else {
    return formDictData.value[name]
  }
}

const handlerCascader = async (val, column, index) => {
  if (column.cascaderItem && isArray(column.cascaderItem) && column.cascaderItem.length > 0 && val) {
    loading.value = true
    column.cascaderItem.map(async name => {
      form[props.dataIndex][index][name] = clearData === true ? undefined : form[props.dataIndex][index][name] ?? undefined
      const dict = props.columns.filter(col => col.dataIndex === name && col.dict )[0].dict
      if (dict && dict.url) {
        let response
        if (dict && dict.url.indexOf('{{key}}') > 0) {
          response = await requestDict(dict.url.replace('{{key}}', val), dict.method || 'GET', dict.params || {}, dict.data || {})
        } else {
          let temp = { key: val }
          const params = Object.assign(dict.params || {}, temp)
          const data   = Object.assign(dict.data || {}, temp)
          response = await requestDict(dict.url, dict.method || 'GET', params || {}, data || {})
        }
        if (response.data && response.code === 200) {
          formDictData.value[name][index] = response.data.map(dicItem => {
            return {
              'label': dicItem[ (dict.props && dict.props.label) || 'label'  ],
              'value': dicItem[ (dict.props && dict.props.value) || 'value' ]
            } 
          })
        } else {
          Message.error('字典联动请求失败：' + name)
          console.error(response)
        }
      }
    })
    loading.value = false
  }
}

const formItemShow = (item) => {
  if (typeof item.display == 'undefined' || item.display) {
    return true
  }
  return false
}

const getComponent = (item) => {
  if (!item.formType) {
    return `a-input`
  }
  if (['date', 'month', 'year', 'week', 'quarter', 'range', 'time'].includes(item.formType)) {
    return `a-${item.formType}-picker`
  }

  switch (item.formType) {
    case 'upload': return 'ma-upload'
    case 'select-user': return 'ma-user'
    case 'editor': return 'ma-editor'
    case 'code-editor': return 'ma-code-editor'
    case 'icon': return 'ma-icon'
    case 'user-info': return 'ma-user-info'
    case 'city-linkage': return 'ma-city-linkage'
    case 'select-resource': return 'ma-resource-button'
    default: return `a-${item.formType}`
  }
}

init()

defineExpose({ flush })
</script>