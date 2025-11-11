<script setup>
// 1. 导入 ref，我们的“记忆”工具
import { ref } from 'vue'
import { useRouter } from 'vue-router' 

const router = useRouter() 
// --- 新增：定义我们的“假数据” ---
// 假装后端告诉我们，周一到周日
const days = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
// 假装后端告诉我们，总共有 10 节课
const totalSlots = ref(10) // 这就是我们“写死”的 10 节课

// --- 新增：一个“记忆”来存放所有被选中的格子 ---
// 我们用 Set 这种数据结构，它能自动处理重复
// 比如 'mon-1' (周一第1节)
const selectedSlots = ref(new Set())

// --- 新增：一个函数，用来“切换”一个格子的选中状态 ---
function toggleSlot(dayIndex, slotIndex) {
  // 创造一个唯一的 ID, 比如 '1-1' (周二第1节)
  const slotId = `${dayIndex}-${slotIndex}`

  if (selectedSlots.value.has(slotId)) {
    // 如果已经选中了，就取消选中
    selectedSlots.value.delete(slotId)
  } else {
    // 如果没选中，就添加选中
    selectedSlots.value.add(slotId)
  }
}

// --- 新增：一个辅助函数，检查某个格子是否被选中 ---
// :class 会用到这个
function isSelected(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  return selectedSlots.value.has(slotId)
}
// ------------------------------------

// "至少/至多" 的“记忆”，这个你已经写过了
const minShifts = ref(0)
const maxShifts = ref(1)

// --- 替换旧的 handleGenerate ---
function handleGenerate() {
  // 1. 准备好要发给后端的数据
  const dataToSend = {
    min: minShifts.value,
    max: maxShifts.value,
    // Set 结构需要转换成数组才能发给后端 (后端一般只认 JSON)
    slots: Array.from(selectedSlots.value)
  }

  console.log('--- 正在假装发送数据给后端 ---', dataToSend)

  // 2. === 假装调用 API，等待后端返回 ===
  // 我们用 setTimeout 来模拟“网络延迟” (比如 1 秒)
  alert('正在生成队长码... (模拟网络请求)')

  setTimeout(() => {
    // 3. === 假装后端成功返回了数据 ===
    const fakeCaptainCode = 'ABCD12' // 这是后端返回的“假”队长码
    console.log('--- 假装后端返回了队长码 ---', fakeCaptainCode)

    // 4. === 拿到队长码，跳转！===
    router.push({ 
      name: 'CaptainDashboard', // GPS 里的名字
      params: { captainCode: fakeCaptainCode } // 把码传过去
    })

  }, 1000) // 1000毫秒 = 1秒
}
// --- 替换结束 ---
</script>

<template>
  <div class="captain-create-container">
    <h1>队长：创建值班</h1>

    <el-form label-width="120px" class="form-section">
      <el-form-item label="每人至少值班">
        <el-input-number v-model="minShifts" :min="0" />
        <span> 次</span>
      </el-form-item>
      <el-form-item label="每人至多值班">
        <el-input-number v-model="maxShifts" :min="1" />
        <span> 次</span>
      </el-form-item>
    </el-form>

    <hr /> <h2>请选择值班时间段</h2>

    <div class="schedule-grid">
      <div class="header-cell"></div>
      <div v-for="day in days" :key="day" class="header-cell">
        {{ day }}
      </div>

      <template v-for="slotIndex in totalSlots" :key="slotIndex">
        <div class="header-cell">第 {{ slotIndex }} 节</div>

        <div 
          v-for="(day, dayIndex) in days" 
          :key="day"
          class="slot-cell"

          :class="{ 'selected': isSelected(dayIndex, slotIndex) }"

          @click="toggleSlot(dayIndex, slotIndex)"
        >
          </div>
      </template>
    </div>
    <hr />

    <el-button 
      type="primary" 
      size="large"
      @click="handleGenerate"
    >
      生成队长码
    </el-button>
  </div>
</template>

<style scoped>
.captain-create-container {
  max-width: 800px; 
  margin: 20px auto;
  padding: 20px;
}

.form-section {
  margin-top: 20px;
}

/* --- 新增：网格布局的 CSS --- */
.schedule-grid {
  display: grid;
  /* 我们有 8 列：
    第1列 0.5fr (显示“第几节”)
    后面 7 列 1fr (显示“周一”到“周日”)
  */
  grid-template-columns: 0.5fr repeat(7, 1fr);
  border: 1px solid #ccc;
  margin-top: 20px;
  margin-bottom: 20px;
  /* 让文字不能被选中，这样点击时手感更好 */
  user-select: none;
}

.header-cell {
  background-color: #f5f5f5;
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
  font-weight: bold;
}

.slot-cell {
  height: 40px; /* 给每个格子一个高度 */
  border: 1px solid #ddd;
  cursor: pointer; /* 鼠标放上去时变成“小手” */
  background-color: #fff;

  /* 这是一个“过渡”，让颜色变化更平滑 */
  transition: background-color 0.2s;
}

.slot-cell:hover {
  background-color: #f0f0f0; /* 鼠标悬停时变灰 */
}

/* 这就是 .selected 类的样式 
  当 :class 发现格子被选中，就会应用这个样式
*/
.slot-cell.selected {
  background-color: #409EFF; /* Element Plus 的主题蓝色 */
}
</style>