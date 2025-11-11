<script setup>
// 我们需要这个来读取 URL 里的“队长码”
import { useRoute } from 'vue-router'

const route = useRoute()

// route.params.captainCode 会自动拿到 URL 里的那个码
const captainCode = route.params.captainCode
</script>

<template>
  <div class="dashboard-container">
    <h1>队长仪表盘</h1>
    <p>你的值班计划已创建！</p>

    <div class="code-display">
      <p>你的队长码是：</p>
      <strong>{{ captainCode }}</strong>
      <p>（请把这个码发给你的队员）</p>
    </div>

    <hr>

    <h2>已有 0 人已选班</h2>
    <p>（这里将来会显示一个队员名单）</p>
  </div>
</template>

<style scoped>
.dashboard-container {
  max-width: 600px;
  margin: 20px auto;
  text-align: center;
}
.code-display {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
  font-size: 1.2em;
}
.code-display strong {
  font-size: 2em;
  color: #E6A23C; /* Element Plus 的警告色 (橙色) */
  display: block;
  margin: 10px 0;
}
</style>