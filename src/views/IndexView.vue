<script lang="ts" setup>
import { ref, watch, reactive } from "vue"
import TextEditor from "../components/TextEditor.vue";
import ModelContent from "../components/model/ModelComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
const drawer = ref(false);
const username = sessionStorage.getItem("username");
const model_title = ref("Hello " + username)
const search_content= ref("")
let users = ref([{
  id: "",
  username: ""
}])
let head_info = "Start charting..."

watch(search_content, async (newSearch:string, oldSearch:string) => {
  if(newSearch.length!=0){
    axios
    .post("/api/search", {
      search_content: newSearch
    })
    .then((res) => {
      //console.log(res.data)
      console.log(users.value)
      users.value = res.data.users
    })
    .catch((err) => {
      ElMessage.error(err.response.data)
    })
  }
})

const onModel = () => {
  drawer.value = true;
}
</script>

<template>
  <el-container class="base-container">
  <!--侧边栏-->
    <el-aside :span="4">
      <div>
        <el-row class="mb-4" style="height: 60px; padding-top: 10px;">
          <el-col :span="4" style="padding: 0">
            <el-button
              style="height: 40px"
              plain
              type="info"
              @click="onModel()"
            ><el-icon><Expand /></el-icon></el-button>
          </el-col>
          <el-col :span="20">
            <!-- <el-button type="danger" :icon="Delete" circle /> -->
            <el-input style="height: 40px" placeholder="Search..." v-model="search_content"></el-input>
          </el-col>
        </el-row>
        <div v-for="user in users">
          <el-row class="mb-4" style="height: 60px; padding-top: 10px;">
            {{ user.id }} | {{ user.username }}
          </el-row>
        </div>
      </div>
    </el-aside>
    <el-container :span="20">
        <el-header>
          <el-row class="mb-4" style="height: 60px; padding-top: 10px;">
            <el-col :span="10">
              <h1 style="height: 40px; padding-top: 10px;">{{ head_info }}</h1>
            </el-col>
            <el-col :span="1" :offset="13">
              <el-button style="height: 40px; padding-top: 10px;"><el-icon><MoreFilled /></el-icon></el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>
          <TextEditor />
        </el-footer>
    </el-container>
  </el-container>
  <el-drawer
    v-model="drawer"
    :title=model_title
    direction="ltr"
    close-on-press-escape
    show-close=false
    size="25%"
  >
    <ModelContent />
  </el-drawer>
</template>

<style scoped>
.base-container {
  position:absolute;
  top:0;
  left:0;
  width:100%
}
.el-header{
  background-color:white;
  height: 60px;
  border-style: solid;
  border-width: 0 0 1px 1px;
  border-color: rgba(97, 97, 97, 0.1);
}
.el-footer{
  background-color:white;
  height: 60px;
  border-style: solid;
  border-width: 1px 0 0 1px;
  border-color: rgba(97, 97, 97, 0.1);
}
.el-aside{
  padding-left: 10px;
  padding-right: 10px;
  background-color: white;
}
.el-main{
  border-style: solid;
  border-width: 1px;
  border-color: rgba(97, 97, 97, 0.1);
  background-image: url(@/assets/bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  height: calc(100vh - 130px);
}
</style>
