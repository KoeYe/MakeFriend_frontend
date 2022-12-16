<script lang="ts" setup>
import { ref, watch, computed, onMounted } from "vue"
import axios from 'axios';
import { ElMessage } from "element-plus";
import { ElMessageBox } from 'element-plus'
import { controlledComputed } from "@vueuse/shared";
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
  Edit,
} from '@element-plus/icons-vue'
const emit = defineEmits(['get', 'checkFriend'])
const dialogVisible = ref(false)
const props = defineProps(["user1_id", "_id", "is_friend", "group_name", "members"])
const user2_id = localStorage.getItem("id")
const dropdown1 = ref()
const size = ref('large')
let group = ref({
  name: "",
})
const getGroup = () => {
  axios
  .get("/api/group/group?group_id="+props._id+"&user_id="+localStorage.getItem("id"))
  .then((res)=>{
    console.log(res.data)
    group.value = res.data.group_name
  })
}
</script>
<template>
<div>
    <a-row style="width:100%;height: 60px; padding: 10px;" justify="space-between">
    <a-col :span="2.5" style="margin-left:10px">
      <a-avatar-group :max-count="2">
        <a-avatar v-for="member in props.members">
          <img
            fit="cover"
            alt="avatar"
            :src="member.avatar"
          />
        </a-avatar>
      </a-avatar-group>
    </a-col>
    <a-col :span="0.5">
      <a-typography-title :heading="2" :style="{margin: '0 0 0 0'}">
        {{props.group_name}}
      </a-typography-title>
    </a-col>
    <a-col :span="1" style="margin-right:10px">
          <el-dropdown ref="dropdown1" trigger="contextmenu" style="margin-right:10px">
            <span class="el-dropdown-link">
                <el-button @click="" style="height: 40px; padding-top: 10px;"><el-icon><MoreFilled /></el-icon></el-button>
            </span>
            <template #dropdown>
            <el-dropdown-menu>
            </el-dropdown-menu>
            </template>
          </el-dropdown>
    </a-col>
    </a-row>
</div>
</template>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>

