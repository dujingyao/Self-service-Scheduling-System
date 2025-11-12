<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// --- 基础信息 (无变化) ---
const captainCode = route.params.captainCode
const name = ref('')
const phone = ref('')

// --- 【修改】上传和网格的状态 ---
const isUploading = ref(false)
const isUploadSuccess = ref(false)

// --- 【新增】网格布局的“假数据” ---
const days = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])
// 假装后端告诉我们，总共有 10 节课
const totalSlots = ref(10)

// --- 【新增】"记忆"后端返回的时间数据 ---
const memberBusySlots = ref(new Set())    // 队员“有课”的时段 (深色)
const availableShiftSlots = ref(new Set()) // 队员“可选”的时段 (浅色)

// --- 【修改】队员最终【勾选】的时段 ---
// 我们从数组改成 Set，和“队长页”一样，更适合网格
const mySelectedSlots = ref(new Set())

/**
 * 【核心】处理课表上传的函数
 */
function handleUploadSchedule(options) {
  console.log('--- 假装开始上传课表文件 ---', options.file.name)
  isUploading.value = true
  isUploadSuccess.value = false
  
  // 重置数据
  memberBusySlots.value.clear()
  availableShiftSlots.value.clear()
  mySelectedSlots.value.clear()

  // === 假装调用 API (1.5秒) ===
  setTimeout(() => {
    console.log('--- 假装后端 OCR + 计算完毕 ---')
    
    // === 【重大修改】假装后端返回了更复杂的数据 ===
    const fakeResponse = {
      // 1. 队员自己的课表 (深色格子)
      busy: ['1-1', '1-2', '2-3', '2-4', '4-9', '4-10'], // (周二 1-2节, 周三 3-4节, 周五 9-10节)
      // 2. 队员可以选的班 (可选的浅色格子)
      available: ['0-3', '0-4', '2-7', '2-8', '3-7', '3-8'] // (周一 3-4节, 周三 7-8节, 周四 7-8节)
      // (注意：我们用 0-6 代表 周一到周日)
    }
    
    // 把“假数据”存入我们的“记忆” (Set)
    memberBusySlots.value = new Set(fakeResponse.busy)
    availableShiftSlots.value = new Set(fakeResponse.available)
    
    isUploading.value = false
    isUploadSuccess.value = true
    
  }, 1500)
}

// --- 【新增】网格格子的辅助函数 ---

/**
 * 切换格子的选中状态
 */
function toggleSlot(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  
  // 【重要】只有“可选”的格子才能被点击！
  // 队员不能点击“有课”或“纯空闲”的格子
  if (!availableShiftSlots.value.has(slotId)) {
    // 如果这个格子不是“可选时段”，点击无效
    return 
  }

  // 剩下的逻辑和“队长页”一样
  if (mySelectedSlots.value.has(slotId)) {
    mySelectedSlots.value.delete(slotId)
  } else {
    mySelectedSlots.value.add(slotId)
  }
}

/**
 * 【核心】获取格子的 CSS 样式类
 * 这将决定格子是什么颜色！
 */
function getSlotClass(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  
  // 1. 优先级最高：是不是“已被队员选中”？
  if (mySelectedSlots.value.has(slotId)) {
    return 'selected' // 样式：已选 (深蓝)
  }
  // 2. 是不是“可选时段”？
  if (availableShiftSlots.value.has(slotId)) {
    return 'selectable' // 样式：可选 (浅蓝)
  }
  // 3. 是不是“队员有课”？
  if (memberBusySlots.value.has(slotId)) {
    return 'busy' // 样式：有课 (深灰)
  }
  // 4. 啥也不是
  return 'free' // 样式：空闲 (白色)
}
// ------------------------------------

/**
 * 【核心】处理最终提交
 */
