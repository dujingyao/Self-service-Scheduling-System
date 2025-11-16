<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const inputCode = ref('')

function handleJoin() {
  const code = inputCode.value.trim()
  
  // === 【【 V2.2 核心修改 】】 ===
  // 假装在验证队长码 'ABCD12'
  if (code === 'ABCD12') {
    
    // === 【 假装的“获取排班详情” API 响应 】 ===
    // 这对应队长在 V2.2 提交的 dataToSend
    const fakePlanDetails = {
      // 1. 模板信息
      totalSlots: 10, // 队长上传模板识别出的总节数

      // 2. 时段约束 (Rule A)
      slotRequirements: { 
        "0-3": 2,  // 周一第3节 (需2人)
        "0-4": 1,  // 周一第4节 (需1人)
        "2-7": 3,  // 周三第7节 (需3人)
        "2-8": 3,
        "4-1": 1,  // 周五第1节 (需1人)
        "4-2": 2   // 周五第2节 (需2人)
      },
      
      // 3. 队员约束 (Rule B)
      memberConstraints: {
        min: 1, // 队员最少选 1 次
        max: 3  // 队员最多选 3 次
      },
      
      // 4. 【新增】当前已报名的人数 (用于计算“剩余”)
      currentSignups: {
        "0-3": 1,  // 周一第3节 (已有1人)
        "2-7": 3,  // 周三第7节 (已满)
        "4-1": 0,  // 周五第1节 (暂无人)
        "4-2": 1   // 周五第2节 (已有1人)
      }
    }
    // === 假装 API 响应结束 ===
    

    // 【核心】使用 router.push 的 `state` 属性
    // 这是一个“隐藏”的包裹，可以把复杂的数据
    // 安全地传递到下一个页面 (MemberRegister)
    router.push({
      name: 'MemberRegister',
      params: { captainCode: code },
      // 把我们“假装”获取到的排班详情，放进 state
      state: { 
        planDetails: fakePlanDetails 
      }
    })
    
  } else {
    alert('队长码无效，请重新输入！')
    inputCode.value = ''
  }
}
</script>

<template>
  <el-card shadow="never" class="page-card">
    <div class="join-container">
      <h1>队员：加入值班</h1>
      
      <div class="input-section">
        <el-input 
          v-model="inputCode" 
          placeholder="请输入队长码"
          size="large"
        />
        
        <el-button 
          type="primary" 
          size="large"
          @click="handleJoin"
        >
          加入
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
/* (样式无变化) */
.page-card {
  max-width: 600px;
  margin: 20px auto;
}
.join-container {
  text-align: center;
}
.input-section {
  margin-top: 20px;
  display: flex;
}
.input-section .el-button {
  margin-left: 10px;
}
</style>