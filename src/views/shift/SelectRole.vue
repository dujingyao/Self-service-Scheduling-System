<script setup>
// 1. 导入“导航仪”
import { useRouter } from 'vue-router'
const router = useRouter()

// 2. 创建“去队长页”的指令
function goToCaptainCreate() {
  router.push({ name: 'CaptainCreate' })
}

// 3. 创建“去队员页”的指令
function goToMemberJoin() {
  router.push({ name: 'MemberJoin' })
}
</script>

<template>
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
</template>

<style scoped>
.role-select-container {
  text-align: center;
  margin-top: 60px;
}

.button-group {
  margin-top: 20px;
}

.button-group .el-button {
  margin: 10px;
}
</style>