<template>
    <div>
    <el-form
        hide-required-asterisk
        ref="formRef"
        :model="form"
        label-width="120px"
        label-position="top"
        size="large"
        :rules="rules"
    >
    <el-form-item label=" " prop="text">
        <el-col :span="22">
            <el-input onkeypress="if(event.keyCode == 13) return false;" @keyup.enter="onSend(formRef)" v-model="form.text" placeholder="Hello..." > </el-input>
        </el-col>
        <el-col :span="2">
            <el-button
                type="primary"
                style="width: 100%"
                @click="onSend(formRef)"
            >
                Send
                <div style="position:relative;top:-1px;margin:5px; width:20px; height:20px; background-color:aliceblue; border-radius: 20%;color:dimgrey; text-align: center;vertical-align: middle;box-shadow: 1px 1px 1px 1px;">
                    <svg style="height:15px;margin-top:2.5px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M4.641 12.5l2.873 2.704a.75.75 0 0 1-1.028 1.092l-4.25-4a.75.75 0 0 1 0-1.092l4.25-4a.75.75 0 1 1 1.028 1.092L4.641 11H14.75a1.75 1.75 0 0 0 1.75-1.75v-4.5a.75.75 0 0 1 1.5 0v4.5a3.25 3.25 0 0 1-3.25 3.25H4.641z" fill="currentColor"></path></g></svg>
                </div>
            </el-button>
        </el-col>
    </el-form-item>
    </el-form>
</div>
</template>

<script lang="ts" setup>
import { reactive, ref,getCurrentInstance, onMounted, onBeforeUnmount } from "vue";
import { ElButton, ElCol, ElForm, ElFormItem, ElInput, ElMessage, FormInstance } from "element-plus";
import { io, Socket } from "socket.io-client"
import axios from "axios";
// import { DefaultEventsMap } from "socket.io-client/build/typed-events";
// let socket: Socket<DefaultEventsMap, DefaultEventsMap>;
// onMounted(() => {
//     console.log("onMounted")
//     socket = io("ws://127.0.0.1:8000")
//     socket.on('connect', () => console.log('connect: websocket 连接成功！'))
// });
// onBeforeUnmount(() => {
//     socket.on('disconnect', () => console.log('disconnect: websocket 连接关闭！'))
//     socket.close();
// });
const props = defineProps(["session_id", "user2_id"])
const onSend = (formEl: FormInstance | undefined)=>{
    if (!formEl) {
        return
    }
    formEl.validate((valid: boolean)=>{
        if (valid) {
            //socket.emit('send', form.text);
            axios
            .post("/api/session/message",{
                session_id: props.session_id,
                user_id: sessionStorage.getItem("id"),
                content: form.text
            })
            .then((res)=>{
                ElMessage.success(res.data)
                form.text = ""
            })
            .catch((err)=>{
                ElMessage.error(err)
            });
        }
        else {
            ElMessage.error("Invalid message!");
        }
    })
}

const formRef = ref<FormInstance>()


const rules = reactive({
    text: [
        {max: 100, message: "The maximum number of characters is 100", trigger: "blur"},
        {required:true, message: "The content can not be empty", trigger: "blur"}
    ]
})
const form = reactive({
    text: "",
})
</script>


