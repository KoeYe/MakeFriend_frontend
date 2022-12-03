<script lang="ts" setup>
import { ref, watch } from "vue"
import axios from 'axios';
import { ElMessage } from "element-plus";
import { ElMessageBox } from 'element-plus'

const dialogVisible = ref(false)
const props = defineProps(["user1_id", "session_id", "is_friend"])
let user1_username = ref("")
const dropdown1 = ref()
watch(
    ()=>props.user1_id,
    async (NewId:string)=>{
        console.log(props.user1_id)
        getUser(NewId)
    }
)
const getUser = (id:string) => {
axios
  .get("/api/user/username?id="+id)
  .then((res)=>{
    //console.log(res.data)
    user1_username.value = res.data
  })
}
//console.log(user1_id.value)
function showClick() {
  dropdown1.value.handleOpen()
}

const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
}

const addFriend = (id:string) => {
    axios
      .post("/api/user/make_friend", {
        user1_id: id,
        user2_id: sessionStorage.getItem("id"),
        session_id: props.session_id
      })
      .then((res)=>{
        ElMessage.success(res.data)
      })
      .catch((err)=>{
        ElMessage.error(err.response.data)
      })
}

const deleteFriend = (id:string) => {
  dialogVisible.value = false
  axios
   .delete("/api/user/make_friend?user1_id="+id+"&user2_id="+sessionStorage.getItem("id"))
   .then((res)=>{
    ElMessage.success(res.data)
   })
   .catch((err)=>{
    ElMessage.error(err.response.data)
   });
}
</script>
<template>
<div>
    <el-row class="mb-4" style="height: 60px; padding-top: 10px;">
    <el-col :span="10">
        <h1 style="height: 40px; padding-top: 10px;">{{user1_username}}</h1>
    </el-col>
    <el-col :span="1" :offset="13">
        <div v-if="(props.is_friend==0)">
          <el-dropdown ref="dropdown1" trigger="contextmenu" style="margin-right: 30px">
              <span class="el-dropdown-link">
                  <el-button @click="showClick" style="height: 40px; padding-top: 10px;"><el-icon><MoreFilled /></el-icon></el-button> 
              </span>
              <template #dropdown>
              <el-dropdown-menu>
                  <el-dropdown-item @click="addFriend(props.user1_id)">+ friend</el-dropdown-item>
              </el-dropdown-menu>
              </template>
          </el-dropdown>
        </div>
        <div v-else-if="(props.is_friend==1)">
          <el-dropdown ref="dropdown1" trigger="contextmenu" style="margin-right: 30px">
            <span class="el-dropdown-link">
                <el-button @click="showClick" style="height: 40px; padding-top: 10px;"><el-icon><MoreFilled /></el-icon></el-button> 
            </span>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="dialogVisible = true">- friend</el-dropdown-item>
            </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dialog
            v-model="dialogVisible"
            title="Wait a moment..."
            width="30%"
            :before-close="handleClose"
          >
            <span>Are you sure to delete your friend {{user1_username}}</span>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="dialogVisible = false">Cancel</el-button>
                <el-button type="primary" @click="deleteFriend(props.user1_id)">
                  Confirm
                </el-button>
              </span>
            </template>
          </el-dialog>
        </div>
    </el-col>
    </el-row>
</div>
</template>
