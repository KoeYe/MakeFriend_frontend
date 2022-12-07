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
            <el-input v-model="form.text" placeholder="Hello..." > </el-input>
        </el-col>
        <el-col :span="2">
            <el-button
                type="primary"
                style="width: 100%"
                @click="onSend(formRef)"
            >
                Send
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
        {max: 100, message: "The maximum number of characters is 100", trigger: "blur"}
    ]
})
const form = reactive({
    text: "",
})
</script>


