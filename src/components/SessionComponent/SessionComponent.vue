<template>
    Session here!
</template>
<script lang="ts" setup>
import axios from "axios";
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
//console.log("hello session!")
let session_id = ref()
let user1_id = ref()
let user2_id = ref()
const route = useRoute()

watch(
    () => route.params.session_id,
    async newId => {
    session_id.value = await getSession(newId)
    }
)

const getSession = (session_id:any) => {
    axios
    .get("/api/session/session?session_id="+session_id)
    .then((res)=>{
        user1_id.value = res.data.user1_id
        user2_id.value = res.data.user2_id
    })
}


</script>