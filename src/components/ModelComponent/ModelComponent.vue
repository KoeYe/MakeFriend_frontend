<script lang="ts" setup>
import axios from "axios"
import {ElMessage} from "element-plus"
import {useRouter} from "vue-router"
const router = useRouter();
const logout = () => {
  //ElMessage.info("Log out...")
  axios
    .post("/api/user/logout", {
      withCredentials : true
    }).then(()=>{
      ElMessage.success("Log out successfully!")
      router.replace("/")
    }).catch(() => {
      ElMessage.error("Log out failed!")
    })
}
</script>

<template>
    <el-row class="mb-4">
      <el-button @click="logout()" type="danger"><el-icon><SwitchButton /></el-icon>logout</el-button>
    </el-row>
</template>