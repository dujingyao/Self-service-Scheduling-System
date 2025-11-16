<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const existingCode = ref('')

function goToCreate() {
  router.push({ name: 'CaptainCreate' })
}

function goToDashboard() {
  const code = existingCode.value.trim()
  if (code === 'ABCD12') { // 假装验证
    router.push({
      name: 'CaptainDashboard',
      params: { captainCode: code }
    })
  } else {
    alert('队长码无效，请重新输入！')
    existingCode.value = ''
  }
}
</script>

<template>
  <div class="home-container">

    <el-card shadow="never" class="page-card">
      <h2>创建新计划</h2>
      <p class="description">
        如果你是第一次使用，或者要发起一次全新的排班。
      </p>
      <el-button 
        type="primary" 
        size="large" 
        class="card-button"
        @click="goToCreate"
      >
        立即创建
      </el-button>
    </el-card>
    
    <el-divider>
      <span class="divider-text">或</span>
    </el-divider>

    <el-card shadow="never" class="page-card">
      <h2>管理已有计划</h2>
      <p class="description">
        如果你之前创建过计划，请输入队长码返回仪表盘。
      </p>
      <div class="input-section">
        <el-input 
          v-model="existingCode" 
          placeholder="请输入你的队长码" 
          size="large"
        />
        <el-button 
          type="success" 
          size="large"
          @click="goToDashboard"
        >
          管理
        </el-button>
      </div>
    </el-card>
    
  </div> </template>

<style scoped>
/* 【【 V2.3 核心修改 】】 */

/* 1. 居中容器 */
.home-container {
  max-width: 700px;
  margin: 20px auto;
}

/* 2. 移除卡片的旧样式 (height, min-height) */
.page-card {
  /* (无特殊样式) */
}

/* 3. 【新增】分割线文字 */
.divider-text {
  font-size: 16px;
  color: #909399;
}

h2 {
  font-size: 18px;
}
.description {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  margin-top: 10px;
}
.card-button {
  margin-top: 20px;
  width: 100%;
}
.input-section {
  margin-top: 20px;
  display: flex;
}
.input-section .el-button {
  margin-left: 10px;
}
</style>