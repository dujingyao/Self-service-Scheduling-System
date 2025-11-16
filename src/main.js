// 1. 从 'vue' 中导入 createApp，这是创建 Vue 应用的基础
import { createApp } from 'vue'

// 2. 导入我们刚才安装的 Element Plus
import ElementPlus from 'element-plus'
// 3. 导入 Element Plus 的 CSS 样式文件 (非常重要，否则没有样式)
import 'element-plus/dist/index.css'

// 4. 导入 Pinia 状态管理
import { createPinia } from 'pinia'

// 5. 导入 App.vue (这是你的“根组件”，所有页面的容器)
import App from './App.vue'
// 6. 导入我们创建的路由
import router from './router'

// 7. 创建应用实例
const app = createApp(App)

// 8. 注册插件 (告诉 Vue 使用我们导入的东西)
app.use(createPinia()) // 使用 Pinia
app.use(router)       // 使用 Router
app.use(ElementPlus)  // 使用 Element Plus

// 9. 最后，把应用“挂载”到 HTML 页面上
app.mount('#app')