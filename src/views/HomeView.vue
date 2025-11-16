<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goToShiftMode() {
  router.push({ name: 'SelectRole' })
}

function goToFreePlanMode() {
  // 告诉“导航仪”去我们新登记的页面
  router.push({ name: 'FreePlanHome' })
}
</script>

<template>
  <el-card shadow="never" class="page-card">
    <main class="home-container">
      <h1>欢迎使用！</h1>
      <p>请选择你要使用的模式：</p>
  
      <div class="button-group">
        <el-button 
          type="primary" 
          size="large"
          @click="goToShiftMode" 
        >
          多人值班模式
        </el-button>
  
        <el-button 
          type="success" 
          size="large"
          @click="goToFreePlanMode"
        >
          空闲规划模式
        </el-button>
      </div>
    </main>
  </el-card>
</template>

<style scoped>
/* 卡片居中 */
.page-card {
  max-width: 600px;
  margin: 20px auto;
}

.home-container {
  text-align: center; /* 文字居中 */
}

.button-group {
  margin-top: 20px;
}

.button-group .el-button {
  margin: 10px;
}
</style>