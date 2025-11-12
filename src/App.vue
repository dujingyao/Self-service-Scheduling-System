<script setup>
import { RouterView, useRouter } from 'vue-router'
// 导入 Element Plus 的“房子”图标
import { House } from '@element-plus/icons-vue'

const router = useRouter()

// 创建一个“返回主页”的函数
function goToHome() {
  router.push({ name: 'home' })
}
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <div class="header-content">
        <span class="app-title">智能排班助手</span>

        <el-button 
          type="primary" 
          :icon="House" 
          @click="goToHome"
          circle 
        />
      </div>
    </el-header>

    <el-main class="app-main">
      <RouterView />
    </el-main>
  </el-container>
</template>

<style scoped>
/* 整个 App 容器占满全屏 */
.app-container {
  height: 100vh;
}

/* 顶栏样式 */
.app-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  /* 使用 Flex 布局
    让标题在左边，按钮在右边
  */
  display: flex;
  align-items: center; /* 垂直居中 */
  padding: 0 40px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between; /* “两端对齐” */
  align-items: center;
}

.app-title {
  font-size: 20px;
  font-weight: 600;
}

/* 内容区样式
  我们给了一个浅灰色的背景
*/
.app-main {
  background-color: #f4f6f9;
  height: 100%;
}
</style>