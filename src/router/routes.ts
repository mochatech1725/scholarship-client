import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'register', component: () => import('pages/RegisterPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'applications', component: () => import('pages/ApplicationsPage.vue') },
      { path: 'application-form', component: () => import('pages/ApplicationFormPage.vue') },
      { path: 'application-form/:id', component: () => import('pages/ApplicationFormPage.vue') },
      { path: 'scholarships', component: () => import('pages/ScholarshipsPage.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
