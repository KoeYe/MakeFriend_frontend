<template>
<div>
    Session here!
</div>
</template>
<script lang="ts" setup>
import axios from "axios";
import { ref, watch } from "vue"
import { useRoute } from "vue-router"
//console.log("hello session!")
let props = defineProps(["user2_id"])
console.log(props.user2_id)
</script>