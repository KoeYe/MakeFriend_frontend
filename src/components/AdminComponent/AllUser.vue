<script lang="ts" setup>
import { ref, watch, reactive, computed } from "vue"
import ModelContent from "../ModelComponent/ModelComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { Notification } from '@arco-design/web-vue';
let users = ref([{
    id: "",
    username: "",
    email: "",
    address: "",
    phone: "",
    remarks: "",
}])
const getUser = () => {
    axios
    .get("/api/admin/all_users")
    .then((res) => {
        users.value = res.data.users
    })
}
getUser()
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Name',
    dataIndex: 'username',
  },
  {
    title: 'Address',
    dataIndex: 'address',
  },
  {
    title: 'Email',
    dataIndex: 'email',
  },
  {
    title: 'Remarks',
    dataIndex: 'remarks',
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
  },
  {
    title: 'Optional',
    slotName: 'optional',
  }
]

const deleteUser = (id:string)=>{
    axios
      .post("/api/admin/all_users",{
        id:id
      })
      .then((res)=>{
        ElMessage.success(res.data)
        getUser()
      })

}

</script>
<template>
  <a-table :columns="columns" :data="users">
      <template #optional="{ record }">
      <a-button status="danger" @click="$modal.info({ title:'Confirm', content:'Are you sure to delete the user?', onOk:()=>{deleteUser(record.id)}})">delete</a-button>
      </template>
  </a-table>
</template>