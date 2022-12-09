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
  <a-layout class="base-container">
  <!--侧边栏-->
    <a-layout-sider :resize-directions="['right']" :span="4">
      <Aside />
    </a-layout-sider>
    <a-layout :span="20">
      <router-view />
    </a-layout>
  </a-layout>

</template>

<style scoped>
.base-container {
  position:absolute;
  top:0;
  left:0;
  width:100%
}

.arco-layout-sider{
  max-width: 25%;
  min-width: 20%;
  padding-left: 10px;
  padding-right: 10px;
  background-color: white;
  height: 100vh;
}
</style>
