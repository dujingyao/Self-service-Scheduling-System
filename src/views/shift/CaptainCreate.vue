<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Plus } from '@element-plus/icons-vue'

const router = useRouter()

// --- V2.0 模板状态 (无变化) ---
const isTemplateUploaded = ref(false)
const isTemplateUploading = ref(false)
const totalSlots = ref(0)
const days = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])

// --- 【【 V2.2 核心：两种约束并存 】】 ---

// 1. (新) 时段约束 (Rule A)
const slotRequirements = ref({}) // { "0-1": 2, "1-5": 3 }
const capacityMode = ref('fixed') // 'fixed' 或 'dynamic'
const fixedCapacity = ref(1)

// 2. (加回来!) 队员约束 (Rule B)
const minShifts = ref(0)
const maxShifts = ref(1)

/**
 * 【V2.0】处理课表模板上传 (无变化)
 */
function handleTemplateUpload(options) {
  isTemplateUploading.value = true
  setTimeout(() => {
    const fakeTemplateResponse = {
      totalSlots: 10
    }
    totalSlots.value = fakeTemplateResponse.totalSlots
    isTemplateUploading.value = false
    isTemplateUploaded.value = true
  }, 1500)
}

/**
 * 【V2.1】格子交互逻辑 (无变化)
 */
function toggleSlot(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  
  if (capacityMode.value === 'fixed') {
    if (slotRequirements.value[slotId]) {
      delete slotRequirements.value[slotId]
    } else {
      slotRequirements.value[slotId] = fixedCapacity.value
    }
  } 
  else {
    let currentCapacity = slotRequirements.value[slotId] || 0
    currentCapacity = (currentCapacity + 1) % 4
    
    if (currentCapacity === 0) {
      delete slotRequirements.value[slotId]
    } else {
      slotRequirements.value[slotId] = currentCapacity
    }
  }
}

/**
 * 【V2.1】格子辅助函数 (无变化)
 */
function getSlotText(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  return slotRequirements.value[slotId] || ''
}
function isSlotSelected(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  return !!slotRequirements.value[slotId]
}

/**
 * 【【 V2.2 核心重构：最终提交逻辑 】】
 */
function handleGenerate() {
  if (Object.keys(slotRequirements.value).length === 0) {
    alert('请至少选择一个需要值班的时间段！')
    return
  }

  // 【 V2.2 】打包“所有”约束
  const dataToSend = {
    // 1. 模板信息
    totalSlots: totalSlots.value,
    
    // 2. 时段约束 (Rule A)
    slotRequirements: slotRequirements.value,
    
    // 3. 队员约束 (Rule B)
    memberConstraints: {
      min: minShifts.value,
      max: maxShifts.value
    }
  }

  console.log('--- V2.2 正在假装发送最终数据给后端 ---', dataToSend)
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

    <div v-if="!isTemplateUploaded" class="template-uploader-container">
      <h1>队长：创建值班</h1>
      <p class="description">
        为了统一所有人的课表结构，请先上传一张本学期（或本次排班）的**课表示例图**。
      </p>
      <el-divider />
      
      <el-upload
        class="template-uploader"
        drag
        action="#"
        :http-request="handleTemplateUpload"
        :show-file-list="false"
        :disabled="isTemplateUploading"
      >
        <el-icon class="el-icon--upload"><Plus /></el-icon>
        <div class="el-upload__text">
          拖拽一张课表示例图到此处，或 <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            （系统将自动识别该课表有几节课，例如 10 节或 12 节）
          </div>
        </template>
      </el-upload>
      
      <div v-if="isTemplateUploading" class="uploading-mask">
        <el-progress 
          :percentage="100" 
          :indeterminate="true" 
          :stroke-width="15" 
          status="success"
          striped 
          striped-flow 
        />
        <p>正在智能识别课表结构，请稍候...</p>
      </div>
    </div>

    <el-row :gutter="30" v-if="isTemplateUploaded">
      
      <el-col :span="9">
        <h1>队长：创建值班</h1>
        <p class="description">模板识别成功！总共 {{ totalSlots }} 节课。</p>
        
        <el-divider />
        <h2>1. 时段约束 (每时段)</h2>
        
        <el-form label-width="120px" class="form-section">
          <el-form-item label="人数模式">
            <el-radio-group v-model="capacityMode">
              <el-radio-button label="fixed">固定人数</el-radio-button>
              <el-radio-button label="dynamic">动态人数</el-radio-button>
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="每时段人数" v-if="capacityMode === 'fixed'">
            <el-input-number v-model="fixedCapacity" :min="1" :max="10" />
            <span> 人</span>
          </el-form-item>
          
          <el-form-item label="" v-if="capacityMode === 'dynamic'">
            <p class="description">
              请在右侧表格中**直接点击**格子。
              <br>
              (每点一次 +1，最多 3 人，超过 3 会变回“空”)
            </p>
          </el-form-item>
        </el-form>
        
        <el-divider />
        <h2>2. 队员约束 (每人)</h2>
        
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
        <h2>3. 生成队长码</h2>
        
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
              :class="{ 'selected': isSlotSelected(dayIndex, slotIndex) }"
              @click="toggleSlot(dayIndex, slotIndex)"
            >
              {{ getSlotText(dayIndex, slotIndex) }}
            </div>
          </template>
        </div>
      </el-col>
      
    </el-row>
  </el-card>
</template>

<style scoped>
/* (所有样式都和 V2.1 一样，无需修改！) */
.page-card {
  max-width: 1400px;
  margin: 20px auto;
}
.template-uploader-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}
.template-uploader {
  margin-top: 20px;
}
.uploading-mask {
  margin-top: 20px;
}
.uploading-mask p {
  margin-top: 10px;
  font-size: 16px;
  color: #67c23a;
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
.form-section {
  margin-top: 10px;
}
.generate-button {
  margin-top: 10px;
  width: 100%;
}
.schedule-grid {
  display: grid;
  grid-template-columns: 0.7fr repeat(7, 1fr);
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
  cursor: pointer;
  background-color: #fff;
  transition: background-color 0.2s;
  min-height: 30px; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
}
.slot-cell:hover {
  background-color: #f0f0f0;
}
.slot-cell.selected {
  background-color: #409EFF;
}
.slot-cell:not(.selected) {
  color: transparent;
}
</style>