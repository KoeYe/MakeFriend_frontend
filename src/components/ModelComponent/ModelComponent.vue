<script lang="ts" setup>
import axios from "axios"
import {ElMessage} from "element-plus"
import {useRouter} from "vue-router"
import { ref } from "vue"
import IconEdit from '@arco-design/web-vue/es/icon/icon-edit';
import IconPlus from '@arco-design/web-vue/es/icon/icon-plus';
const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const file = ref();

const onChange = (_: any, currentFile: any) => {
  file.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
};

const onProgress = (currentFile: any) => {
  file.value = currentFile;
};

const router = useRouter();
const centerDialogVisible = ref(false)
const logout = () => {
  //ElMessage.info("Log out...")
  axios
    .post("/api/user/logout", {
      withCredentials : true
    }).then(()=>{
      ElMessage.success("Log out successfully!")
      router.replace("/")
    }).catch(() => {
      ElMessage.error("Log out failed!")
    })
}
const props = defineProps(["title_", "id"])
const avatar_url = "/api/user/avatar?id="+props.id
</script>

<template>
  <div>
    <el-row>
      <el-col :span="4">
        <!-- <el-avatar @click="(centerDialogVisible=true)" style="cursor: pointer"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        /> -->
        <el-avatar @click="(centerDialogVisible=true)" style="cursor: pointer"
          :src="avatar_url"
        />
      </el-col>
      <el-col :span="15">
        <h2 style="line-height: 46.5px;">{{props.title_}}</h2>
      </el-col>
    </el-row>
    <el-row class="mb-4">
      <el-button @click="logout()" type="danger"><el-icon><SwitchButton /></el-icon>logout</el-button>
    </el-row>
  </div>
  <el-dialog
    v-model="centerDialogVisible"
    title="Upload avatar"
    width="30%"
    align-center
  >
      <div class="el-upload__tip">
        jpg/png files with a size less than 2MB
      </div>
      <a-upload
        action="/api/user/avatar"
        :fileList="file ? [file] : []"
        :show-file-list="false"
        @change="onChange"
        @progress="onProgress"
      >
      <template #upload-button>
        <div
          :class="`arco-upload-list-item${
            file && file.status === 'error' ? ' arco-upload-list-item-error' : ''
          }`"
        >
          <div
            class="arco-upload-list-picture custom-upload-avatar"
            v-if="file && file.url"
          >
            <img :src="file.url" />
            <div class="arco-upload-list-picture-mask">
              <IconEdit />
            </div>
            <a-progress
              v-if="file.status === 'uploading' && file.percent < 100"
              :percent="file.percent"
              type="circle"
              size="mini"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
            />
          </div>
          <div class="arco-upload-picture-card" v-else>
            <div class="arco-upload-picture-card-text">
              <IconPlus />
              <div style="margin-top: 10px; font-weight: 600">Upload</div>
            </div>
          </div>
        </div>
      </template>
    </a-upload>
  <el-dialog v-model="dialogVisible">
    <img style="width:100%" :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="centerDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="(centerDialogVisible = false)">
          Confirm
        </el-button>

      </span>
    </template>
  </el-dialog>
</template>
