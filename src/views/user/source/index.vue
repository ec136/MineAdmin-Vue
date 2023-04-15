<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="options" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import userSource from '@/api/user/userSource'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import * as common from '@/utils/common'

const crudRef = ref()




const options = reactive({
  rowSelection: {
    showCheckedAll: true
  },
  pk: 'id',
  operationColumn: true,
  operationWidth: 160,
  formOption: {
    viewType: 'modal',
    width: 600
  },
  api: userSource.getList,
  add: {
    show: true,
    api: userSource.save,
    auth: ['user:source:save']
  },
  edit: {
    show: true,
    api: userSource.update,
    auth: ['user:source:update']
  },
  delete: {
    show: true,
    api: userSource.deletes,
    auth: ['user:source:delete']
  }
})

const columns = reactive([
  {
    title: "",
    dataIndex: "id",
    formType: "input",
    addDisplay: false,
    editDisplay: false,
    hide: true,
    commonRules: {
      required: true,
      message: "请输入"
    }
  },
  {
    title: "资源名称",
    dataIndex: "name",
    formType: "input",
    search: true
  },
  {
    title: "资源key",
    dataIndex: "source",
    formType: "input",
    search: true
  },
  {
    title: "资源地址",
    dataIndex: "img",
    formType: "resource",
    search: true,
    multiple: true,
    onlyData: false,
    returnType: "url",
    type: "image",
    chunk: true
  },
  {
    title: "",
    dataIndex: "created_at",
    formType: "date",
    addDisplay: false,
    editDisplay: false,
    hide: true,
    showTime: true
  },
  {
    title: "",
    dataIndex: "updated_at",
    formType: "date",
    addDisplay: false,
    editDisplay: false,
    hide: true,
    showTime: true
  }
])
</script>
<script> export default { name: 'user:source' } </script>