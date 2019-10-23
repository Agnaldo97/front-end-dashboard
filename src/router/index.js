import Vue from 'vue'
import Router from 'vue-router'
import Meta from 'vue-meta'

import globals from '@/globals'

// Layouts
import Layout1 from '@/layout/Layout1'

Vue.use(Router)
Vue.use(Meta)

const router = new Router({
  base: '/',
  mode: 'history',
  routes: [{
    path: '/',
    component: Layout1,
    children: [
      { path: '', component: () => import('@/components/Home') },
      { path: '/register', component: () => import('@/components/Register') }
    ]
  },
  {
    path: '/login',
    component: () => import('@/components/Login')
  }]
})

router.afterEach(() => {
  if (window.layoutHelpers && window.layoutHelpers.isSmallScreen() && !window.layoutHelpers.isCollapsed()) {
    setTimeout(() => window.layoutHelpers.setCollapsed(true, true), 10)
  }
  globals().scrollTop(0, 0)
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('access-token')
  document.body.classList.add('app-loading')
  setTimeout(() => next(), 10)
  if (to.path !== '/login') {
    if (!token) next('/login')
  }
})

export default router
