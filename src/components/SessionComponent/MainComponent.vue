<template>
<div>
    <div v-for="mess of message">
        <div v-if="(mess.user_id==user_id)">
            <el-row justify="end">
                <el-card style="margin:10px; text-align: right; width:fit-content;background-color: rgb(239, 253, 222);" shadow="hover">{{mess.content}}</el-card>
            </el-row>
        </div>
        <div v-if="(mess.user_id!=user_id)">
            <el-row justify="start">
                <el-card style="margin:10px; text-align: left; width:fit-content;" shadow="hover">{{mess.content}}</el-card>
            </el-row>
        </div>
    </div>
</div>
</template>
<script lang="ts" setup>
import axios from "axios";
import { messageType } from "element-plus";
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
//console.log("hello session!")
let props = defineProps(["session_id"])
let message:any = ref([])
const user_id = sessionStorage.getItem('id')
const getMessage = () => {
    axios.
    get("/api/session/message?session_id="+props.session_id)
    .then((res)=>{
        message.value = res.data.messages;
        console.log(message.value)
        //console.log(message.value.length)
    })
    setTimeout(()=>{
        getMessage()
    },50000)
}
getMessage()
</script>