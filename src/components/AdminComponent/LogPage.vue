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
const columns:any = [
  {
    title: 'Time',
    dataIndex: 'time',
    sortable: {
        sortDirections: ['descend', 'ascend'],
    }
  },
  {
    title: 'Level',
    slotName: 'level',
    filterable: {
        filters: [
            { text: 'INFO', value: 'INFO' },
            { text: 'WARNING', value: 'WARNING' },
            { text: 'ERROR', value: 'ERROR' },
        ],
        filter: (value:any, record:any) => record.level.includes(value),
        multiple: false,
    }
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Message',
    dataIndex: 'message',
  },
  {
    title: 'Path',
    dataIndex: 'path',
  },
]

</script>
<template>
    <a-table id="table" :columns="columns" :data="logs" :pagination="true" >
        <template #level="{ record }">
            <a-tag v-if="record.level=='INFO'" color="green">{{ record.level }}</a-tag>
            <a-tag v-else-if="record.level=='WARNING'" color="orange">{{ record.level }}</a-tag>
            <a-tag v-else color="red">{{ record }}</a-tag>
        </template>
    </a-table>
</template>