<template>
  <el-form
    :model="form"
    label-width="120px"
    label-position="top"
    size="large"
    :rules="rules"
  >
    <el-form-item label="">
      <h1>Register</h1>
    </el-form-item>
    <el-form-item label="Email address">
      <el-input
        v-model="form.email"
        type="email"
        placeholder="Please enter your email address"
      />
    </el-form-item>
    <el-form-item label="User name">
      <el-input
        v-model="form.username"
        placeholder="Please input your username"
      />
    </el-form-item>
    <el-form-item label="Password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="Please input password"
        show-password
      />
    </el-form-item>
    <el-form-item label="Confirm Password">
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
      <el-button type="primary" @click="onRegister">Register</el-button>
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
  username: "",
  password: "",
  conf_password: "",
  captcha: "",
});

const checkEmail = (rule:any, value:any, callback:any) => {
  if (value==="") {
    return callback(new Error('Please input the email'))
  }
}

const checkUsername = (rule:any, value:any, callback:any) => {
  if (value==="") {
    return callback(new Error('Please input the username'))
  }
}

const checkPassword = (rule:any, value:any, callback:any) => {
  if (value==="") {
    return callback(new Error('Please input the password'))
  }
}

const checkConfirmPassword = (rule:any, value:any, callback:any) => {
  if (value==="") {
    return callback(new Error('Please confirm the password'))
  }
}


const checkCaptcha = (rule:any, value:any, callback:any) => {
  if (value==="") {
    return callback(new Error('Please input the captcha'))
  }
}

const rules = reactive({
  email: [{ validator: checkEmail, trigger: 'blur' }],
  username: [{ validator: checkUsername, trigger: 'blur' }],
  password: [{ validator: checkPassword, trigger: 'blur' }],
  conf_password: [{ validator: checkConfirmPassword, trigger: 'blur' }],
  captcha: [{ validator:checkCaptcha, trigger: 'blur' }],
})

const sendCaptcha = () => {
  console.log(captcha_btn_dis);
  axios
    .post("/api/user/captcha", {
      email: form.email,
      operation: "Registration",
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

const onRegister = (formEl:any) => {
  if (!formEl) return
  formEl.validate((valid:any) => {
    if (valid) {
      console.log('submit!')
      axios
        .post("/api/user/register", {
          username: form.username,
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
      console.log('error submit!')
      return false
    }
  })
  // console.log("Register");

};
</script>

<style scoped>
.el-alert {
  margin: 20px 0 0;
}
.el-alert:first-child {
  margin: 0;
}
</style>
