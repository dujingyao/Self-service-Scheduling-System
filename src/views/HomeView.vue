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
</template>

<style scoped>
/* 这是我们的 CSS (外观) */
.home-container {
  text-align: center; /* 文字居中 */
  margin-top: 60px; /* 距离顶部一点距离 */
}

.button-group {
  margin-top: 20px; /* 按钮组距离上面文字一点距离 */
}

/* 让按钮之间有一点空隙 */
.button-group .el-button {
  margin: 10px;
}
</style>