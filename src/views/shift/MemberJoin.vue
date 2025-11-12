<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 1. 用 ref "记忆"队员输入的队长码
const inputCode = ref('')

// 2. “加入”按钮的逻辑
function handleJoin() {
  // 移除用户输入时可能带的空格
  const code = inputCode.value.trim() 

  // 3. === 假装在验证队长码 ===
  // 我们暂时“写死”，只有 ABCD12 是有效的
  // (将来这里会改成调用后端 API 验证)
  if (code === 'ABCD12') {
    // 验证成功！跳转到注册页
    router.push({
      name: 'MemberRegister',
      params: { captainCode: code } // 把有效的码传过去
    })
  } else {
    // 验证失败
    alert('队长码无效，请重新输入！')
    inputCode.value = '' // 清空输入框
  }
}
</script>

<template>
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
</template>

<style scoped>
.join-container {
  max-width: 500px;
  margin: 40px auto;
  text-align: center;
}
.input-section {
  margin-top: 20px;
  /* display: flex 是一个 CSS 技巧
    它能让“输入框”和“按钮”漂亮地排在一行
  */
  display: flex;
}

/* 让按钮和输入框之间有一点空隙 
*/
.input-section .el-button {
  margin-left: 10px;
}
</style>