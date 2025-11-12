// --- 复制开始 ---
import { createRouter, createWebHistory } from 'vue-router'
import MemberRegister from '../views/shift/MemberRegister.vue'
// 导入我们的“主页”
import HomeView from '../views/HomeView.vue'
// 导入我们【刚刚创建】的“角色选择页”
import SelectRole from '../views/shift/SelectRole.vue'
import CaptainCreate from '../views/shift/CaptainCreate.vue'
import MemberJoin from '../views/shift/MemberJoin.vue'
import CaptainDashboard from '../views/shift/CaptainDashboard.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // routes 数组就是我们的“GPS 登记表”
  routes: [
    {
      // 网址路径：/ (根目录)
      path: '/',
      name: 'home',
      // 对应的“相片”：HomeView
      component: HomeView
    },
    {
      // 网址路径：/shift/select-role
      path: '/shift/select-role',
      name: 'SelectRole',
      // 对应的“相片”：SelectRole
      component: SelectRole
    },
    // --- 新增路由 ---
    {
      path: '/shift/captain/create', // 队长创建页的网址
      name: 'CaptainCreate',
      component: CaptainCreate
    },
    // --- 新增路由 ---
    {
      path: '/shift/member/join', // 队员加入页的网址
      name: 'MemberJoin',
      component: MemberJoin
    },
    {
    // 看这里！:captainCode 
    // 这个冒号 : 告诉 VUE，这个部分是“动态”的
    // 它可以匹配 /captain/dashboard/ABCD12
    // 也可以匹配 /captain/dashboard/XYZ987
    path: '/shift/captain/dashboard/:captainCode',
    name: 'CaptainDashboard',
    component: CaptainDashboard,
    // props: true 能让我们更方便地在组件里接收 captainCode
    props: true 
    },
    {
      // 网址会是 /shift/member/register/ABCD12 这样的
      path: '/shift/member/register/:captainCode',
      name: 'MemberRegister',
      component: MemberRegister,
      props: true
    }
  ]
})

export default router
// --- 复制结束 ---