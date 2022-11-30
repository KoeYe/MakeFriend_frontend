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
      <h1>Forget Password</h1>
    </el-form-item>
    <el-form-item label="Email address" prop="email">
      <el-input
        v-model="form.email"
        type="email"
        placeholder="Please input your email address"
      />
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="Please input new password"
        show-password
      />
    </el-form-item>
    <el-form-item label="Confirm new Password" prop="conf_password">
      <el-input
        v-model="form.conf_password"
        type="password"
        placeholder="Please confirm password"
        show-password
      />
    </el-form-item>
    <el-form-item label="Captcha" prop="captcha">
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
      <el-button type="primary" @click="onForgetPassword(formRef)">Submit</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance } from "element-plus";
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

const formRef = ref<FormInstance>()

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

const checkConfirmPassword = (rule:any, value:any, callback:any) => {
  if (value!=form.password) {
    return callback(new Error('Please confirm the password'))
  } else {
    callback();
  }
}

const rules = reactive({
  email: [
    { required: true, message: "Please input email address", trigger: 'blur' },
    {type: 'email', message: "Please input valid email address", trigger:['blur', 'change']},
  ],
  username: [
    { required: true, trigger: 'blur' },
    { min:3, message: "Username must be at least 3 letters", trigger:['blur', 'change']},
    { max:20, message: "Username must be at most 20 characters", trigger:['blur','change']}
  ],
  password: [
    { required: true, trigger: 'blur' },
    { min:5, message: "Password must be at least 5 letters", trigger:['blur', 'change']},
    { max:20, message: "Password must be at most 20 characters", trigger:['blur','change']}
  ],
  conf_password: [
    { required: true,message:"Please confirm password!", trigger: 'blur' },
    { validator: checkConfirmPassword, trigger: 'blur' },
  ],
  captcha: [
    { required: true, trigger: 'blur' },
    { len:4, message: "Please input the valid captcha", trigger:['blur', 'change']},
  ],
})

const onForgetPassword = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
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
    } else {
      ElMessage.error("Please enter the valid form!")
    }
  })
};
</script>
