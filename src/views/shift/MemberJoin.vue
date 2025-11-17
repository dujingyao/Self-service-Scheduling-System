<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// 【【 V2.4 核心：导入 Axios 】】
import axios from 'axios'

const router = useRouter()
const inputCode = ref('')

// 【【 V2.4 核心：重写 handleJoin 】】
// 我们把它变成一个 "async" (异步) 函数
async function handleJoin() {
  const code = inputCode.value.trim()
  
  if (!code) {
    alert('请输入队长码！')
    return
  }

  // === (旧的“假装”逻辑已被删除) ===
  // if (code === 'ABCD12') { ... } 
  
  // === 【【 V2.4 真实 API 呼叫 】】 ===
  console.log(`--- 正在向后端 API 发起真实请求: /api/plan/verify/${code} ---`)
  
  try {
    // 1. 我们“尝试” (try) 呼叫这个 API
    //    (这对应我们“API对接文档”里的 3.1 节)
    //    (注意：我们没有后端，所以这行 100% 会失败)
    const response = await axios.get(`/api/plan/verify/${code}`)
    
    // --- (A) 如果呼叫“成功” (将来后端做好了) ---
    
    // 这就是我们 V2.2 里的“假”数据
    const fakePlanDetails = {
      totalSlots: 10,
      slotRequirements: { "0-3": 2, "0-4": 1, "2-7": 3, "2-8": 3, "4-1": 1, "4-2": 2 },
      memberConstraints: { min: 1, max: 3 },
      currentSignups: { "0-3": 1, "2-7": 3, "4-1": 0, "4-2": 1 }
    }
    
    // (将来我们会用 response.data 替换 fakePlanDetails)
    
    console.log('--- API 验证成功 (模拟) ---')
    router.push({
      name: 'MemberRegister',
      params: { captainCode: code },
      state: { planDetails: fakePlanDetails } 
    })

  } catch (error) {
    // --- (B) 如果呼叫“失败” (我们现在 100% 会进入这里) ---
    
    console.error('--- API 呼叫失败 ---', error)
    
    // 【【 这就是我们现在的“新假装”逻辑 】】
    // 为了让我们的应用还能继续“玩”，
    // 我们检查：如果失败是因为“404” 且 输入的是“ABCD12”...
    if (error.response && error.response.status === 404 && code === 'ABCD12') {
      // 那么我们就“假装”它成功了，并把 V2.2 的数据塞进去
      console.log('--- 捕获到 404，但输入码正确，启动“假装”模式 ---')
      
      const fakePlanDetails = {
        totalSlots: 10,
        slotRequirements: { "0-3": 2, "0-4": 1, "2-7": 3, "2-8": 3, "4-1": 1, "4-2": 2 },
        memberConstraints: { min: 1, max: 3 },
        currentSignups: { "0-3": 1, "2-7": 3, "4-1": 0, "4-2": 1 }
      }
      
      router.push({
        name: 'MemberRegister',
        params: { captainCode: code },
        state: { planDetails: fakePlanDetails } 
      })
      
    } else {
      // 如果是其他错误 (比如 500) 或 验证码不对
      alert('队长码无效，或服务器连接失败！')
      inputCode.value = ''
    }
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
          @keyup.enter="handleJoin" 
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