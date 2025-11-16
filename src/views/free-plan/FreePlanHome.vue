<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'

// --- “记忆” ---
const fileList = ref([]) // 1. 记住用户上传了哪些文件
const isCalculating = ref(false) // 2. 记住是否在计算中
const heatmapData = ref(null) // 3. 记住“热力图”结果
const totalFiles = ref(0) // 4. 记住总共上传了几张图

// --- 网格“假数据” (和以前一样) ---
const days = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
const totalSlots = ref(10)

/**
 * 【核心】处理计算
 */
function handleCalculate() {
  if (fileList.value.length === 0) {
    alert('请至少上传一张课表！')
    return
  }
  
  isCalculating.value = true
  heatmapData.value = null // 清空上次结果
  totalFiles.value = fileList.value.length // 记住总人数
  console.log(`--- 假装开始处理 ${totalFiles.value} 张课表 ---`)

  // === 假装调用 API (2秒) ===
  setTimeout(() => {
    // --- “假装”的后端热力图数据 ---
    // 格式：{ "格子ID": 有课的人数 }
    // 我们基于总人数，随机生成一些数据
    const fakeHeatmap = {}
    
    // 循环所有格子 (7天 x 10节)
    for (let d = 0; d < 7; d++) {
      for (let s = 1; s <= 10; s++) {
        const slotId = `${d}-${s}`
        // 随机生成一个 0 到 totalFiles 之间的“有课人数”
        const busyCount = Math.floor(Math.random() * (totalFiles.value + 1))
        fakeHeatmap[slotId] = busyCount
      }
    }
    
    // 特别指定几个“所有人都有空”(0) 的格子
    fakeHeatmap['0-5'] = 0 // 周一第5节
    fakeHeatmap['2-7'] = 0 // 周三第7节
    // 特别指定几个“所有人都有课”(totalFiles) 的格子
    fakeHeatmap['1-1'] = totalFiles.value // 周二第1节
    
    // --- 假装计算完毕 ---
    heatmapData.value = fakeHeatmap
    isCalculating.value = false
    console.log('--- “热力图”数据已生成 ---', heatmapData.value)

  }, 2000) // 模拟 2 秒
}

/**
 * 【核心】获取格子的 CSS 样式类
 */
function getSlotClass(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  
  // 如果还没计算，不给样式
  if (!heatmapData.value) return ''

  // 从热力图里读取“有课人数”
  const busyCount = heatmapData.value[slotId] || 0
  
  if (busyCount === 0) {
    return 'busy-0' // 样式：所有人都有空 (绿色)
  }
  if (busyCount === 1) {
    return 'busy-1' // 样式：1 个人有课 (黄色)
  }
  if (busyCount === 2) {
    return 'busy-2' // 样式：2 个人有课 (橙色)
  }
  // 3 人或以上，都用最深的红色
  return 'busy-3-plus'
}

/**
 * 【核心】获取格子里要显示的文字
 */
function getSlotText(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  if (!heatmapData.value) return ''
  
  const busyCount = heatmapData.value[slotId] || 0
  
  // 0 (所有人有空) 的时候显示“空”，否则显示有课人数
  return busyCount === 0 ? '空' : busyCount
}
</script>

<template>
  <el-card shadow="never" class="page-card">
    <h1>空闲规划模式</h1>
    <p class="description">
      请上传你和你朋友们的多张课表截图，系统将为你计算出所有人共同的空闲时间。
    </p>

    <el-divider />
    <h2>1. 上传所有人的课表</h2>
    
    <el-upload
      class="uploader"
      :multiple="true"
      :auto-upload="false"
      list-type="picture-card"
      accept="image/*"
      v-model:file-list="fileList"
    >
      <el-icon><Plus /></el-icon>
      <template #tip>
        <div class="el-upload__tip">
          可以一次性选择多张图片，选完后点击下方的“开始计算”
        </div>
      </template>
    </el-upload>

    <el-divider />
    <h2>2. 开始计算</h2>

    <el-button 
      type="success" 
      size="large" 
      class="calculate-button"
      :loading="isCalculating"
      @click="handleCalculate"
    >
      {{ isCalculating ? '正在计算中...' : '计算共同空闲时间' }}
    </el-button>
    
    <el-divider />
    <h2>3. 查看结果 (热力图)</h2>

    <div v-if="heatmapData" class="legend">
      <span class="legend-item"><i class="box busy-0"></i> 所有人空闲</span>
      <span class="legend-item"><i class="box busy-1"></i> 1 人有课</span>
      <span class="legend-item"><i class="box busy-2"></i> 2 人有课</span>
      <span class="legend-item"><i class="box busy-3-plus"></i> 3+ 人有课</span>
    </div>

    <div v-if="heatmapData" class="schedule-grid">
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
          :class="getSlotClass(dayIndex, slotIndex)"
        >
          {{ getSlotText(dayIndex, slotIndex) }}
        </div>
      </template>
    </div>
    
    <div v-if="!heatmapData" class="placeholder">
      <p>（上传课表并点击“计算”后，此处将显示热力图）</p>
    </div>

  </el-card>
</template>

<style scoped>
.page-card {
  max-width: 1000px;
  margin: 20px auto;
}
.description {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
}
h2 {
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 20px;
}
.uploader {
  margin-top: 10px;
}
.calculate-button {
  margin-top: 10px;
  width: 100%;
}

/* --- 图例和占位符 (和 MemberRegister 类似) --- */
.legend {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.legend-item {
  display: flex;
  align-items: center;
  margin: 0 10px;
  font-size: 14px;
}
.legend-item .box {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #ccc;
  margin-right: 5px;
}
.placeholder {
  border: 2px dashed #dcdfe6;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  color: #909399;
  margin-top: 20px;
}

/* --- 网格样式 (和 CaptainCreate 类似) --- */
.schedule-grid {
  display: grid;
  grid-template-columns: 0.5fr repeat(7, 1fr);
  border: 1px solid #ccc;
  margin-top: 20px;
  user-select: none;
}

.header-cell {
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  text-align: center;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 30px;
  padding: 6px;
  font-size: 14px;
}
.schedule-grid .header-cell:nth-child(8n + 1) {
  font-size: 12px;
}

.slot-cell {
  border: 1px solid #ddd;
  min-height: 30px; 
  /* 【核心】在格子里显示文字 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}

/* --- 【核心】热力图的 4 种颜色 --- 
*/
/* 0人有课 (所有人空闲) - 绿色 */
.slot-cell.busy-0 {
  background-color: #e1f3e1;
  color: #67c23a;
}
.legend .box.busy-0 { background-color: #e1f3e1; }

/* 1人有课 - 黄色 */
.slot-cell.busy-1 {
  background-color: #fdf6ec;
  color: #e6a23c;
}
.legend .box.busy-1 { background-color: #fdf6ec; }

/* 2人有课 - 橙色 */
.slot-cell.busy-2 {
  background-color: #faecd8;
  color: #f56c6c;
}
.legend .box.busy-2 { background-color: #faecd8; }

/* 3+人有课 - 红色 */
.slot-cell.busy-3-plus {
  background-color: #fde2e2;
  color: #f56c6c;
}
.legend .box.busy-3-plus { background-color: #fde2e2; }

</style>