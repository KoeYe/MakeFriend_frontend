<script lang="ts" setup>
import { ref, watch, reactive, computed } from "vue"
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
  username: "",
  avatar: "",
  last_message: {
    content: "",
    date: "",
    user: "",
  },
}])
let select = ref(users.value[0].id)
watch(select, async (newSelect:string, oldSelect:string) => {

});
const setSession = (id:string) => {
  //ElMessage.info("Setting session...")
  //console.log(id)
  axios
    .post("/api/session/session", {
      user1_id: id,
      user2_id: sessionStorage.getItem("id"),
    })
    .then((res)=>{
      //console.log(res.data)
      router.replace({name: "session", params: {session_id: res.data.session_id}})
      select.value = id;
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
        <div v-if="(select!=user.id)">
          <el-card style="margin:10px;" shadow="hover" @click="setSession(user.id)">
            <el-row>
              <el-col :span="5">
                <el-avatar
                  :src="user.avatar"
                />
              </el-col>
              <el-col :span="12">
                <el-row><h3>{{user.username}}</h3></el-row>
                <div v-if="(user.last_message.user==id)">
                  <el-row><div style="color:dodgerblue">You:</div>{{user.last_message.content}}</el-row>
                </div>
                <div v-else-if="(user.last_message.user!=id)">
                  <el-row>{{user.last_message.content}}</el-row>
                </div>
              </el-col>
              <el-col :span="5">
                <el-row>{{user.last_message.date}}</el-row>
              </el-col>
            </el-row>
          </el-card>
        </div>
        <div v-else-if="(select==user.id)">
          <el-card style="margin:10px; background-color: dodgerblue;color:white;" shadow="hover" @click="setSession(user.id)">
            <el-row>
              <el-col :span="5">
                <el-avatar
                  :src="user.avatar"
                />
              </el-col>
              <el-col :span="12">
                <el-row><h3>{{user.username}}</h3></el-row>
                <div v-if="(user.last_message.user==id)">
                  <el-row><div>You:</div>{{user.last_message.content}}</el-row>
                </div>
                <div v-else-if="(user.last_message.user!=id)">
                  <el-row>{{user.last_message.content}}</el-row>
                </div>
              </el-col>
              <el-col :span="5">
                <el-row>{{user.last_message.date}}</el-row>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
    </div>
</div>
<el-drawer
    :with-header="false"
    v-model="drawer"
    direction="ltr"
    close-on-press-escape
    :show-close=false
    size="25%"
  >
    <ModelContent :title_="username" :id="id"/>
  </el-drawer>
</template>