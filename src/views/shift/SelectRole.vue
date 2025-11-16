<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goToCaptainCreate() {
  router.push({ name: 'CaptainCreate' })
}

function goToMemberJoin() {
  router.push({ name: 'MemberJoin' })
}
</script>

<template>
  <el-card shadow="never" class="page-card">
    <div class="role-select-container">
      <h1>请选择你的角色</h1>
  
      <div class="button-group">
        <el-button 
          type="primary" 
          size="large"
          @click="goToCaptainCreate"
        >
          我是队长
        </el-button>
        
        <el-button 
          type="success" 
          size="large"
          @click="goToMemberJoin"
        >
          我是队员
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

.role-select-container {
  text-align: center;
}

.button-group {
  margin-top: 20px;
}

.button-group .el-button {
  margin: 10px;
}
</style>