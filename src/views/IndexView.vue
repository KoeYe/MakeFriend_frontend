<script lang="ts" setup>
import { ref, watch, reactive } from "vue"

import Aside from "../components/AsideComponent/AsideComponent.vue"
import Session from "../components/SessionComponent/SessionComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const username = sessionStorage.getItem("username");
</script>

<template>
  <el-container class="base-container">
  <!--侧边栏-->
    <el-aside :span="4">
      <Aside />
    </el-aside>
    <el-container :span="20">
      <router-view />
    </el-container>
  </el-container>

</template>

<style scoped>
.base-container {
  position:absolute;
  top:0;
  left:0;
  width:100%
}

.el-aside{
  padding-left: 10px;
  padding-right: 10px;
  background-color: white;
}
</style>
