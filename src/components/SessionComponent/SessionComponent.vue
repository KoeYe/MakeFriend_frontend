<script lang="ts" setup>
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
import axios from "axios";
import Header from "./HeaderComponent.vue"
import TextEditor from "./TextEditor.vue"
import Main from "./MainComponent.vue"
let user1_id = ref()
let user2_id = ref()
let is_friend = ref()
const route = useRoute()

watch(
  () => route.params.session_id,
  async newId => {
  //console.log("session_id: " + newId)
  getSession(newId)
  //console.log("user1:",user1_id.value,"user2:",user2_id.value)
  }
)
const getSession = (session_id:any) => {
  axios
  .get("/api/session/session?session_id="+session_id+"&user_id="+sessionStorage.getItem("id"))
  .then((res)=>{
    user1_id.value = res.data.user1_id
    user2_id.value = res.data.user2_id
    //console.log(res.data)
    //console.log(user1_id.value, user2_id.value, session_id)
    checkFriends(user1_id.value)
  })
}

const checkFriends = (user1_id:any) => {
  // console.log("checkFriends", user1_id)
  axios
  .get("/api/user/make_friend?user1_id="+user1_id+"&user2_id="+sessionStorage.getItem("id"))
  .then((res)=>{
    is_friend.value = res.data
   //console.log(is_friend.value)
  })
}
getSession(route.params.session_id)
checkFriends(user1_id.value)
</script>
<template>
<a-layout>
  <a-layout-header>
    <Header :user1_id="user1_id" :session_id="route.params.session_id" :is_friend="is_friend" @checkFriend="checkFriends(user1_id)"/>
    <!-- {{user1_id.value}} -->
  </a-layout-header>
  <a-layout-content>
    <Main :session_id="route.params.session_id"/>
  </a-layout-content>
  <a-layout-footer>
    <TextEditor :user2_id="user2_id" :session_id="route.params.session_id"/>
  </a-layout-footer>
</a-layout>
</template>

<style scoped>
.arco-layout-header{
  background-color:white;
  height: 60px;
  border-style: solid;
  border-width: 0 0 1px 1px;
  border-color: rgba(97, 97, 97, 0.1);
}
.arco-layout-footer{
  background-color:white;
  height: 60px;
  border-style: solid;
  border-width: 1px 0 0 1px;
  border-color: rgba(97, 97, 97, 0.1);
}

.arco-layout-content{
  border-style: solid;
  border-width: 1px;
  border-color: rgba(97, 97, 97, 0.1);
  background-image: url(@/assets/bg.png);
  background-size: cover;
  background-repeat: no-repeat;
  height: calc(100vh - 120px);
  padding: 0px;
  overflow-y: hidden;
}

.arco-layout{
  overflow-y: hidden;
  height: 100vh;
}
</style>