<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const inputCode = ref('')

function handleJoin() {
  const code = inputCode.value.trim()
  
  if (code === 'ABCD12') { // 假装验证
    router.push({
      name: 'MemberRegister',
      params: { captainCode: code }
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