<script lang="ts" setup>
import { ref, watch, reactive } from "vue"
import TextEditor from "../components/TextEditor.vue";
import ModelContent from "../components/ModelComponent/ModelComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const drawer = ref(false);
const username = sessionStorage.getItem("username");
const model_title = ref("Hello " + username)
const search_content= ref("")

const router = useRouter()
let users = ref([{
  id: "",
  username: ""
}])
let head_info = ref("Start charting...")

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

const setSession = (id:String) => {
  //ElMessage.info("Setting session...")
  axios
    .post("/api/session/session", {
      user1_id: id,
      user2_id: sessionStorage.getItem("id"),
    })
    .then((res)=>{
      //console.log(res.data)
      head_info.value = res.data.user1_name;
      router.replace({name: "session", params: {session_id: res.data.session_id}})
    })
    .catch((err) => {});
}

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
        <el-row v-if="users.length>1">User:</el-row>
          <!-- <el-table :data="users" style="width: 100%">
            <el-table-column prop="username" style="width: 100%"/>
          </el-table> -->
          <div v-for="user of users">
            <el-card style="margin:10px" shadow="hover" @click="setSession(user.id)"> {{user.username}} </el-card>
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
