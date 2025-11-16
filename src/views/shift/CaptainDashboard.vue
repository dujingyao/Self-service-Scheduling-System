<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const captainCode = route.params.captainCode
</script>

<template>
  <el-card shadow="never" class="page-card">
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
  </el-card>
</template>

<style scoped>
.page-card {
  max-width: 700px;
  margin: 20px auto;
}

.dashboard-container {
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
  color: #E6A23C;
  display: block;
  margin: 10px 0;
}
</style>