import { createRouter, createWebHistory } from 'vue-router'
// @ts-ignore
import DefaultPage from '../pages/Defaultpage'
// @ts-ignore
import Login from '../components/Login'
// @ts-ignore
import Graphic from '../components/Graphic'

const routes = [
  {
    path: '/',
    name: 'DefaultPage',
    component: DefaultPage,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/graphic',
    name: 'Graphic',
    component: Graphic,
    meta: {
      requiresAuth: true
    }
  }
]

const router = createRouter({
  routes,
  history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token')
    token ? next() : router.push({ name: 'Login' });
  } else next();
});

export default router
