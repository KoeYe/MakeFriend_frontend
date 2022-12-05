<script lang="ts" setup>
import { ref, watch, reactive } from "vue"
import ModelContent from "../ModelComponent/ModelComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const drawer = ref(false);
const username = sessionStorage.getItem("username");
const id = sessionStorage.getItem("id");
const model_title = ref("Hello " + username)
const search_content= ref("")
const router = useRouter()
//const emit = defineEmits(['changeSession'])
const title = ref("Friends:")
watch(search_content, async (newSearch:string, oldSearch:string) => {
  if(newSearch.length!=0){
    axios
    .post("/api/search", {
      search_content: newSearch
    })
    .then((res) => {
      console.log(res.data)
      //console.log(users.value)
      users.value = res.data.users
      title.value = "User:"
    })
    .catch((err) => {
      ElMessage.error(err.response.data)
    })
  } else {
    loadFriends(id)
  }
})


const loadFriends = (id: string | null) => {
  axios
    .get("/api/user/friends?user2_id="+id)
    .then((res)=>{
      console.log(res.data)
      users.value = res.data.friends
      title.value = "Friends:"
    })
}
loadFriends(id)

let users = ref([{
  id: "",
  username: ""
}])

const setSession = (id:String) => {
  //ElMessage.info("Setting session...")
  axios
    .post("/api/session/session", {
      user1_id: id,
      user2_id: sessionStorage.getItem("id"),
    })
    .then((res)=>{
      //console.log(res.data)
      router.replace({name: "session", params: {session_id: res.data.session_id}})
    })
    .catch((err) => {});
}

const onModel = () => {
  drawer.value = true;
}
</script>
<template>
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
<div v-if="users">
    <div v-if="users.length>=1">
      <el-row>{{title}}</el-row>
      <!-- <el-table :data="users" style="width: 100%">
          <el-table-column prop="username" style="width: 100%"/>
      </el-table> -->
      <div v-for="user of users">
          <el-card style="margin:10px" shadow="hover" @click="setSession(user.id)"> {{user.username}} </el-card>
      </div>
    </div>
</div>
    <el-drawer
    v-model="drawer"
    :title=model_title
    direction="ltr"
    close-on-press-escape
    :show-close=false
    size="25%"
  >
    <ModelContent />
  </el-drawer>
</template>