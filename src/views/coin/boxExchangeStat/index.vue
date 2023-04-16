<template>
  <div class="ma-content-block lg:flex justify-between p-4">
    <!-- CRUD 组件 -->
    <ma-crud :options="options" :columns="columns" ref="crudRef">
    </ma-crud>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import coinBoxExchangeStat from '@/api/coin/coinBoxExchangeStat'
import { Message } from '@arco-design/web-vue'
import tool from '@/utils/tool'
import * as common from '@/utils/common'

const crudRef = ref()




const options = reactive({
  rowSelection: {
    showCheckedAll: true
  },
  pk: 'id',
  operationColumn: false,
  operationWidth: 160,
  formOption: {
    viewType: 'modal',
    width: 600
  },
  api: coinBoxExchangeStat.getList,
  export: {
    show: true,
    url: 'coin/boxExchangeStat/export',
    auth: ['coin:boxExchangeStat:export']
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
    title: "宝箱id",
    dataIndex: "boxId",
    formType: "input",
    search: true,
    addDisplay: false,
    editDisplay: false,
    commonRules: {
      required: true,
      message: "请输入宝箱id"
    }
  },
  {
    title: "兑换日期",
    dataIndex: "day",
    formType: "input",
    search: true,
    addDisplay: false,
    editDisplay: false,
    commonRules: {
      required: true,
      message: "请输入兑换日期"
    }
  },
  {
    title: "兑换宝箱数",
    dataIndex: "exchangeNum",
    formType: "input",
    search: true,
    addDisplay: false,
    editDisplay: false,
    commonRules: {
      required: true,
      message: "请输入兑换宝箱数"
    }
  },
  {
    title: "兑换金币数",
    dataIndex: "coin",
    formType: "input",
    search: true,
    addDisplay: false,
    editDisplay: false,
    commonRules: {
      required: true,
      message: "请输入兑换金币数"
    }
  },
  {
    title: "兑换总次数",
    dataIndex: "exchangeCount",
    formType: "input",
    search: true,
    addDisplay: false,
    editDisplay: false,
    commonRules: {
      required: true,
      message: "请输入兑换总次数"
    }
  },
  {
    title: "兑换用户数",
    dataIndex: "userCount",
    formType: "input",
    search: true,
    addDisplay: false,
    editDisplay: false,
    commonRules: {
      required: true,
      message: "请输入兑换用户数"
    }
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
<script> export default { name: 'coin:boxExchangeStat' } </script>