<template>
    <div>
        <a-row style="margin:10px" justify="space-between">
        <a-col :span="1"
            style="margin-left:10px"
            >
            <icon-face-smile-fill
                @click="showEmoji"
                style="height: 27px;width: 27px;margin:5px;margin-top:0px;position:relative;top:7px;cursor:pointer"
            />
        </a-col>
        <a-col :span="1">
            <div v-if="hasFile">
            <a-badge :text="fileList_[0].name" class="item">
            <el-upload
                ref="uploadRef"
                class="upload"
                action="/api/session/upload"
                :headers="headers"
                :auto-upload="false"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-change="handleUploadChange"
                :on-success="handleUploadSuccess"
                :limit=1
                :file-list="fileList_"
            >
                <template #trigger>
                    <Paperclip
                        @click="selectAttach"
                        style="height: 27px;width: 27px;margin:5px;margin-top:0px;position:relative;top:7px;cursor:pointer"
                    />
                </template>
            </el-upload>
            </a-badge>
        </div>
        <div v-else>
            <el-upload
                ref="uploadRef"
                class="upload"
                action="/api/session/upload"
                :headers="headers"
                :auto-upload="false"
                :show-file-list="false"
                :before-upload="beforeUpload"
                :on-change="handleUploadChange"
                :on-success="handleUploadSuccess"
                :limit=1
                :file-list="fileList_"
            >
                <template #trigger>
                    <Paperclip
                        @click="selectAttach"
                        style="height: 27px;width: 27px;margin:5px;margin-top:0px;position:relative;top:7px;cursor:pointer"
                    />
                </template>
            </el-upload>
        </div>
        </a-col>
        <a-col flex="auto">
            <el-form
                style="width: 100%;"
                hide-required-asterisk
                ref="formRef"
                :model="form"
                size="large"
                :rules="rules"
            >
                <el-form-item prop="text">
                        <el-input onkeypress="if(event.keyCode == 13) return false;" @keyup.enter="onSend(formRef)" v-model="form.text" placeholder="Hello..." > </el-input>
                </el-form-item>
            </el-form>
        </a-col>
        <a-col :span="1.5">
            <el-button
                type="primary"
                style="width: 90%;height:40px;margin-left:10px"
                @click="onSend(formRef)"
            >
                Send
                <div style="position:relative;top:-1px;margin:5px; width:20px; height:20px; background-color:aliceblue; border-radius: 20%;color:dimgrey; text-align: center;vertical-align: middle;box-shadow: 1px 1px 1px 1px;">
                    <svg style="height:15px;margin-top:2.5px" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M4.641 12.5l2.873 2.704a.75.75 0 0 1-1.028 1.092l-4.25-4a.75.75 0 0 1 0-1.092l4.25-4a.75.75 0 1 1 1.028 1.092L4.641 11H14.75a1.75 1.75 0 0 0 1.75-1.75v-4.5a.75.75 0 0 1 1.5 0v4.5a3.25 3.25 0 0 1-3.25 3.25H4.641z" fill="currentColor"></path></g></svg>
                </div>
            </el-button>
        </a-col>
    </a-row>
</div>
</template>

<script lang="ts" setup>
import { reactive, ref,getCurrentInstance, onMounted, onBeforeUnmount } from "vue";
import { ElButton, ElCol, ElForm, ElFormItem, ElInput, ElMessage, FormInstance,UploadInstance } from "element-plus";
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
let fileList_= ref<File[]>([])
const selectAttach = () => {
    //console.log("selectAttach")

}
const handleUploadChange = (file:any, fileList: File[]) => {
    console.log(fileList)
    if (file.status === "done") {
        ElMessage.success(`${file.name} file uploaded successfully.`);
        hasFile.value = false;
    } else if (file.status === 'error') {
        ElMessage.error(`${file.name} file upload failed.`);
        hasFile.value = false;
    } else if (file.status === 'ready') {
        //console.log(uploadRef.value!.UploadList[0])
        console.log('ready')
        fileList_.value.push(file)
        if(fileList_.value.length>0){
            hasFile.value = true;
        }
    } else if (file.status === 'remove') {
        console.log('remove')
        fileList_.value = []
        hasFile.value = false;
    }
    if(fileList.length===0){
        hasFile.value = false;
    }
}
let hasFile = ref(false)
const uploadRef = ref<UploadInstance>()
const props = defineProps(["session_id", "user2_id"])
const beforeUpload = (file: File) => {
    const isLt2M = file.size / 1024 / 1024 < 4;
    if (!isLt2M) {
        ElMessage.error('Image must smaller than 4MB!');
    }
    return isLt2M;
}
let headers = ref<Headers | Record<string, any>>()
const onSend = (formEl: FormInstance | undefined)=>{
    if (hasFile.value) {
        console.log("hasFile")
        console.log(fileList_.value)
        //console.log(uploadRef.value!.uploadFiles)
        axios
        .post("/api/session/update_file_content",{
                session_id: props.session_id,
                user_id: sessionStorage.getItem("id"),
                content: form.text,
            })
        .then((res)=>{
            ElMessage.info("Sending...")
            console.log(res.data)
            headers.value = {"id":res.data.id}
            uploadRef.value!.submit()
        })
        .finally(()=>{
            form.text = ""
            hasFile.value = false;
        });
    } else {
        console.log("noFile")
        if (!formEl) {
            return
        }
        formEl.validate((valid: boolean)=>{
        if (valid) {
            axios
            .post("/api/session/message",{
                session_id: props.session_id,
                user_id: sessionStorage.getItem("id"),
                content: form.text
            })
            .then((res)=>{
                ElMessage.success(res.data)
            })
            .catch((err)=>{
                ElMessage.error(err)
            })
            .finally(()=>{
                form.text = ""
                hasFile.value = false;
            });
        }
        else {
            ElMessage.error("Invalid message!");
        }
    })
    }
}
const handleUploadSuccess = (res: any, file: any) => {
    console.log(res)
    console.log(file)
    ElMessage.success(`${file.name} file uploaded successfully.`);
    hasFile.value = false;
}
const formRef = ref<FormInstance>()

const rules = reactive({
    text: [
        {max: 100, message: "The maximum number of characters is 100", trigger: "blur"},
    ]
})
const form = reactive({
    text: "",
})
</script>

<style scoped>

</style>


