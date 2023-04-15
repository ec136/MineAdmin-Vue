<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :crud="crud" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import coinTest from '@/api/coin/coinTest'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import * as common from '@/utils/common'

const crudRef = ref()




const crud = reactive({
  rowSelection: {
    showCheckedAll: true
  },
  searchLabelWidth: '75px',
  pk: 'id',
  operationColumn: false,
  operationWidth: 160,
  viewLayoutSetting: {
    layout: 'auto',
    cols: 1,
    viewType: 'modal',
    width: 600
  },
  api: coinTest.getList
})

const columns = reactive([
  {
    title: "",
    dataIndex: "id",
    formType: "input",
    addDisplay: false,
    editDisplay: false,
    hide: true,
    rules: {
      required: true,
      message: "请输入"
    }
  },
  {
    title: "名字",
    dataIndex: "name",
    formType: "input",
    search: true
  }
])
</script>
<script> export default { name: 'coin:test' } </script>