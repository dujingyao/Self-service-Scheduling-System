<script setup>
import { ref, computed } from 'vue' // 【新增】导入 computed
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// === 【【 V2.2 核心：接收数据 】】 ===
// 1. 从 `state` 中安全地取出“排班详情”
//    ( window.history.state 是 VUE Router 底层使用的方法 )
const planDetails = ref(window.history.state.planDetails)

// 2. 检查：如果用户是“刷新”的此页面，state 会丢失
if (!planDetails.value) {
  // 这种情况下，我们必须把他踢回“加入页”
  alert('页面状态丢失，请重新加入值班！')
  router.push({ name: 'MemberJoin' })
  // (下面是空的，因为页面马上要跳转了)
}

// 3. 把“排班详情”存入“大脑” (ref)
// (注意：totalSlots 不再是 ref(10) 了！)
const totalSlots = ref(planDetails.value.totalSlots)
const slotRequirements = ref(planDetails.value.slotRequirements)
const memberConstraints = ref(planDetails.value.memberConstraints)
const currentSignups = ref(planDetails.value.currentSignups)

// --- (旧的) 基础信息 ---
const captainCode = route.params.captainCode
const name = ref('')
const phone = ref('')

// --- (旧的) 队员自己的状态 ---
const isUploading = ref(false)
const isUploadSuccess = ref(false)
const memberBusySlots = ref(new Set()) // 队员“有课” (来自OCR)
const mySelectedSlots = ref(new Set()) // 队员“已选” (VUE)

// --- (旧的) 网格“假数据” ---
const days = ref(['周一', '周二', '周三', '周四', '周五', '周六', '周日'])


/**
 * 【V2.2 计算属性】
 * 这是一个“动态计算”的 ref
 * 它会根据 mySelectedSlots 自动更新
 */
const selectedCount = computed(() => {
  return mySelectedSlots.value.size
})
// (我们稍后会在提示框里用它)


/**
 * (旧) 处理课表上传 (无变化)
 */
function handleUploadSchedule(options) {
  isUploading.value = true
  isUploadSuccess.value = false
  memberBusySlots.value.clear()
  mySelectedSlots.value.clear()

  setTimeout(() => {
    // (假装 OCR 识别出队员“有课”)
    const fakeResponse = {
      busy: ['1-1', '1-2', '2-3', '2-4', '4-9', '4-10'],
    }
    memberBusySlots.value = new Set(fakeResponse.busy)
    isUploading.value = false
    isUploadSuccess.value = true
  }, 1500)
}

/**
 * 【【 V2.2 核心：6 种状态逻辑 】】
 * (这是一个“状态机”)
 */
