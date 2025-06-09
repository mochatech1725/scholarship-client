import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: () => import('pages/LoginPage.vue'), meta: { requiresAuth: false } },
      { path: 'register', component: () => import('pages/RegisterPage.vue'), meta: { requiresAuth: false } },
      { path: 'callback', component: () => import('pages/CallbackPage.vue'), meta: { requiresAuth: false } }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // { path: '', redirect: '/dashboard/applications' },
      { path: 'applications', component: () => import('pages/ApplicationsPage.vue'), meta: { requiresAuth: true } },
      { path: 'application-form', component: () => import('pages/ApplicationFormPage.vue'), meta: { requiresAuth: true } },
      { path: 'application-form/:id', component: () => import('pages/ApplicationFormPage.vue'), meta: { requiresAuth: true } },
      { path: 'scholarships', component: () => import('pages/ScholarshipsPage.vue'), meta: { requiresAuth: true } },
      { path: 'profile', component: () => import('pages/ProfilePage.vue'), meta: { requiresAuth: true } },
      { path: 'essays', component: () => import('pages/EssaysPage.vue'), meta: { requiresAuth: true } },
      { path: 'essay-form', component: () => import('pages/EssayFormPage.vue'), meta: { requiresAuth: true } },
      { path: 'essay-form/:id', component: () => import('pages/EssayFormPage.vue'), meta: { requiresAuth: true } },
      { path: 'recommenders', component: () => import('pages/RecommendersPage.vue'), meta: { requiresAuth: true } },
      { path: 'recommender-form', component: () => import('pages/RecommenderFormPage.vue'), meta: { requiresAuth: true } },
      { path: 'recommender-form/:id', component: () => import('pages/RecommenderFormPage.vue'), meta: { requiresAuth: true } },
      { path: 'recommendation-form', component: () => import('pages/RecommendationFormPage.vue'), meta: { requiresAuth: true } },
      { path: 'recommendation-form/id', component: () => import('pages/RecommendationFormPage.vue'), meta: { requiresAuth: true } },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    meta: { requiresAuth: false }
  }
]

export default routes
