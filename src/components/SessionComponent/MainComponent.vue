<template>
<div>
    <div v-for="mess of message">
        <el-card style="margin:10px" shadow="hover">{{mess.content}}</el-card>
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
let message = ref([])
const getMessage = () => {
    axios.
    get("/api/session/message?session_id="+props.session_id)
    .then((res)=>{
        message.value = res.data.messages;
        console.log(message.value.length)
    })
    setTimeout(()=>{
        //getMessage()
    },5000)
}
getMessage()
</script>