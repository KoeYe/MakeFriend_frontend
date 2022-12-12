<script lang="ts" setup>
import { ref, watch, reactive, computed } from "vue"
import ModelContent from "../ModelComponent/ModelComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { Notification } from '@arco-design/web-vue';
const drawer = ref(false);
const username = localStorage.getItem("username");
const id = localStorage.getItem("id");
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
    users.value = []
  }
})
const check_all_users = () => {
    router.replace({name: "all_users"})
}
const check_statistics = () => {
    router.replace({name: "statistics"})
}
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
let select = ref('0')
users.value = []
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
              <a-card style="margin:10px" hoverable @click="">
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
            <a-card style="margin:10px;background-color: dodgerblue;" hoverable @click="">
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
    <div v-else>
        <a-card style="margin:10px" hoverable @click="check_all_users">
            <a-typography-title>All users</a-typography-title>
        </a-card>
        <a-card style="margin:10px" hoverable @click="check_statistics">
            <a-typography-title>Statistics</a-typography-title>
        </a-card>
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
    <ModelContent :title_="username" :id="0"/>
  </el-drawer>
</template>

<style scoped>
.arco-card{
  transition-property: all;
  height: 100px;
  border-radius: 5px;
}
</style>