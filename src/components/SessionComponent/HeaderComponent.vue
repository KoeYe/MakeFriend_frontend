<script lang="ts" setup>
import { ref, watch } from "vue"
import axios from 'axios';

const props = defineProps(["user1_id"])
console.log(props.user1_id)
let user1_id = ref(props.user1_id)
let user1_username = ref("")
watch(
    ()=>props.user1_id,
    async (NewId:string)=>{
        console.log(props.user1_id)
        getUser(NewId)
    }
)
const getUser = (id:string) => {
axios
  .get("/api/user/username?id="+id)
  .then((res)=>{
    //console.log(res.data)
    user1_username.value = res.data
  })
}
//console.log(user1_id.value)

</script>
<template>
<div>
    <el-row class="mb-4" style="height: 60px; padding-top: 10px;">
    <el-col :span="10">
        <h1 style="height: 40px; padding-top: 10px;">{{user1_username}}</h1>
    </el-col>
    <el-col :span="1" :offset="13">
        <el-button style="height: 40px; padding-top: 10px;"><el-icon><MoreFilled /></el-icon></el-button>
    </el-col>
    </el-row>
</div>
</template>