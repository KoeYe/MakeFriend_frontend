<template>
  <el-form :model="form" label-width="120px" label-position="top" size="large">
    <el-form-item label="">
      <h1>Forget Password</h1>
    </el-form-item>
    <el-form-item label="Email address">
      <el-input
        v-model="form.email"
        type="email"
        placeholder="Please input your email address"
      />
    </el-form-item>
    <el-form-item label="Password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="Please input new password"
        show-password
      />
    </el-form-item>
    <el-form-item label="Confirm new Password">
      <el-input
        v-model="form.conf_password"
        type="password"
        placeholder="Please confirm password"
        show-password
      />
    </el-form-item>
    <el-form-item label="Captcha">
      <el-col :span="19">
        <el-input v-model="form.captcha" placeholder="Please input"> </el-input>
      </el-col>
      <el-col :span="5">
        <el-button
          type="primary"
          @click="sendCaptcha"
          style="width: 100%"
          :disabled="captcha_btn_dis"
        >
          {{ captcha_btn_text }}
        </el-button>
      </el-col>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onForgetPassword">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

const emit = defineEmits(["redirect"]);

let captcha_btn_dis = ref(false);
let captcha_btn_text = ref("Get Captcha");
// do not use same name with ref
const form = reactive({
  email: "",
  password: "",
  conf_password: "",
  captcha: "",
});

const sendCaptcha = () => {
  console.log(captcha_btn_dis);
  axios
    .post("/api/user/captcha", {
      email: form.email,
      operation: "Forget Password",
    })
    .then((response) => {
      //这里不能写成ref()赋值，要不然变量不能马上变化
      captcha_btn_dis.value = true;
      let countDown = 60;
      let timer = setInterval(function () {
        countDown--;
        if (countDown > 0) {
          captcha_btn_text.value = "Resent in " + countDown + "s";
          //完成之后可以重新点击
        } else {
          captcha_btn_text.value = "Get captcha";
          captcha_btn_dis.value = false;
          clearInterval(timer); //  清除计时器
        }
      }, 1000);
      ElMessage.success(response.data);
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error(err.response.data);
    });
};

const onForgetPassword = () => {
  // console.log("Register");
  axios
    .post("/api/user/forget_password", {
      email: form.email,
      password: form.password,
      password_confirm: form.conf_password,
      captcha: form.captcha,
    })
    .then((response) => {
      ElMessage.success(response.data);
      emit("redirect");
    })
    .catch((err) => {
      // console.log(err);
      ElMessage.error(err.response.data);
    });
};
</script>
