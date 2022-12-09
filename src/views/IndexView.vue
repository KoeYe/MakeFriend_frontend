<script lang="ts" setup>
import { ref, watch, reactive,onMounted } from "vue"

import Aside from "../components/AsideComponent/AsideComponent.vue"
import Session from "../components/SessionComponent/SessionComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
let collapsed = ref(false)
const username = sessionStorage.getItem("username");
let screen_width = ref(document.body.clientWidth)
let sider_width = ref(document.body.clientWidth*0.23)
onMounted(
  window.onresize = () => {
    screen_width.value = document.body.clientWidth
    sider_width.value = document.body.clientWidth*0.23
  }
)
watch(screen_width, (newVal, oldVal) => {
    if (newVal < 1200) {
      //console.log("newVal", newVal);
      collapsed.value = true;
    } else {
      collapsed.value = false;
    }
  }
)
const col = () => {
  collapsed.value = !collapsed.value
}
</script>

<template>
  <a-layout class="base-container">
  <!--侧边栏-->
    <a-layout-sider :collapsed="collapsed" collapsible @collapse="col" :width=sider_width :collapsed-width=0>
      <Aside />
    </a-layout-sider>
    <a-layout>
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
  padding-left: 10px;
  padding-right: 10px;
  background-color: white;
  height: 100vh;
}
</style>
