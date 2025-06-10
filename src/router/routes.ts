import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login', name: 'home' },
      { path: 'login', component: () => import('pages/LoginPage.vue'), name: 'login', meta: { requiresAuth: false } },
      { path: 'register', component: () => import('pages/RegisterPage.vue'), name: 'register', meta: { requiresAuth: false } },
      { path: 'callback', component: () => import('pages/CallbackPage.vue'), name: 'callback', meta: { requiresAuth: false } }
    ]
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    name: 'dashboard',
    meta: { requiresAuth: true },
    children: [
      { path: 'applications', component: () => import('pages/ApplicationsPage.vue'), name: 'applicationsList', meta: { requiresAuth: true } },
      { path: 'application-form', component: () => import('pages/ApplicationFormPage.vue'), name: 'applicationCreate', meta: { requiresAuth: true } },
      { path: 'application-form/:applicationId', component: () => import('pages/ApplicationFormPage.vue'), name: 'applicationEdit', meta: { requiresAuth: true } },
      { path: 'scholarshipSearch', component: () => import('pages/ScholarshipsPage.vue'), name: 'scholarshipSearch', meta: { requiresAuth: true } },
      { path: 'profile', component: () => import('pages/ProfilePage.vue'), name:'editProfile', meta: { requiresAuth: true } },
      { path: 'essays', component: () => import('pages/EssaysPage.vue'), name: 'essaysList', meta: { requiresAuth: true } },
      { path: 'essay-form', component: () => import('pages/EssayFormPage.vue'), name: 'essayCreate', meta: { requiresAuth: true } },
      { path: 'essay-form/:essayId', component: () => import('pages/EssayFormPage.vue'), name: 'essayEdit', meta: { requiresAuth: true } },
      { path: 'recommenders', component: () => import('pages/RecommendersPage.vue'), name: 'recommendersList', meta: { requiresAuth: true } },
      { path: 'recommender-form', component: () => import('pages/RecommenderFormPage.vue'), name: 'recommendersCreate', meta: { requiresAuth: true } },
      { path: 'recommender-form/:recommenderId', component: () => import('pages/RecommenderFormPage.vue'), name: 'recommenderEdit', meta: { requiresAuth: true } },
      { path: 'recommendation-form', component: () => import('pages/RecommendationFormPage.vue'), name: 'recommendationCreate', meta: { requiresAuth: true } },
      { path: 'recommendation-form/:recommendationId', component: () => import('pages/RecommendationFormPage.vue'), name: 'recommendationEdit', meta: { requiresAuth: true } },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
    name: 'not-found',
    meta: { requiresAuth: false }
  }
]

export default routes
