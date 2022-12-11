<script lang="ts" setup>
import { ref, watch, reactive, computed } from "vue"
import ModelContent from "../ModelComponent/ModelComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { Notification } from '@arco-design/web-vue';
const drawer = ref(false);
const username = sessionStorage.getItem("username");
const id = sessionStorage.getItem("id");
const model_title = ref("Hello " + username)
const search_content= ref("")
const router = useRouter()
//const emit = defineEmits(['changeSession'])
const title = ref("Friends:")
let searching = ref(false)
watch(search_content, async (newSearch:string, oldSearch:string) => {
  if(newSearch.length!=0){
    searching.value = true
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
    searching.value=false
    loadFriends(id)
  }
})
let hasNotification = ref(false)
let number = ref(0)
const loadFriends = (id: string | null) => {
  if(!searching.value){
    axios
    .get("/api/user/friends?user2_id="+id)
    .then((res)=>{
      console.log(res.data)
      users.value = res.data.friends
      let count = 0
      for (let user of users.value){
        count += user.message_number
        if(count!=number.value){
          number.value = count
        }
        if(isNaN(user.message_number)){
          user.message_number = 0
        }
      }
    })
    setTimeout(()=>{
    loadFriends(id);
  }, 1000)
  }
}

watch(
  number, (newNumber, oldNumber) => {
    if(newNumber>0){
      hasNotification.value = true
      Notification.info(
        {
          title: 'You have '+newNumber+' new messages',
          content: 'Please check your messages',
          duration: 3000,
          onClose: () => {
            hasNotification.value = false
          },
        },
      )
    } else {
      hasNotification.value = false
    }
  }
)
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
  message_number: 0,
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
<a-row class="mb-4" style="height: 60px; padding-top: 10px;">
    <a-col :span="4" style="padding: 0">
    <el-button
        style="height: 40px"
        plain
        type="info"
        @click="onModel()"
    ><el-icon><Expand /></el-icon></el-button>
    </a-col>
    <a-col flex="auto">
    <!-- <el-button type="danger" :icon="Delete" circle /> -->
      <el-input style="height: 40px" placeholder="Search..." v-model="search_content"></el-input>
    </a-col>
</a-row>
<div v-if="users">
    <div v-if="users.length>=1">
      <div v-for="user of users">
          <div v-if="(select!=user.id)">
              <a-card style="margin:10px" hoverable @click="setSession(user.id)">
                <a-badge style="width:95%" :offset="[35,-15]" :count="user.message_number" :max-count="99">
                <a-row>
                  <a-col :span="5">
                    <el-avatar
                      :src="user.avatar"
                      style="height: 50px; width: 50px; margin-left: -5px;"
                    />
                  </a-col>
                  <a-col :span="12">
                    <a-typography-title :heading="3" :style="{marginTop: '0px',}">{{user.username}}</a-typography-title>
                    <div v-if="(user.last_message.user==id)">
                      <a-row style="position:relative;top:-10px">
                        <a-col style="color:dodgerblue" :span="7"><a-typography-paragraph style="color:dodgerblue;font-size:large;">You:</a-typography-paragraph></a-col>
                        <a-col :span="17">
                          <n-ellipsis style="max-width: 50%">
                            <a-typography-paragraph style="font-size:large;">{{user.last_message.content}}</a-typography-paragraph>
                          </n-ellipsis>
                        </a-col>
                      </a-row>
                    </div>
                    <div v-else-if="(user.last_message.user!=id)">
                      <n-ellipsis style="max-width: 50%">
                        <a-typography-paragraph>{{user.last_message.content}}</a-typography-paragraph>
                      </n-ellipsis>
                    </div>
                  </a-col>
                  <a-col :span="4" :offset="3">
                    <a-row><a-typography-paragraph>{{user.last_message.date}}</a-typography-paragraph></a-row>
                  </a-col>
                </a-row>
              </a-badge>
              </a-card>
          </div>
          <div v-else-if="(select==user.id)">
            <a-card style="margin:10px;background-color: dodgerblue;" hoverable @click="setSession(user.id)">
              <a-badge style="width:95%" :offset="[35,-15]" :count="user.message_number" :max-count="99">
              <a-row style="color:white">
                <a-col :span="5">
                  <el-avatar
                    :src="user.avatar"
                    style="height: 50px; width: 50px; margin-left: -5px;"
                  />
                </a-col>
                <a-col :span="12">
                  <a-row><a-typography-title :heading="3" :style="{ marginTop: '0px', color:'white'}">{{user.username}}</a-typography-title></a-row>
                  <div v-if="(user.last_message.user==id)">
                    <a-row style="position:relative;top:-10px;">
                        <a-col style="color:dodgerblue" :span="7"><a-typography-paragraph style="color:white;font-size:large;">You:</a-typography-paragraph></a-col>
                        <a-col :span="17">
                          <n-ellipsis style="max-width: 50%">
                            <a-typography-paragraph style="color:white;font-size:large;">{{user.last_message.content}}</a-typography-paragraph>
                          </n-ellipsis>
                        </a-col>
                      </a-row>
                  </div>
                  <div v-else-if="(user.last_message.user!=id)">
                    <n-ellipsis style="max-width: 50%">
                      <a-typography-paragraph style="color:white">{{user.last_message.content}}</a-typography-paragraph>
                    </n-ellipsis>
                  </div>
                </a-col>
                <a-col :span="4" :offset="3">
                  <a-row><a-typography-paragraph style="color:white">{{user.last_message.date}}</a-typography-paragraph></a-row>
                </a-col>
              </a-row>
            </a-badge>
            </a-card>
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

<style scoped>
.arco-card{
  transition-property: all;
  height: 100px;
  border-radius: 5px;
}
</style>