<template>
  <el-form :model="form" label-width="120px" size="large" label-position="top">
    <el-form-item label="">
      <h1>Login</h1>
    </el-form-item>
    <el-form-item label="Email address">
      <el-input
        v-model="form.email"
        type="email"
        placeholder="Please enter your email address"
      />
    </el-form-item>
    <el-form-item label="Password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="Please input your password"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onLogin">Login</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { reactive } from "vue";
// do not use same name with ref
const form = reactive({
  email: "",
  password: "",
});

const onLogin = () => {
  console.log("Login!");
  axios
    .post("/api/user/login", {
      email: form.email,
      password: form.password,
    })
    .then((responsive) => {
      ElMessage.success(responsive.data);
    })
    .catch((err) => {
      ElMessage.error(err.response.data);
    });
};
</script>
