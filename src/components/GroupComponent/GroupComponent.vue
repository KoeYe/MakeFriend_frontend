<script lang="ts" setup>
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import axios from "axios";
import Header from "./GroupHeaderComponent.vue"
import TextEditor from "./GroupTextEditor.vue"
import Main from "./GroupMainComponent.vue"
let user2_id = ref()
let members = ref()
let name = ref()
const route = useRoute()

watch(
  () => route.params.group_id,
  async newId => {
  //console.log("_id: " + newId)
  getGroup(newId)
  console.log("user2:",user2_id.value)
  }
)

const getGroup = (group_id:any) => {
  axios
  .get("/api/group/group?group_id="+group_id)
  .then((res)=>{
    console.log(res.data)
    user2_id.value = res.data.user2_id
    members.value = res.data.members
    name.value = res.data.name
  })
}

onMounted(()=>{
  getGroup(route.params.group_id)
})


</script>
<template>
<a-layout>
  <a-layout-header>
    <Header :group_id="route.params.group_id" :group_name="name" :members="members"/>
  </a-layout-header>
  <a-layout-content>
    <Main :group_id="route.params.group_id" />
  </a-layout-content>
  <a-layout-footer>
    <TextEditor :user2_id="user2_id" :group_id="route.params.group_id"/>
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