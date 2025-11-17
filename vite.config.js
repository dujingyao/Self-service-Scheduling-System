// --- 复制 vite.config.js ---
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  // --- 【【 V2.4 核心：添加代理 】】 ---
  server: {
    proxy: {
      // 字符串简写
      // '/foo': 'http://localhost:4567',

      // 选项写法
      '/api': {
        // 这是我们“假装”的后端服务器地址
        target: 'http://localhost:8000', 
        changeOrigin: true, // 必须
        // (我们不需要重写路径，因为 Vite 会自动把 
        // /api/plan/verify 转发到 http://localhost:8000/api/plan/verify)
      }
    }
  }
  // --- 【【 代理配置结束 】】 ---

})