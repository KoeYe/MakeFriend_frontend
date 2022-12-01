<template>
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
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";

const onSend = (formEl: FormInstance | undefined)=>{
    if (!formEl) {
        return
    }
    formEl.validate((valid: boolean)=>{
        if (valid) {
            ElMessage.info("Sending message...")
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