function handleSubmit() {
  if (!name.value || !phone.value || !isUploadSuccess.value) {
    alert('请先填写姓名、电话并上传课表！')
    return
  }
  if (mySelectedSlots.value.size === 0) { // (Set 用 .size)
    alert('请至少选择一个你要值班的时段！')
    return
  }

  const finalData = {
    captainCode: captainCode,
    name: name.value,
    phone: phone.value,
    // (把 Set 转回数组，再发给后端)
    selectedSlots: Array.from(mySelectedSlots.value)
  }
  
  console.log('--- 正在假装提交最终选择给后端 ---', finalData)
  alert('提交成功！感谢你的参与！')
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="register-container">
    <h1>加入值班：{{ captainCode }}</h1>
    <p>请填写你的信息，并上传课表</p>

    <el-form label-width="80px" class="form-section">
      <el-form-item label="你的姓名">
        <el-input v-model="name" placeholder="请输入你的姓名" />
      </el-form-item>
      <el-form-item label="你的电话">
        <el-input v-model="phone" placeholder="请输入你的电话号码" />
      </el-form-item>
    </el-form>

    <hr>

    <h2>1. 上传你的课表</h2>
    <el-upload
      class="schedule-uploader"
      :http-request="handleUploadSchedule"
      :auto-upload="true"
      :show-file-list="false"
      :disabled="isUploading"
    >
      <el-button :type="isUploadSuccess ? 'success' : 'primary'" :loading="isUploading">
        {{ isUploading ? '正在识别中...' : (isUploadSuccess ? '上传成功！重新上传' : '点击上传课表截图') }}
      </el-button>
      <template #tip>
        <div class="el-upload__tip">
          （系统将自动计算你的空闲时间）
        </div>
      </template>
    </el-upload>

    <hr>

    <div v-if="isUploadSuccess" class="slots-section">
      <h2>2. 选择你要值班的时间</h2>
      
      <div class="legend">
        <span class="legend-item"><i class="box busy"></i> 你的课程</span>
        <span class="legend-item"><i class="box selectable"></i> 可选时段</span>
        <span class="legend-item"><i class="box selected"></i> 已选时段</span>
        <span class="legend-item"><i class="box free"></i> 你的空闲</span>
      </div>

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
            
            :class="getSlotClass(dayIndex, slotIndex)"
            
            @click="toggleSlot(dayIndex, slotIndex)"
          >
          </div>
        </template>
      </div>
    </div>
    <el-button 
      type="success" 
      size="large"
      class="submit-button"
      :disabled="!isUploadSuccess"
      @click="handleSubmit"
    >
      提交我的选择
    </el-button>
  </div>
</template>

<style scoped>
/* --- 基础样式 (无变化) --- */
.register-container {
  max-width: 800px; /* 【修改】改宽一点以容纳表格 */
  margin: 20px auto;
  padding: 20px;
}
.form-section, .schedule-uploader, .slots-section {
  margin-top: 20px;
  margin-bottom: 20px;
}
.submit-button {
  margin-top: 20px;
  width: 100%;
}

/* --- 【新增】图例样式 --- */
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

/* --- 【新增】网格样式 (复制自 CaptainCreate.vue) --- */
.schedule-grid {
  display: grid;
  grid-template-columns: 0.5fr repeat(7, 1fr);
  border: 1px solid #ccc;
  margin-top: 20px;
  user-select: none;
}
.header-cell {
  background-color: #f5f5f5;
  padding: 8px;
  border: 1px solid #ddd;
  text-align: center;
  font-weight: bold;
}

/* --- 【核心修改】格子的 4 种状态样式 --- */
.slot-cell {
  border: 1px solid #ddd;
  transition: background-color 0.2s;
}

/* 1. 有课 (深色) */
.slot-cell.busy {
  background-color: #dcdfe6; /* Element Plus 的灰色 */
  cursor: not-allowed; /* 鼠标：禁止 */
}
/* (同时给图例用) */
.legend .box.busy { background-color: #dcdfe6; }

/* 2. 可选 (浅色) */
.slot-cell.selectable {
  background-color: #ecf5ff; /* Element Plus 的浅蓝色 */
  cursor: pointer; /* 鼠标：小手 */
}
.slot-cell.selectable:hover {
  background-color: #d9ecff;
}
/* (同时给图例用) */
.legend .box.selectable { background-color: #ecf5ff; }

/* 3. 已选 (深色) */
.slot-cell.selected {
  background-color: #409EFF; /* Element Plus 的主蓝色 */
  cursor: pointer;
}
/* (同时给图例用) */
.legend .box.selected { background-color: #409EFF; }

/* 4. 空闲 (白色) */
.slot-cell.free {
  background-color: #fff;
  cursor: not-allowed;
}
/* (同时给图例用) */
.legend .box.free { background-color: #fff; }

</style>