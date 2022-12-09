<template>
<div style="margin:0px">
    <el-scrollbar ref="scrollbarRef" always style="height:calc(100vh - 120px);margin:0px">
        <div ref="innerRef">
        <div v-for="mess of message">
            <div v-if="(mess.user_id==user_id)">
                <el-row  justify="end">
                    <a-space align='end' size='mini'>
                    <div v-show="visibile(mess.id)==1"
                        @mouseenter="mouseenter(mess.id)"
                        @mouseleave="mouseleave(mess.id)">
                    <a-popconfirm content="Are you sure you want to delete the message?" position="left"
                                    ok-text="Yes" cancel-text="No" @ok="deleteMessage(mess.id)"
                                    >
                        <el-button :icon="Delete" circle class="del-btn"/>
                    </a-popconfirm>
                    </div>
                    <el-card
                        @mouseenter="mouseenter(mess.id)"
                        @mouseleave="mouseleave(mess.id)"
                        body-style="padding-top:5px; padding-bottom:5px"
                        style="hover{box-shadow: 2px 2px 2px 2px;}; margin:0px;border-radius: 20px; margin:8px; text-align: right; width:fit-content;background-color: rgb(239, 253, 222);"
                        shadow="hover"
                    >
                        <div v-if="(mess.type=='text')">
                            <el-row v-if="mess.content.length>=1"><h4><a-typography-paragraph copyable>{{mess.content}}</a-typography-paragraph></h4></el-row>
                            <el-row v-else><h4>{{mess.content}}</h4></el-row>
                        </div>
                        <div v-else-if="(mess.type=='image')">
                            <el-row>
                                <a-image :src="mess.url" style="margin-top:15px;border-radius:25px;">
                                </a-image>
                            </el-row>
                            <el-row justify="end" v-if="mess.content.length>=1"><h4><a-typography-paragraph copyable>{{mess.content}}</a-typography-paragraph></h4></el-row>
                            <el-row  justify="end" v-else><h4>{{mess.content}}</h4></el-row>
                        </div>
                        <div v-else-if="(mess.type=='file')">
                            <div class="file" style="cursor: pointer;" @click="download(mess.url, mess.filename)">
                            <el-row justify="center">
                                <el-icon size="xxx-large"><Document /></el-icon>
                            </el-row>
                            <el-row>
                                <h5>{{mess.filename}}</h5>
                            </el-row>
                            </div>
                            <el-row justify="end" v-if="mess.content.length>=1"><h4><a-typography-paragraph copyable>{{mess.content}}</a-typography-paragraph></h4></el-row>
                            <el-row justify="end" v-else><h4>{{mess.content}}</h4></el-row>
                        </div>
                        <el-row justify="end" style="font-size:xx-small;margin:0px;color:green">{{(mess.hour<10?'0'+mess.hour:mess.hour)}}:{{(mess.minute<10?'0'+mess.minute:mess.minute)}}</el-row>
                    </el-card>
                    </a-space>
                </el-row>
            </div>
            <div v-if="(mess.user_id!=user_id)">
                <el-row justify="start">
                    <a-space align='end' size='mini'>
                    <el-card
                        @mouseenter="mouseenter(mess.id)"
                        @mouseleave="mouseleave(mess.id)"
                        body-style="padding-top:5px; padding-bottom:5px"
                        style="hover{box-shadow: 2px 2px 2px 2px;}; border-radius: 20px; margin:8px; text-align: right; width:fit-content;"
                        shadow="hover"
                    >
                        <div v-if="(mess.type=='text')">
                            <el-row v-if="mess.content.length>=1"><h4><a-typography-paragraph copyable>{{mess.content}}</a-typography-paragraph></h4></el-row>
                            <el-row v-else><h4>{{mess.content}}</h4></el-row>
                        </div>
                        <div v-else-if="(mess.type=='image')">
                            <el-row>
                                <a-image :src="mess.url" style="margin-top:15px;border-radius:25px;">
                                </a-image>
                            </el-row>
                            <el-row v-if="mess.content.length>=1"><h4><a-typography-paragraph  copyable>{{mess.content}}</a-typography-paragraph></h4></el-row>
                            <el-row v-else><h4>{{mess.content}}</h4></el-row>
                        </div>
                        <div v-else-if="(mess.type=='file')">
                            <div class="file" style="cursor:pointer"  @click="download(mess.url, mess.filename)">
                            <el-row justify="center">
                                <el-icon size="xxx-large"><Document /></el-icon>
                            </el-row>
                            <el-row>
                                <h5>{{mess.filename}}</h5>
                            </el-row>
                            </div>
                            <el-row v-if="mess.content.length>=1"><h4><a-typography-paragraph copyable>{{mess.content}}</a-typography-paragraph></h4></el-row>
                            <el-row v-else><h4>{{mess.content}}</h4></el-row>
                        </div>
                        <el-row justify="start" style="font-size:xx-small;margin:0px;color:gray">{{(mess.hour<10?'0'+mess.hour:mess.hour)}}:{{(mess.minute<10?'0'+mess.minute:mess.minute)}}</el-row>
                    </el-card>
                    <div v-show="visibile(mess.id)==1"
                        @mouseenter="mouseenter(mess.id)"
                        @mouseleave="mouseleave(mess.id)">
                    <a-popconfirm content="Are you sure you want to delete the message?" position="right"
                                    ok-text="Yes" cancel-text="No" @ok="deleteMessage(mess.id)"
                                    >
                        <el-button :icon="Delete" circle class="del-btn"/>
                    </a-popconfirm>
                    </div>
                    </a-space>
                </el-row>
            </div>
        </div>
        </div>
    </el-scrollbar>
</div>
</template>
<script lang="ts" setup>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'
import axios from "axios";
import { messageType,ElScrollbar, ElMessage, linkEmits } from "element-plus";
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
const innerRef = ref<HTMLDivElement>()
let scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()
const inputSlider = () => {
    //console.log("setting scroll")
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
        //console.log(message.value)
        //console.log(message.value[message.value.length-1].content)
        //console.log(message.value.length)
    })
    setTimeout(()=>{
        getMessage()
    },50000)
}
getMessage()
setTimeout(()=>{inputSlider()},200)
let visibile_id = ref()
const mouseenter = (id:string) => {
    visibile_id.value = id
}
const mouseleave = (id:string) => {
    setTimeout(()=>{visibile_id.value = ""},10000)
}
const visibile = (id:string) => {
    if(visibile_id.value === id){
        console.log(visibile_id.value)
        return 1
    }else{
        return 0
    }
}
const deleteMessage = (id:any) => {
    axios.
    delete("/api/session/message?message_id="+id)
    .then((res)=>{
        ElMessage.success(res.data)
        //getMessage()
    })
}
const download = (url: string | URL, filename: string) => {
    console.log(filename)
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        const url = window.URL.createObjectURL(this.response)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    xhr.send();
}
</script>

<style scoped>
.del-btn{
    background-color: rgba(0, 0, 0, 0.2);
    border-width: 0;
    position:relative;
    bottom: 5px;
}
.del-btn:hover{
    color: black;
}

.file:hover{
    color: rgb(131,176,240);
}
</style>