<script lang="ts" setup>
import { ref, watch, reactive, computed } from "vue"
import ModelContent from "../ModelComponent/ModelComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { Notification } from '@arco-design/web-vue';
let logs = ref([{
    level: "",
    message: "",
    time: "",
    path: "",
    address: "",
}])

const get_log = () => {
    axios
    .get("/api/admin/log")
    .then((res) => {
        //console.log(res.data)
        logs.value = res.data
        //console.log(logs.value)
    })
}
get_log()
const columns = [
  {
    title: 'Time',
    dataIndex: 'time',
  },
  {
    title: 'Level',
    dataIndex: 'level',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Path',
    dataIndex: 'path',
  },
  {
    title: 'Message',
    dataIndex: 'message',
  },
]
</script>
<template>
    <a-table id="table" :columns="columns" :data="logs" :pagination="false" />
</template>