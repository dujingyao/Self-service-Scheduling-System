<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const days = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
const totalSlots = ref(10)
const selectedSlots = ref(new Set())

function toggleSlot(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  if (selectedSlots.value.has(slotId)) {
    selectedSlots.value.delete(slotId)
  } else {
    selectedSlots.value.add(slotId)
  }
}

function isSelected(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  return selectedSlots.value.has(slotId)
}

const minShifts = ref(0)
const maxShifts = ref(1)

function handleGenerate() {
  const dataToSend = {
    min: minShifts.value,
    max: maxShifts.value,
    slots: Array.from(selectedSlots.value)
  }
  console.log('--- 正在假装发送数据给后端 ---', dataToSend)
  alert('正在生成队长码... (模拟网络请求)')
  
  setTimeout(() => {
    const fakeCaptainCode = 'ABCD12'
    router.push({ 
      name: 'CaptainDashboard',
      params: { captainCode: fakeCaptainCode }
    })
  }, 1000)
}
</script>

<template>
  <el-card shadow="never" class="page-card">
    <el-row :gutter="30">
      
      <el-col :span="9">
        <h1>队长：创建值班</h1>
        <p class="description">请设置值班约束，并在右侧表格中勾选需要排班的时间段。</p>
        
        <el-divider />
        <h2>1. 值班约束</h2>
        
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
        
        <el-divider />
        <h2>2. 生成队长码</h2>
        
        <el-button 
          type="primary" 
          size="large"
          class="generate-button"
          @click="handleGenerate"
        >
          生成队长码
        </el-button>
      </el-col>

      <el-col :span="15">
        <h2>请选择值班时间段</h2>
        
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
      </el-col>
      
    </el-row>
  </el-card>
</template>

<style scoped>
.page-card {
  max-width: 1400px;
  margin: 20px auto;
}

/* 左侧栏的样式 */
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
.form-section {
  margin-top: 10px;
}
.generate-button {
  margin-top: 10px;
  width: 100%;
}

/* 表格样式 */
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

/* 行表头的样式 */
.schedule-grid .header-cell:nth-child(8n + 1) {
  font-size: 12px;
}

.slot-cell {
  border: 1px solid #ddd;
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.2s;
  min-height: 30px; 
}

.slot-cell:hover {
  background-color: #f0f0f0;
}

.slot-cell.selected {
  background-color: #409EFF;
}
</style>