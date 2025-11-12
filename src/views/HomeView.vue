<script setup>
// 1. 导入 useRouter 工具
import { useRouter } from 'vue-router'

// 2. 得到 router 实例，你可以把它想象成“GPS导航仪”
const router = useRouter()

// 3. 创建一个函数（一个指令）
function goToShiftMode() {
  // 4. 告诉“导航仪”：我们要去 'SelectRole' 这个名字的页面
  //    (这个 'SelectRole' 就是我们在 index.js 里登记的 name)
  router.push({ name: 'SelectRole' })
}

function goToFreePlanMode() {
  // 暂时先弹个窗，因为我们还没做这个页面
  alert('空闲规划模式 待开发...')
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

/* HomeView.vue 的 */
<style scoped>
/* 【新增】卡片居中 */
.page-card {
  max-width: 600px;
  margin: 20px auto; /* 顶部 20px，左右自动 (居中) */
}

/* 【修改】
  我们删掉了 .home-container 上的 margin-top
*/
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