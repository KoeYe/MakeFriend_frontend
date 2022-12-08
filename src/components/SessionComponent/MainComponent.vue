<template>
<div style="margin:0px">
    <el-scrollbar ref="scrollbarRef" always style="height:calc(100vh - 130px);margin:0px">
        <div ref="innerRef">
        <div v-for="mess of message">
            <div v-if="(mess.user_id==user_id)">
                <el-row justify="end">
                    <el-card body-style="padding-top:5px; padding-bottom:5px" style="hover{box-shadow: 2px 2px 2px 2px;}; border-radius: 20px; margin:8px; text-align: right; width:fit-content;background-color: rgb(239, 253, 222);" shadow="hover">
                        <el-row><h4>{{mess.content}}</h4></el-row>
                        <el-row justify="end" style="font-size:xx-small;margin:0px;color:green">{{(mess.hour<10?'0'+mess.hour:mess.hour)}}:{{(mess.minute<10?'0'+mess.minute:mess.minute)}}</el-row>
                    </el-card>
                </el-row>
            </div>
            <div v-if="(mess.user_id!=user_id)">
                <el-row justify="start">
                    <el-card body-style="padding-top:5px; padding-bottom:5px" style="hover{box-shadow: 2px 2px 2px 2px;}; border-radius: 20px;margin:8px; text-align: left; width:fit-content;" shadow="hover">
                        <el-row><h4>{{mess.content}}</h4></el-row>
                        <el-row justify="end" style="font-size:xx-small;margin:0px;color:gray">{{(mess.hour<10?'0'+mess.hour:mess.hour)}}:{{(mess.minute<10?'0'+mess.minute:mess.minute)}}</el-row>
                    </el-card>
                </el-row>
            </div>
        </div>
        </div>
    </el-scrollbar>
</div>
</template>
<script lang="ts" setup>
import axios from "axios";
import { messageType,ElScrollbar } from "element-plus";
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
const innerRef = ref<HTMLDivElement>()
let scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const inputSlider = () => {
    console.log("setting scroll")
    scrollbarRef.value?.setScrollTop(innerRef.value!.clientHeight-380)
}
let props = defineProps(["session_id"])
let message:any = ref([])
const user_id = sessionStorage.getItem('id')
const getMessage = () => {
    axios.
    get("/api/session/message?session_id="+props.session_id)
    .then((res)=>{
        message.value = res.data.messages;
        console.log(message.value)
        console.log(message.value[message.value.length-1].content)
        //console.log(message.value.length)
    })
    setTimeout(()=>{
        getMessage()
    },1000)
}
getMessage()
setTimeout(()=>{inputSlider()},200)
</script>