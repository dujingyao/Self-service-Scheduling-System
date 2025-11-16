import { createRouter, createWebHistory } from 'vue-router'

// --- 导入所有页面 ---
import HomeView from '../views/HomeView.vue'
import SelectRole from '../views/shift/SelectRole.vue'
import CaptainCreate from '../views/shift/CaptainCreate.vue'
import CaptainDashboard from '../views/shift/CaptainDashboard.vue'
import MemberJoin from '../views/shift/MemberJoin.vue'
import MemberRegister from '../views/shift/MemberRegister.vue'
import FreePlanHome from '../views/free-plan/FreePlanHome.vue'
import CaptainHome from '../views/shift/CaptainHome.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // --- 登记所有路由 ---
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/shift/select-role',
      name: 'SelectRole',
      component: SelectRole
    },
    {
      path: '/shift/captain/create',
      name: 'CaptainCreate',
      component: CaptainCreate
    },
    {
      // 动态路由，:captainCode 是一个变量
      path: '/shift/captain/dashboard/:captainCode',
      name: 'CaptainDashboard',
      component: CaptainDashboard,
      props: true
    },
    {
      path: '/shift/member/join',
      name: 'MemberJoin',
      component: MemberJoin
    },
    {
      // 动态路由，:captainCode 是一个变量
      path: '/shift/member/register/:captainCode',
      name: 'MemberRegister',
      component: MemberRegister,
      props: true
    },
    {
      path: '/free-plan',
      name: 'FreePlanHome',
      component: FreePlanHome
    },
    {
      path: '/shift/captain/home',
      name: 'CaptainHome',
      component: CaptainHome
    }
  ]
})

export default router