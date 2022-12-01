<script lang="ts" setup>
import TextEditor from "../components/TextEditor.vue";
import {
  Check,
  Delete,
} from '@element-plus/icons-vue'
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
            ><el-icon><Expand /></el-icon></el-button>
          </el-col>
          <el-col :span="20">
            <!-- <el-button type="danger" :icon="Delete" circle /> -->
            <el-input style="height: 40px" placeholder="Search..."></el-input>
          </el-col>
        </el-row>
      </div>
    </el-aside>
    <el-container :span="20">
        <el-header>
          <el-row class="mb-4" style="height: 60px; padding-top: 10px;">
            <el-col :span="4">
              <h1>Hello</h1>
              <h5>start chart..</h5>
            </el-col>
            <el-col :span="1" :offset="19">
              <el-button style="height: 40px; padding-top: 10px;"><el-icon><MoreFilled /></el-icon></el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>
          <TextEditor></TextEditor>
        </el-footer>
    </el-container>
  </el-container>
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
