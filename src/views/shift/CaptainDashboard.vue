<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { Download, User } from '@element-plus/icons-vue'

const route = useRoute()
const captainCode = route.params.captainCode

// --- 状态 (无变化) ---
const isExporting = ref(false)
const exportDialogVisible = ref(false)
const exportText = ref('')
const memberList = ref([])


/**
 * 导出逻辑 (无变化)
 */
function handleExport() {
  isExporting.value = true
  setTimeout(() => {
    const fakeExportData = {
      plan: {
        totalSlots: 10,
        slotRequirements: { 
          "0-3": 2, "0-4": 1, "2-7": 3, "4-2": 2
        },
        memberConstraints: { min: 1, max: 3 }
      },
      finalRoster: [
        { name: "张三", phone: "13800138000", selectedSlot: "0-3" },
        { name: "李四", phone: "13900139000", selectedSlot: "0-4" },
        { name: "王五", phone: "13700137000", selectedSlot: "2-7" },
        { name: "赵六", phone: "13600136000", selectedSlot: "0-3" },
      ]
    };
    
    memberList.value = fakeExportData.finalRoster
    exportText.value = generateExportText(fakeExportData)
    isExporting.value = false
    exportDialogVisible.value = true
    
  }, 1500)
}

/**
 * 文本生成器 (无变化)
 */
function generateExportText(data) {
  let text = "智能排班助手 - 最终值班表\n";
  text += `队长码: ${captainCode}\n`;
  text += "=================================\n\n";
  text += "--- 1. 按时段汇总 ---\n";
  const { slotRequirements } = data.plan;
  const { finalRoster } = data;
  const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const slotsFilled = {};
  for (const member of finalRoster) {
    if (!slotsFilled[member.selectedSlot]) {
      slotsFilled[member.selectedSlot] = [];
    }
    slotsFilled[member.selectedSlot].push(member);
  }
  for (const slotId in slotRequirements) {
    const requiredCount = slotRequirements[slotId];
    const [dayIndex, slotIndex] = slotId.split('-');
    const slotName = `${days[dayIndex]} 第${slotIndex}节`;
    const members = slotsFilled[slotId] || [];
    text += `\n[ ${slotName} ]\n`;
    text += `  > 需求: ${requiredCount} 人, 已报: ${members.length} 人\n`;
    text += `  > ---------\n`;
    if (members.length > 0) {
      members.forEach((m, i) => {
        text += `    ${i + 1}. ${m.name} (${m.phone})\n`;
      });
    } else {
      text += `    (暂无人)\n`;
    }
  }
  text += "\n\n=================================\n";
  text += "--- 2. 队员原始数据 (CSV) ---\n";
  text += "姓名,电话,所选时段ID\n";
  finalRoster.forEach(m => {
    text += `${m.name},${m.phone},${m.selectedSlot}\n`;
  });
  return text;
}
</script>

<template>
  <el-card shadow="never" class="page-card">
    <div class="dashboard-container">
      
      <h1 class="title">队长仪表盘</h1>
      <p class="subtitle">你的值班计划已创建！</p>
      
      <div class="code-display">
        <p>你的队长码是：</p>
        <strong>{{ captainCode }}</strong>
      </div>
      
      <el-button 
        type="success" 
        size="large"
        class="export-button"
        :icon="Download"
        :loading="isExporting"
        @click="handleExport"
      >
        {{ isExporting ? '正在生成...' : '导出/刷新 最终值班表' }}
      </el-button>
      
      <el-divider />
      
      <h2>
        已报名队员 ({{ memberList.length }} 人)
      </h2>
      <el-table :data="memberList" border stripe class="member-table">
        <el-table-column type="index" label="#" width="50" />
        <el-table-column prop="name" label="姓名" :icon="User" />
        <el-table-column prop="phone" label="电话" />
        <el-table-column prop="selectedSlot" label="所选时段 (ID)" />
      </el-table>
      
    </div>
  </el-card>

  <el-dialog
    v-model="exportDialogVisible"
    title="导出值班表"
    width="70%"
  >
    <p>“假装”的后端已生成完毕！请**全选 (Ctrl+A)** 并**复制 (Ctrl+C)** 下方文本。</p>
    <el-input
      v-model="exportText"
      type="textarea"
      :rows="15"
      readonly
    />
    <template #footer>
      <el-button type="primary" @click="exportDialogVisible = false">
        关闭
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
.page-card {
  max-width: 900px;
  margin: 20px auto;
}
.dashboard-container {
  text-align: center;
}

/* --- 【【 V2.3 核心修改：收紧间距 】】 --- */

/* 1. 标题：减小底部间距 */
.title {
  font-size: 24px; /* 保持 H1 大小 */
  margin-bottom: 5px; /* (核心) 大幅减少 H1 下方间距 */
}

/* 2. 副标题：减小上下间距 */
.subtitle {
  margin-top: 0;
  margin-bottom: 15px; /* (核心) 减小 P 下方间距 */
  font-size: 16px;
  color: #606266;
}

/* 3. 队长码：减小 上间距 和 内边距 */
.code-display {
  background-color: #f5f5f5;
  padding: 15px; /* (核心) 内边距从 20px -> 15px */
  border-radius: 8px;
  margin-top: 10px; /* (核心) 上间距从 20px -> 10px */
  font-size: 1.1em; /* 减小一点 */
}
.code-display p {
  margin: 0; /* 移除 P 标签的默认间距 */
}
.code-display strong {
  font-size: 1.8em; /* (核心) 字体从 2em -> 1.8em */
  color: #E6A23C;
  display: block;
  margin: 5px 0; /* (核心) 上下间距从 10px -> 5px */
}

/* 4. 导出按钮：减小 上间距 */
.export-button {
  margin-top: 15px; /* (核心) 上间距从 20px -> 15px */
  width: 100%;
}
/* --- 【【 修改结束 】】 --- */


.member-table {
  margin-top: 20px;
}
</style>