<script lang="ts" setup>
import { ref, watch, reactive, computed, onMounted, getCurrentInstance } from "vue"
import ModelContent from "../ModelComponent/ModelComponent.vue"
import axios from "axios";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { Notification } from '@arco-design/web-vue';
import { WindPower } from "@element-plus/icons-vue";
const { proxy } = getCurrentInstance() as any
let address = ref([])
let address_number = ref([])
let online_num = ref()
let cardWidth = ref("")
const cardstyle = ref({})
let user_num = ref(0)
onMounted(() => {
    cardWidth.value = proxy.$el.clientWidth
    window.onresize = () => {
        cardWidth.value = proxy.$el.clientWidth
    }
    cardstyle.value = {
        background: "linear-gradient(90deg, #FFC107 0%, #FF9800 100%)",
        position: "absolute",
        top: 0,
        left: 0,
    }
    axios
    .get("/api/admin/statistics")
    .then((res)=>{
        console.log(res.data)
        address.value = res.data.address
        address_number.value = res.data.address_number
        user_num.value = res.data.user_num
        online_num.value = res.data.online_num
        let address_data  = []
        for(let i=0;i<address.value.length;i++){
            address_data.push({value: address_number.value[i], name: address.value[i]})
        }
        const option = {
        title: {
            text: 'User Distribution',
            left: 'center'
        },
        legend: {
            orient: 'vertical',
            y: 'bottom',
            data: address.value
        },
        series: [
            {
            type: 'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: false,
                position: 'center'
            },
            labelLine: {
                show: false
            },
            emphasis: {
                label: {
                show: true,
                fontSize: '30',
                fontWeight: 'bold'
                }
            },
            data: address_data,
            }
        ]
        };
        const chart = proxy.$echarts.init(document.getElementById('main'));
        chart.setOption(option);
        window.onresize = () => {
            chart.resize();
        };
    })
});
</script>
<template>
    <a-row>
    <a-statistic style="margin-left: 300px;" title="User Growth Rate" :value="50.52" :precision="2" :value-from="0" animation>
    <template #prefix>
      <icon-arrow-rise />
    </template>
    <template #suffix>%</template>
  </a-statistic>
  <a-statistic style="margin-left: 30px;" title="Total User Number" :value="user_num" :precision="0" :value-from="0" animation>
    <template #prefix>
      <icon-arrow-rise />
    </template>
  </a-statistic>
  <a-statistic style="margin-left: 30px;" title="Online User Number" :value="online_num" :precision="0" :value-from="0" animation>
    <template #prefix>
      <icon-arrow-rise />
    </template>
  </a-statistic>
    </a-row>
    <div id="main" style="height:500px;width:500px;margin-left: 300px;"></div>
</template>