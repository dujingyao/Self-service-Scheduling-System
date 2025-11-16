<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const captainCode = route.params.captainCode
const name = ref('')
const phone = ref('')
const isUploading = ref(false)
const isUploadSuccess = ref(false)
const days = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
const totalSlots = ref(10)
const memberBusySlots = ref(new Set())
const availableShiftSlots = ref(new Set())
const mySelectedSlots = ref(new Set())

function handleUploadSchedule(options) {
  isUploading.value = true
  isUploadSuccess.value = false
  memberBusySlots.value.clear()
  availableShiftSlots.value.clear()
  mySelectedSlots.value.clear()

  setTimeout(() => {
    const fakeResponse = {
      busy: ['1-1', '1-2', '2-3', '2-4', '4-9', '4-10'],
      available: ['0-3', '0-4', '2-7', '2-8', '3-7', '3-8']
    }
    memberBusySlots.value = new Set(fakeResponse.busy)
    availableShiftSlots.value = new Set(fakeResponse.available)
    isUploading.value = false
    isUploadSuccess.value = true
  }, 1500)
}

function toggleSlot(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  if (!availableShiftSlots.value.has(slotId)) return 
  if (mySelectedSlots.value.has(slotId)) {
    mySelectedSlots.value.delete(slotId)
  } else {
    mySelectedSlots.value.add(slotId)
  }
}

function getSlotClass(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  if (mySelectedSlots.value.has(slotId)) return 'selected'
  if (availableShiftSlots.value.has(slotId)) return 'selectable'
  if (memberBusySlots.value.has(slotId)) return 'busy'
  return 'free'
}

function handleSubmit() {
  if (!name.value || !phone.value || !isUploadSuccess.value) {
    alert('请先填写姓名、电话并上传课表！')
    return
  }
  if (mySelectedSlots.value.size === 0) {
    alert('请至少选择一个你要值班的时段！')
    return
  }
  const finalData = {
    captainCode: captainCode,
    name: name.value,
    phone: phone.value,
    selectedSlots: Array.from(mySelectedSlots.value)
  }
  console.log('--- 正在假装提交最终选择给后端 ---', finalData)
  alert('提交成功！感谢你的参与！')
  router.push({ name: 'home' })
}
</script>

<template>
  <el-card shadow="never" class="page-card">
    <el-row :gutter="30">
      
      <el-col :span="9">
        <h1>加入值班：<span class="code">{{ captainCode }}</span></h1>
        <p class="description">请填写信息、上传课表，然后在右侧表格中选择时段。</p>
        
        <el-divider />
        <h2>1. 填写信息</h2>
        
        <el-form label-width="80px" class="form-section">
          <el-form-item label="你的姓名">
            <el-input v-model="name" placeholder="请输入你的姓名" />
          </el-form-item>
          <el-form-item label="你的电话">
            <el-input v-model="phone" placeholder="请输入你的电话号码" />
          </el-form-item>
        </el-form>
        
        <el-divider />
        <h2>2. 上传课表</h2>
        
        <el-upload
          class="schedule-uploader"
          :http-request="handleUploadSchedule"
          :auto-upload="true"
          :show-file-list="false"
          :disabled="isUploading"
        >
          <el-button :type="isUploadSuccess ? 'success' : 'primary'" :loading="isUploading">
            {{ isUploading ? '正在识别中...' : (isUploadSuccess ? '上传成功！' : '点击上传课表') }}
          </el-button>
        </el-upload>
        
        <el-divider />
        <h2>3. 提交</h2>
        
        <el-button 
          type="success" 
          size="large"
          class="submit-button"
          :disabled="!isUploadSuccess"
          @click="handleSubmit"
        >
          提交我的选择
        </el-button>
      </el-col>

      <el-col :span="15">
        <h2>请选择值班时间段</h2>
        
        <div v-if="isUploadSuccess" class="legend">
          <span class="legend-item"><i class="box busy"></i> 你的课程</span>
          <span class="legend-item"><i class="box selectable"></i> 可选时段</span>
          <span class="legend-item"><i class="box selected"></i> 已选时段</span>
          <span class="legend-item"><i class="box free"></i> 你的空闲</span>
        </div>

        <div v-if="isUploadSuccess" class="schedule-grid">
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
              @click="toggleSlot(dayIndex, slotIndex)"
            >
            </div>
          </template>
        </div>
        
        <div v-if="!isUploadSuccess" class="placeholder">
          <p>（请先上传课表，此处将显示可选时段）</p>
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
.code {
  color: #E6A23C;
  font-family: monospace;
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
.schedule-uploader {
  margin-top: 10px;
}
.submit-button {
  margin-top: 10px;
  width: 100%;
}

/* 右侧列的样式 */
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
  transition: background-color 0.2s;
  min-height: 30px;
}
.slot-cell.busy {
  background-color: #dcdfe6;
  cursor: not-allowed;
}
.legend .box.busy { background-color: #dcdfe6; }
.slot-cell.selectable {
  background-color: #ecf5ff;
  cursor: pointer;
}
.slot-cell.selectable:hover { background-color: #d9ecff; }
.legend .box.selectable { background-color: #ecf5ff; }
.slot-cell.selected {
  background-color: #409EFF;
  cursor: pointer;
}
.legend .box.selected { background-color: #409EFF; }
.slot-cell.free {
  background-color: #fff;
  cursor: not-allowed;
}
.legend .box.free { background-color: #fff; }
</style>