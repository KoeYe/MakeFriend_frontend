<script lang="ts" setup>
import { reactive } from "vue";
import LoginForm from "./LoginForm.vue";
import RegisterForm from "./RegisterForm.vue";
import ForgetPasswordForm from "./ForgetPasswordForm.vue";


const form = reactive({ login: true, register: true });

const onForgetPassword = () => {
  console.log("Forget password!");
  form.login = false;
  form.register = false;
};

const onRegister = () => {
  console.log("Register!");
  form.register = true;
  form.login = false;
};

const onLogin = () => {
  console.log("Login!");
  form.login = true;
  form.register = false;
};
</script>

<template>
    <div v-if="form.login">
      <LoginForm />
      <el-button @click="onForgetPassword">Forget password</el-button>
      <el-button @click="onRegister">Register</el-button>
    </div>
    <div v-else-if="form.register">
      <RegisterForm @redirect="onLogin" />
      <el-button @click="onForgetPassword">Forget password</el-button>
      <el-button @click="onLogin">Login</el-button>
    </div>
    <div v-else>
      <ForgetPasswordForm @redirect="onLogin" />
      <el-button @click="onLogin">Login</el-button>
      <el-button @click="onRegister">Register</el-button>
    </div>
</template>
<style scoped>
</style>