<script lang="ts" setup>
import axios from "axios"
import {ElMessage} from "element-plus"
import {useRouter} from "vue-router"
import { ref,computed,reactive } from "vue"
import IconEdit from '@arco-design/web-vue/es/icon/icon-edit';
import IconPlus from '@arco-design/web-vue/es/icon/icon-plus';
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
  Edit,
} from '@element-plus/icons-vue'
const dialogVisible = ref(false)
const dialogImageUrl = ref('')
const file = ref();
const formLabelWidth = '140px'


const onChange = (_: any, currentFile: any) => {
  file.value = {
    ...currentFile,
    // url: URL.createObjectURL(currentFile.file),
  };
};

const onProgress = (currentFile: any) => {
  file.value = currentFile;
};

const size = ref('large')
const iconStyle = computed(() => {
  const marginMap:any = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  }
})

const editInformation = () => {
  dialogFormVisible.value = true;
}

const router = useRouter();
const centerDialogVisible = ref(false)
const logout = () => {
  //ElMessage.info("Log out...")
  if(props.id == '0'){
    localStorage.removeItem("username")
    localStorage.removeItem("id")
    localStorage.removeItem("token")
    ElMessage.success("Log out successfully!")
    router.replace("/")
  } else {
    axios
    .post("/api/user/logout", {
      withCredentials : true
    }).then(()=>{
      localStorage.removeItem("username")
      localStorage.removeItem("id")
      localStorage.removeItem("token")
      ElMessage.success("Log out successfully!")
      router.replace("/")
    }).catch(() => {
      ElMessage.error("Log out failed!")
    })
  }
}
const dialogFormVisible = ref(false)
const props = defineProps(["title_", "id"])
const avatar_url = "/api/user/avatar?id="+props.id

let user_ = ref({
  username: "",
  address: "",
  place: "",
  tel: "",
  remarks: 0,
})

const getProfile = () => {
  axios
    .get("/api/user/profile?id="+props.id)
    .then((res)=>{
      user_.value = res.data
      console.log(user_.value)
    })
}
getProfile()

const form = reactive({
  username: user_.value.username,
  tel: user_.value.tel,
  address: user_.value.address,
  place: user_.value.place,
  remarks: user_.value.remarks,
})

const submit = () => {
  axios
  .post("/api/user/profile", {
    'id': props.id,
    'username': form.username ? form.username : user_.value.username,
    'tel': form.tel ? form.tel : user_.value.tel,
    'address': form.address ? form.address : user_.value.address,
    'place': form.place ? form.place : user_.value.place,
    'remarks': form.remarks>=0 ? form.remarks : user_.value.remarks,
  })
  .then((res) => {
    ElMessage.success("Edit profile successfully!")
    dialogFormVisible.value = false;
    getProfile()
  })
  .catch((err)=>{
    ElMessage.error(err.response.data)
  })
}

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
      <el-col :span="10">
        <h2 style="lie-height: 46.5px;vertical-align: middle;position:relative;top:3.5px">{{props.title_}}</h2>
      </el-col>
      <el-col :span="1">
        <el-icon style="height: 46.5px;cursor:pointer" @click="editInformation">
          <edit />
        </el-icon>
      </el-col>
    </el-row>
    <el-row>
      <el-descriptions
        class="margin-top"
        title="Information"
        :column="1"
        :size="size"
        style="width:100%"
        border
      >
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            Username
          </div>
        </template>
        {{user_.username}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <iphone />
            </el-icon>
            Telephone
          </div>
        </template>
        {{user_.tel}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <location />
            </el-icon>
            Place
          </div>
        </template>
        {{user_.place}}
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <tickets />
            </el-icon>
            Remarks
          </div>
        </template>
        <div v-if="(user_.remarks===0)">
          <el-tag size="small">School</el-tag>
        </div>
        <div v-else-if="(user_.remarks===1)">
          <el-tag size="small">Office</el-tag>
        </div>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            Address
          </div>
        </template>
        {{user_.address}}
      </el-descriptions-item>
      </el-descriptions>
    </el-row>
    <el-divider />
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

  <el-dialog v-model="dialogFormVisible" title="Edit Profile">
    <el-form :model="form">
    <el-descriptions
        class="margin-top"
        :column="1"
        :size="size"
        border
        style="position:relative;top:-30px"
      >
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <user />
            </el-icon>
            Username
          </div>
        </template>
        <el-input maxlength="10" show-word-limit v-model="form.username" autocomplete="off" :placeholder="user_.username"/>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <iphone />
            </el-icon>
            Telephone
          </div>
        </template>
        <el-input maxlength="20" show-word-limit v-model="form.tel" autocomplete="off" :placeholder="user_.tel"/>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <location />
            </el-icon>
            Place
          </div>
        </template>
        <el-input maxlength="10" show-word-limit v-model="form.place" autocomplete="off" :placeholder="user_.place"/>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <tickets />
            </el-icon>
            Remarks
          </div>
        </template>
        <el-select v-model="form.remarks" autocomplete="off" :placeholder="user_.remarks">
          <el-option label="school" :value=0><el-tag size="small">School</el-tag></el-option>
          <el-option label="office" :value=1><el-tag size="small">Office</el-tag></el-option>
        </el-select>
      </el-descriptions-item>
      <el-descriptions-item>
        <template #label>
          <div class="cell-item">
            <el-icon :style="iconStyle">
              <office-building />
            </el-icon>
            Address
          </div>
        </template>
          <el-input maxlength="100" show-word-limit v-model="form.address" autocomplete="off" :placeholder="user_.address" />
      </el-descriptions-item>
      </el-descriptions>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="submit">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
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