function getSlotState(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`

  // 状态 1: 队员已选 (最高优先级)
  if (mySelectedSlots.value.has(slotId)) {
    return { class: 'selected', text: '已选' }
  }

  // 状态 2: 队员有课 (来自OCR)
  if (memberBusySlots.value.has(slotId)) {
    return { class: 'busy', text: '有课' }
  }

  // 状态 3: 根本不是值班时段
  const required = slotRequirements.value[slotId]
  if (!required) {
    return { class: 'free', text: '' } // (空白)
  }

  // --- (到这里，说明是“值班时段” 且 队员“有空”) ---

  // 状态 4: 时段已满
  const signedUp = currentSignups.value[slotId] || 0
  const remaining = required - signedUp
  if (remaining <= 0) {
    return { class: 'full', text: '已满' }
  }

  // 状态 5: 时段可选！
  // (返回剩余人数)
  return { class: 'selectable', text: `剩 ${remaining} 人` }
  
  // (V2.1 的 'conflict' 状态被 'busy' 吸收了，更简单)
}

/**
 * 【【 V2.2 核心：点击逻辑 】】
 */
function toggleSlot(dayIndex, slotIndex) {
  const slotId = `${dayIndex}-${slotIndex}`
  
  // 1. 获取当前格子的状态
  const state = getSlotState(dayIndex, slotIndex)

  // 2. 检查是否“已选”
  if (state.class === 'selected') {
    // 如果是“已选”，则取消
    mySelectedSlots.value.delete(slotId)
    return
  }
  
  // 3. 检查是否“可选”
  if (state.class === 'selectable') {
    // 【新增约束】检查是否已达“最多”
    if (mySelectedSlots.value.size >= memberConstraints.value.max) {
      alert(`你最多只能选择 ${memberConstraints.value.max} 个时段！`)
      return
    }
    // 如果“可选”，则选中
    mySelectedSlots.value.add(slotId)
    return
  }
  
  // 4. 其他所有情况 (busy, free, full)，点击无效
  // (可以加一个抖动提示，但暂时先不做)
}

/**
 * 【V2.2】处理最终提交
 */
function handleSubmit() {
  // 【新增约束】检查是否达到“最少”
  if (mySelectedSlots.value.size < memberConstraints.value.min) {
    alert(`你最少需要选择 ${memberConstraints.value.min} 个时段！`)
    return
  }
  // (旧的验证)
  if (!name.value || !phone.value || !isUploadSuccess.value) {
    alert('请先填写姓名、电话并上传课表！')
    return
  }
  
  const finalData = {
    captainCode: captainCode,
    name: name.value,
    phone: phone.value,
    selectedSlots: Array.from(mySelectedSlots.value)
  }
  
  console.log('--- V2.2 正在假装提交最终选择给后端 ---', finalData)
  alert('提交成功！感谢你的参与！')
  router.push({ name: 'home' })
}
</script>

<template>
  <el-card shadow="never" class="page-card" v-if="planDetails">
    <el-row :gutter="30">
      
      <el-col :span="9">
        <h1>加入值班：<span class="code">{{ captainCode }}</span></h1>
        
        <el-alert
          type="info"
          show-icon
          :closable="false"
          class="constraints-alert"
        >
          <p>
            本次排班要求：
          </p>
          <ul>
            <li>每人最少选 <strong>{{ memberConstraints.min }}</strong> 个时段</li>
            <li>每人最多选 <strong>{{ memberConstraints.max }}</strong> 个时段</li>
          </ul>
          <p>
            您当前已选：<strong>{{ selectedCount }}</strong> / {{ memberConstraints.max }}
          </p>
        </el-alert>
        
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
          <span class="legend-item"><i class="box selectable"></i> 可选(剩x人)</span>
          <span class="legend-item"><i class="box selected"></i> 已选</span>
          <span class="legend-item"><i class="box busy"></i> 你的课程</span>
          <span class="legend-item"><i class="box full"></i> 时段已满</span>
          <span class="legend-item"><i class="box free"></i> 无需排班</span>
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
              :class="getSlotState(dayIndex, slotIndex).class"
              @click="toggleSlot(dayIndex, slotIndex)"
            >
              {{ getSlotState(dayIndex, slotIndex).text }}
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

/* --- 左侧栏样式 --- */
/* 【新增】约束提示框 */
.constraints-alert {
  line-height: 1.7;
}
.constraints-alert strong {
  font-size: 1.1em;
  color: #409EFF;
}

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

/* --- 右侧列样式 --- */
.legend {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.legend-item {
  display: flex;
  align-items: center;
  margin: 5px 10px;
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

/* --- 【【 V2.2 核心：6 种格子样式 】】 --- */
.slot-cell {
  border: 1px solid #ddd;
  transition: background-color 0.2s;
  min-height: 35px; /* 调高一点，容纳文字 */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px; /* 调小一点，防止换行 */
  font-weight: bold;
}

/* 1. 可选 (浅蓝) */
.slot-cell.selectable {
  background-color: #ecf5ff;
  color: #409EFF;
  cursor: pointer;
}
.slot-cell.selectable:hover { background-color: #d9ecff; }
.legend .box.selectable { background-color: #ecf5ff; }

/* 2. 已选 (深蓝) */
.slot-cell.selected {
  background-color: #409EFF;
  color: white;
  cursor: pointer;
}
.legend .box.selected { background-color: #409EFF; }

/* 3. 有课 (深灰) */
.slot-cell.busy {
  background-color: #dcdfe6;
  color: #909399;
  cursor: not-allowed;
  /* 【新增】有课时加斜线背景，更醒目 */
  background-image: linear-gradient(
    45deg, 
    rgba(255,255,255, .3) 25%, 
    transparent 25%, 
    transparent 50%, 
    rgba(255,255,255, .3) 50%, 
    rgba(255,255,255, .3) 75%, 
    transparent 75%, 
    transparent
  );
  background-size: 20px 20px;
}
.legend .box.busy { background-color: #dcdfe6; }

/* 4. 已满 (红色) */
.slot-cell.full {
  background-color: #fde2e2;
  color: #f56c6c;
  cursor: not-allowed;
}
.legend .box.full { background-color: #fde2e2; }

/* 5. 无需排班 (白色) */
.slot-cell.free {
  background-color: #fff;
  cursor: not-allowed;
}
.legend .box.free { background-color: #fff; }

</style>