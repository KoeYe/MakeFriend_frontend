<template>
  <el-form
    hide-required-asterisk
    status-icon
    ref="formRef"
    :model="form"
    label-width="120px"
    label-position="top"
    size="large"
    :rules="rules"
  >
    <el-form-item label="">
      <h1>Login</h1>
    </el-form-item>
    <el-form-item label="Email address" prop="email">
      <el-input
        v-model="form.email"
        type="email"
        placeholder="Please enter your email address"
      />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="Please input your password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onLogin(formRef)">Login</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import type { FormInstance } from 'element-plus'
import { useRouter, useRoute } from 'vue-router'

// do not use same name with ref
const form = reactive({
  email: "",
  password: "",
});

const rules = reactive({
  email: [
    {required: true, message: "Please input email address", trigger: 'blur'},
    {type: 'email', message: "Please input valid email address", trigger:['blur', 'change']},
  ],
  password: [
    { required: true, trigger: 'blur' },
    { min:5, message: "Password must be at least 5 letters", trigger:['blur', 'change']},
    { max:20, message: "Password must be at most 20 characters", trigger:['blur','change']}
  ],
})

const router = useRouter()

const formRef = ref<FormInstance>()

const onLogin = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
    axios
      .post("/api/user/login", {
        email: form.email,
        password: form.password,
      })
      .then((responsive) => {
        //const res = JSON.parse(responsive.data)
        if(responsive.data.code==200){
          if(responsive.data.id!=0){
            ElMessage.success(responsive.data.message);
            router.push("/index");
            localStorage.setItem("username", responsive.data.username)
            localStorage.setItem("token", responsive.data.token)
            console.log(localStorage.getItem("token"))
            //const username = localStorage.getItem("username");
            //console.log("username in session:",username)
            localStorage.setItem("id", responsive.data.id)
          } else if (responsive.data.id === 0){
            ElMessage.success(responsive.data.message);
            router.push("/admin");
            localStorage.setItem("username", responsive.data.username)
            localStorage.setItem("token", responsive.data.token)
          }
        } else {
          ElMessage.error(responsive.data.message);
        }
      })
      .catch((err) => {
        //console.log(err)
        ElMessage.error(err.response.data);
      });
    } else {
      ElMessage.error("Please enter the valid form!")
    }
  })
};
</script>
